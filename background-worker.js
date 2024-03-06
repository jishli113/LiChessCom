const firebaseConfig = {
  apiKey: "AIzaSyDK9TQ1yAagT-pQ4T5KOkgeaHS__rJkIFs",
  authDomains: "lichesss-11124.firebaseapp.com",
  projectId: "lichesss-11124",
  storageBucket: "lichesss-11124.appspot.com",
  messagingSenderId: "682050169596",
  appId: "1:682050169596:web:cae7560686258b3c68c579",
  measurementId: "G-X8XQH636SN"
};
importScripts('./src/firebase-compat.js')
      const app = firebase.initializeApp(firebaseConfig)
      const db = firebase.firestore(app)
async function checkAuth(){
  var user = firebase.auth().currentUser
  if (user){
    return user
  }
  else{
    return false
  }
}

async function registerUser(data){
  return await firebase.auth().createUserWithEmailAndPassword(data['email'], data['password']).then((userCredential)=>{
    return userCredential
  }).catch((error)=>{
      console.log(error)
    })

}

async function loginUser(data){
  return await firebase.auth().signInWithEmailAndPassword(data['email'], data['password']).then((userCredential)=>{
    return userCredential
  }).catch((error)=>{
    console.log(error)
  })
}

async function saveAnalysis(data){
  data = {
    email:data["email"], 
    url: data["url"],
    gameName: data["gameName"],
    white: data["white"],
    black: data["black"]
  }
  const res = await db.collection('games').add(data);
}

async function getGames(data){
  var response = await db.collection("games").where("email", "==", data["email"]).get()
  return response["docs"]
}

async function logout(){
  await firebase.auth().signOut()
}

  async function asyncFunctionWithAwait(request){
    if (request['command'] == "checkAuth"){
      return await checkAuth()
    }
    else if (request['command'] == "register"){
      return await registerUser({email:request['email'], password:request['password']})
    }
    else if (request['command'] == "login"){
      return await loginUser({email:request['email'], password:request['password']})
    }
    else if (request['command'] == "saveAnalysis"){
      return await saveAnalysis({email:request['email'], url:request['url'], gameName:request['title'], white:request['white'], black:request['black']})
    }
    else if (request['command'] == "getGames"){
      return await getGames({email:request['email']})
    }
    else if (request["command"] == "logout"){
      return await logout()
    }

  }

  chrome.runtime.onMessage.addListener((msg, sender,response)=>{
    (async () => {
      var status = await asyncFunctionWithAwait(msg);
      response(status);
  })();
  return true;

  })