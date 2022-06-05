import React, { Component } from 'react';

import './App.css';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, deleteUser, AuthCredential, } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {firebase} from './firebase.js';
import { getFirestore, query, where, collection, docs, addDoc, getDocs, onSnapshot } from "firebase/firestore";

import Chatmessage from './components/Chatmessage';
import profile_icon from './components/profile_icon.png';

const analytics = getAnalytics(firebase);
const provider = new GoogleAuthProvider();
const auth = getAuth(firebase);
const auth2 = getAuth();
const database= getFirestore(firebase);

var getInput = "";
var keyCount = 1;
var isSubscribed;
var Instr;
var isDisabled = true;
var isDisabled2 = false;
var phone2;
var defaultDisplayName;
var names;
var finalResult;
// Testing number is +1 6505551234. Testing verification otp is 123456.

onAuthStateChanged(auth, (user) => {
  if (user) {
  // The user object has basic properties such as display name, email, etc.
  const displayName = user.displayName;
  const photoURL = user.photoURL;
  console.log(displayName, photoURL);
    // ...
  } else {
    // User is signed out
    console.log("User is signed out")
    // ...
  }
} 
);



class App extends Component {

  constructor(props) {
    super(props);
    this.whatToRender = this.whatToRender.bind(this);
    this.signInWithFirebase = this.signInWithFirebase.bind(this);
    this.signOutWithFirebase = this.signOutWithFirebase.bind(this);
    this.initiatePhone = this.initiatePhone.bind(this);
    this.checkOTPValue = this.checkOTPValue.bind(this);
    this.goHome = this.goHome.bind(this);
    this.lastDivRef = React.createRef();
  }

  state = {
    loginState: false,
    initiatePhoneNumberRequest: false,
    messagesRef: [],
    send: "Send",
    isDisabled: true,
    instruction: "Enter your name and phone number and click 'Send'. \r\nPhone number must be prefixed by your country code. Example, +234808XXXXYYY. Do not type in the OTP field yet. (If your browser prevents you from enterering the + sign, you can omit the + sign.)",
    messages: [
    ]
  }
  
  componentDidMount(){
    keyCount++;
    isSubscribed = true;

    // try{
    //   console.log('A!!')
    //   const q = query(collection(database, "cities"));
    //   console.log(q);
    //   console.log('B!!')
    //  const read = onSnapshot(q, (querySnapshot) => {
    //   console.log('C!!')
    //   console.log(querySnapshot);
    //    const cities = [];
    //    console.log('D!!')
    //    querySnapshot.forEach((doc) => {
    //     console.log('E!!')
    //      cities.push(doc.data.timestamp);
    //      console.log('Data: ', cities.join(", "));
    //    });
    //  });
  }

  componentWillUnmount(){
    isSubscribed = false;
  }

  setUpSnapshot(){
    onSnapshot(collection(database, 'messages'), (snapshot) => {
      let ada = snapshot.docs.map(doc => doc.data());
      let newM = [];
      ada.forEach((item) => {
        if(item.sender == auth.currentUser.uid && item.hasOwnProperty('isSender') == false){
          let newM2 = {isSender: true}
          finalResult = Object.assign(item, newM2);

        }
        if(item.sender != auth.currentUser.uid && item.hasOwnProperty('isSender') == false){
          let newM2 = {isSender: false}
          finalResult = Object.assign(item, newM2);

        }
        newM.push(finalResult);
        keyCount++;
      });
        newM.sort((a,b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));

      this.setState(
        {
          messages: newM
        }
      );
      console.log("state", this.state);
    });
  }
 

  getInputField(e){
    getInput = e.target.value;
    keyCount++;
  }

