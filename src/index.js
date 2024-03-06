var loggedIn = true
var email = undefined
var gamePref = "open"
var saveURL = ""
var currentGamesNum
const response = await chrome.runtime.sendMessage({command:"checkAuth"}).then((res)=>{email = res["email"]})

function removeGames(){
    let gameList = document.getElementsByClassName("game-list")[0]
    gameList.innerHTML = ""
}
let loginButton = document.getElementsByClassName('button-login')[0]
loginButton.addEventListener("click", function(){
    let emailtemp = document.getElementsByClassName('email-login')[0].value
    let password = document.getElementsByClassName('password-login')[0].value
    if (emailtemp.length == 0 || password.length == 0){
        alert("Empty fields are not allowed!")
    }
    else{
        chrome.runtime.sendMessage({command:"login", email:emailtemp, password:password}, (response)=>{
            if (response === null){
                alert("Invalid login credentials!")
            }
            else{
                email = emailtemp
                document.getElementsByClassName("login")[0].style.display='none'
                document.getElementsByClassName("register")[0].style.display='none'
                document.getElementsByClassName("logout")[0].style.display='block'
                document.getElementsByClassName('email-login')[0].value = ""
                document.getElementsByClassName('password-login')[0].value = ""
            }
        })
    }
})
let toRegisterButton = document.getElementsByClassName('button-to-register')[0]
toRegisterButton.addEventListener("click", function(){
    document.getElementsByClassName("login")[0].style.display='none'
    document.getElementsByClassName("register")[0].style.display='block'
    document.getElementsByClassName("logout")[0].style.display='none'
})
let registerButtonNew = document.getElementsByClassName('button-register')[0]
registerButtonNew.addEventListener("click", function(){
    let emailtemp = document.getElementsByClassName('email-register')[0].value
    let password = document.getElementsByClassName('password-register')[0].value
    if (emailtemp.length == 0 || password.length == 0){
        alert("Empty fields are not allowed!")
    }
    else{
        chrome.runtime.sendMessage({command:"register", email:emailtemp, password:password}, (response)=>{
            if (response === null){
                alert("Error creating new user")
            }
            else{
                chrome.runtime.sendMessage({command:"login", email:emailtemp, password:password})
                email = emailtemp
                document.getElementsByClassName("login")[0].style.display='none'
                document.getElementsByClassName("register")[0].style.display='none'
                document.getElementsByClassName("logout")[0].style.display='block'
                document.getElementsByClassName('email-register')[0].value = ""
                document.getElementsByClassName('password-register')[0].value = ""
            }
        })
    }
})
let saveAnalysisButton = document.getElementsByClassName('save-analysis')[0]
saveAnalysisButton.addEventListener("click",function(){

    chrome.runtime.sendMessage({command:"checkAuth"},async (response)=>{
        if (response != false){
            var gameName = document.getElementsByClassName('analysis-name')[0].value
            if (gameName.length == 0){
                alert("Please enter a name for the game!")
                return
            }
            chrome.storage.local.set({gamePref:"save", gameName:gameName, email:email})
            await chrome.tabs.query({active:true, currentWindow:true}, async tabs=>{
                await chrome.scripting.executeScript({target:{tabId: tabs[0].id}, func:clickButtons,})
            })
        }
    })
})
let transferButton = document.getElementsByClassName('transfer-button')[0]
var pgn;
transferButton.addEventListener("click", function(){
    chrome.storage.local.set({gamePref:"open"})
    chrome.tabs.query({active:true, currentWindow:true}, async tabs=>{
        await chrome.scripting.executeScript({target:{tabId: tabs[0].id}, func:clickButtons,})
    })
})
let homeButton = document.getElementsByClassName('nav-click')[0]
homeButton.addEventListener("click", function(){
        removeGames()
        document.getElementsByClassName("home-tab")[0].style.display = 'block'
        document.getElementsByClassName("saved-tab")[0].style.display = 'none'
        document.getElementsByClassName("register-tab")[0].style.display = 'none'
})
let savedButton = document.getElementsByClassName('nav-click')[1]
savedButton.addEventListener("click", async function(){
    if (document.getElementsByClassName("saved-tab")[0].style.display === "none"){
        document.getElementsByClassName("home-tab")[0].style.display = 'none'
        document.getElementsByClassName("saved-tab")[0].style.display = 'inline-block'
        document.getElementsByClassName("register-tab")[0].style.display = 'none'
        if(email != undefined){
            const gameList = document.getElementsByClassName("game-list")[0]
            gameList.style.display = 'inline-block'
            document.getElementsByClassName("login-message")[0].style.display = 'none'
            await chrome.runtime.sendMessage({command:"getGames", email:email},(response)=>{
                currentGamesNum = response.length
                var list = document.getElementsByClassName("game-list")[0]
                response.forEach((game)=>{
                    var fields = game["_delegate"]["_document"]["data"]["value"]["mapValue"]["fields"]
                    var li = document.createElement("div")
                    li.className = "game-tab"
                    var innerHTML = ""
                    innerHTML += `
                        <div class="game-left-div">
                            <h1 class="saved-game-title">${fields["gameName"]["stringValue"]}</h1>
                            <h1 class="saved-game-text">${fields["white"]["stringValue"]} (White) vs ${fields["black"]["stringValue"]} (Black)</h1>
                        </div>
                    `
                    li.innerHTML = innerHTML
                    li.addEventListener("click",()=>{
                        window.open(fields["url"]["stringValue"])
                    })
                    list.appendChild(li)


                })
                
            })
        }
    else{
        document.getElementsByClassName("login-message")[0].style.display = 'inline-block'
        document.getElementsByClassName("game-list")[0].style.display = 'none'
    }
    }
})
let registerButton = document.getElementsByClassName('nav-click')[2]
registerButton.addEventListener("click", function(){
        removeGames()
        document.getElementsByClassName("home-tab")[0].style.display = 'none'
        document.getElementsByClassName("saved-tab")[0].style.display = 'none'
        document.getElementsByClassName("register-tab")[0].style.display = 'block'
        if (email === undefined){
            document.getElementsByClassName("login")[0].style.display='block'
            document.getElementsByClassName("register")[0].style.display='none'
            document.getElementsByClassName("logout")[0].style.display='none'
        }
        else{
            document.getElementsByClassName("login")[0].style.display='none'
            document.getElementsByClassName("register")[0].style.display='none'
            document.getElementsByClassName("logout")[0].style.display='block'
        }
})