  async writeToDatabase(){
    if (isSubscribed === true){
    try{
      let d= new Date();
      var hours;
      var minutes;

      if(d.getHours() < 13 && d.getHours() > 0){
        hours = "0" + d.getHours();
        }else{hours = d.getHours()}

      if(d.getMinutes() < 10){
        minutes = "0" + d.getMinutes();
        }else{minutes = d.getMinutes()}

      let time = hours + ":" + minutes;
      let image;
      
      
      if(auth.currentUser.photoURL != null && auth.currentUser.photoURL != undefined){
        image = auth.currentUser.photoURL;}else{image = profile_icon}
      let sendId = auth.currentUser.uid;
      let senderP = "a";
      if(auth.currentUser.displayName != null && auth.currentUser.displayName != undefined){
      senderP = auth.currentUser.displayName;}else{senderP = defaultDisplayName}


      const docRef = await addDoc(collection(database, "messages"), {
        sender: sendId,
        senderPerson: senderP,
        body: getInput,
        imageUrl: image,
        timestamp: time

      });
      console.log("Document written with ID: ", docRef.id);
      getInput = "";

    } catch(error){
      console.log('Error adding document: ', error);
    }

  }}

   signOutWithFirebase(){
    const user = auth.currentUser;
    deleteUser(user)
   .then(() => {
     this.setState({
       loginState: false
     });
    console.log("Sign out successful.")}
  )
  .catch((error) => {
    this.signInWithFirebase();
    this.signOutWithFirebase();
  })
    }
  
   signInWithFirebase(){
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(credential, token, user);
    this.setState(
      {
        loginState: true
      });

      this.setUpSnapshot();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential);
  });
  }

  initiatePhone(){
    this.setState({
      initiatePhoneNumberRequest: true
    }, function initiatePhone2(){
      console.log("auth", auth == auth2);
        console.log("auth2", auth === auth2);
    
        console.log(window.recaptchaVerifier);
    
        window.recaptchaVerifier = new RecaptchaVerifier("phoneSubmitButton", {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log(response)
        
          }
        }, auth);
        console.log("Done");
    });
  
  }


  handleSubmit = (e) => {
    console.log("otp", e.target.otp.value);
    e.preventDefault();
  //   if(e.target.name.value!=""){
      
  //   } else{Instr = "The name field cannot be empty!"
  //   this.setState({
  //     instruction: Instr
  //   });
  // }
    names= e.target.name.value;
    var phone= "+" + e.target.phone.value;

    phone2 = phone;

    this.setState({
      instruction: "Just a moment. Verifying and sending OTP..."

  });

    console.log(e.target.name.value, e.target.phone.value, e.target.otp.value);

    const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, phone, appVerifier)
    .then((confirmationResult) => {
      this.setState({
        isDisabled : false,
        instruction: "An OTP code has been sent to " + phone + ". Please enter the code below. To request an OTP resend, clear out the OTP field and click send again."
  
    });

    console.log("SMS sent");
      // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).

      window.confirmationResult = confirmationResult;
    }).catch((error) => {
      // Error; SMS not sent
      // ...
      this.setState({
        instruction: "SMS failed to send. Confirm that " + phone + " is your phone number and that it is prefixed with your country code (example +234808xxxxyyy). Then, try again."
    });

      console.log("Sms failed", error);
    });

  }



  checkOTPValue(e){

    let otp = e.target.value;
    defaultDisplayName = names;
    if (otp.length > 6) {
      e.target.value = otp.slice(0, 6);
    }

    if (otp.length === 6){
      let confirmationResultReference = window.confirmationResult;

      confirmationResultReference.confirm(otp)
      .then( (result) => {
      // User signed in successfully.
      this.setState({
        instruction: "Signed in successfully.",
        initiatePhoneNumberRequest: false,
        loginState: true
  });
      console.log("Signed in successfully")
       const user = result.user;   
      console.log("user", user);
      this.setUpSnapshot();
    }).catch((error) => {

        this.setState({
            instruction: "OTP is incorrect. Try again or request a new OTP. To request an OTP resend, clear out the OTP field and click send again. (If all fails, refresh the browser and try again.)"
      });
        console.log("Bad verification code");
     
    })
    } else{console.log(e.target.value.length, "OTP length");}
  }



  checkForSenderAndReturnStyle() {
    if(this.state.isSender === false){
      return ["TopContainer", "messageContainer", "displayName", "pictureandmessage",
    "pic", "nextpic", "timestamp", "picture", "message"]
    }
    else{
      return ["TopContainer2", "messageContainer2", "displayName2", "pictureandmessage2",
    "pic2", "nextpic2", "timestamp2", "picture2", "message2"]
    }
  }

  checkValue(e){
    if(getInput === ""){
        console.log("Get input is empty");
    }
  }

  handleRef = r => {
    if (this.lastDivRef.current !== null){
    this.lastDivRef.current.scrollIntoView();}
  }

  goHome(){
    this.setState({initiatePhoneNumberRequest: false});
  }

  whatToRender() {
    var returnedStyleArray = this.checkForSenderAndReturnStyle();
    console.log("Login state is " + this.state.loginState);

    if(this.state.loginState===false) {

      if(this.state.initiatePhoneNumberRequest === true){
        return(
          <div className='phoneAuthContainer'>
            <form onSubmit={this.handleSubmit} className="phoneform"> 
            <h1 className='phoneH1'>Phone Sign in</h1>
              <p className="nameP">Name:</p>
              <input type="text" name="name" placeholder='Enter your name' className="firstname" disabled={isDisabled2} required/><br/>
              <p className="phoneP">Phone number:</p>
              <input type="number" name="phone" placeholder='Enter your phone number' className="phoneno" disabled={isDisabled2} required/><br/>
              <p className="instruct" name="instruction">{this.state.instruction}</p><br/>
              <input type="number" name="otp" placeholder ='Enter your OTP' maxLength="6" onChange={this.checkOTPValue} className="otp" disabled={this.state.isDisabled}></input><br/>
              <div className='phoneAuthButtonContainer'>
              <button type="button" id='phoneSubmitButton2' className="goToHome" onClick={this.goHome}>Sign in with Google instead</button>
              <button type="submit" id='phoneSubmitButton' className="sendNow">{this.state.send}</button>
              </div>
            </form>
          </div>
        );
      }
      return(
      <div className = 'groupchatLogin'>
        <h1 className = 'groupchatLoginH1'>GroupChat</h1>
        <img className = 'groupchatLoginPic' src={require("./components/GroupIcon.png")} alt="group chat logo"></img><br/>
     <p className='groupchatStart'>Get started...</p>
     <button className = 'groupchatLoginPhone' onClick={this.initiatePhone}>Sign in with Phone</button><br/>
    <button className = 'groupchatLoginGoogle' onClick= {this.signInWithFirebase}>Sign in with Google</button>
      </div>);
    } else{
      return (
        <div className="App">
          <div className='header'>
        <h2 className='groupchat'>GroupChat</h2>
          <button className="signOut" onClick={this.signOutWithFirebase}> SIGN OUT </button></div>
          <div className='middle'>
    {this.state.messages.map((item) => <Chatmessage key= {Math.random(100000) + item.body + item.timestamp + keyCount} body ={item.body}
    timestamp={item.timestamp} imageUrl={item.imageUrl} sender={item.senderPerson} styling={item.isSender} />)}
    <div ref={this.lastDivRef} className="lastDiv"></div>
    </div>

    <div className="sendDiv">
            <div className='sendDivLower'>
              <form onSubmit={e => {e.preventDefault();}} >
            <input type="text" placeholder="Say something..." className="sendInput" onChange={this.getInputField} onBlur={this.checkValue} ></input>
            <button type='reset' className='sendbutton' onClick={this.writeToDatabase} >
Send
                 </button> </form> </div>
        </div>
  </div>);
    }
  }

  render() {
    this.handleRef();

  return (
    this.whatToRender()
  );}

}

export default App;