let logoutButton = document.getElementsByClassName("button-logout")[0]
logoutButton.addEventListener("click", function(){
    chrome.runtime.sendMessage({command:"logout"},response=>{
        email = undefined
        document.getElementsByClassName("login")[0].style.display='block'
        document.getElementsByClassName("register")[0].style.display='none'
        document.getElementsByClassName("logout")[0].style.display='none'
    })
})


 async function clickButtons(){
    const container = document.querySelectorAll("body")[0];
    let observer = new MutationObserver(async(records, observer)=>{
        for (const record of records){
            for (const addedNode of record.addedNodes){
                if (addedNode.nodeName == "A"){
                    target = addedNode.parentElement
                    pgn = target.getAttribute("pgn")
                    observer.disconnect()
                    var exitButton = document.getElementsByClassName("icon-font-chess x ui_outside-close-icon")[0]
                    exitButton.click()
                    let body = {pgn:pgn}
                    let bodyConv = new URLSearchParams(Object.entries(body)).toString()
                    await fetch("https://lichess.org/api/import", {
                        method:"POST",
                        body:bodyConv,
                        headers:{"Accept":"application/json","Content-type":"application/x-www-form-urlencoded"}
                    }).then(response => response.json()).then(async (response)=>{
                        var index = pgn.indexOf("White")
                        var p1 = pgn.indexOf('\"', index)
                        var p2 = pgn.indexOf('\"', p1 + 1)
                        var white = pgn.substring(p1 + 1, p2)
                        var index = pgn.indexOf("Black")
                        var p1 = pgn.indexOf('\"', index)
                        var p2 = pgn.indexOf('\"', p1 + 1)
                        var black = pgn.substring(p1 + 1, p2)
                        var gamePref = await chrome.storage.local.get(["gamePref"])
                        if (gamePref.gamePref === "save"){
                            var gameName = await chrome.storage.local.get(["gameName"])
                            var email = await chrome.storage.local.get(["email"])
                            chrome.runtime.sendMessage({command:"saveAnalysis", url:response["url"], email: email.email,title:gameName.gameName, white: white, black: black}, (response)=>{
                                alert("Analysis Saved!")
                            })
                            return {command:"saveAnalysis", email: email.email, url:response["url"], title:gameName.gameName, white: white, black: black}
                        }
                        else{
                            window.open(response["url"])
                        }
                        chrome.storage.local.clear()
 })
                    
                    break
                }
            }
            if (record.target.childNodes.length == 0){
                observer.disconnect()
            }
        }
    })
    
    const observerOptions = {
        childList:true,
        subtree:true
    }
    var shareButton = document.getElementsByClassName("icon-font-chess share live-game-buttons-button")
        var button = shareButton[0]
        button.click()
     observer.observe(container, observerOptions)
    check()
}

    
