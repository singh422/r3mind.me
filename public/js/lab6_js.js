var baseUrl = "http://localhost:5000/";

var firstName;
var lastName;
var phoneNumber;
var emailAddress;
var password;
var user = firebase.auth().currentUser;
var database = firebase.database();

function body_on_load(){

  loginButtonInput.onclick = onClickLoginButton;
  signupButtonInput.onclick = onClickSignupButton;
  logoutButtonInput.onclick = onClicklogoutButton;
  submitNewEventButtonInput.onclick = onClickSubmitEventButton;

  if (user) {
    // User is signed in.
    loginForm.style.display = "none";
    reminderPage.style.display = "block";
    console.log("comes here and is successful")
  } else {
    // No user is signed in.
    loginForm.style.display = "block";
    reminderPage.style.display = "none";

  }


 }


 firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
     // User is signed in.
     //alert("Ho ho ho user logged in");
     loginForm.style.display = "none";
     reminderPage.style.display = "block";
     console.log("comes here and is successful")
   } else {
     // No user is signed in.

     loginForm.style.display = "block";
     reminderPage.style.display = "none";

   }
 });

 function onClickSignupButton(){

   firstName = firstNameInputField.value;
   lastName = lastNameInputField.value;
   phoneNumber = phoneNumberInputField.value;
   emailAddress = emailInputField.value;
   password = passwordInputField.value;

   //alert("Name = " + firstName + lastName +emailAddress);
   firebase.auth().createUserWithEmailAndPassword(emailAddress, password).then(function(response) {
      console.log(response.uid);
      writeUserDataToDatabase(firstName,lastName,emailAddress,phoneNumber,response.uid);

      }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });
 }

 function onClickLoginButton() {
   emailAddress = emailSignInInputField.value;
   password = passwordSignInInputField.value;
  // alert("comes  here " + emailAddress);

   firebase.auth().signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("sad coz it comes here");
    console.log(errorMessage);
  // ...
  });

 }

 function onClicklogoutButton (){

   firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("log out successful");

    }).catch(function(error) {

    // An error happened.
    });
 }

  function onClickSubmitEventButton() {
    var message = messageInput.value;
    var date = dateInput.value;
    var time = timeInput.value;
    var callFeature = callCheckboxInput.value;
    var messageFeature = messageCheckboxInput.value;

    console.log(date);
    console.log(time);
    console.log(firebase.auth().currentUser.uid);
    //check for validation functions
    writeEventDetailsToDatabase(message,date,time,callFeature,messageFeature);

  }



  function writeEventDetailsToDatabase(message,date,time,callFeature,messageFeature) {

     var userID = firebase.auth().currentUser.uid;
     var messageListRef = firebase.database().ref('events/'+userID);
     var newMessageRef = messageListRef.push();
     newMessageRef.set({
     'Event': message,
     'Date': date,
     'Time': time,
     'CallFeature': callFeature,
     'MessageFeature': messageFeature
    }).then(function() {
     console.log('Synchronization succeeded');
    })
    .catch(function(error) {
     console.log('Synchronization failed');
     console.lof(error);
    });
    console.log("successful write");
 

     // var myRef = firebase.database().ref().push();
     // var key = myRef.key();

    //console.log(key);
    // var userID = firebase.auth().currentUser.uid;
    // firebase.database().ref('events/'+userID ).set({
    //  message: message,
    //  date: date,
    //  time: time,
    //  callFeature: callFeature,
    //  messageFeature: messageFeature
    //  }).then(function() {
    //    console.log('Synchronization succeeded');
    //  })
    //  .catch(function(error) {
    //    console.log('Synchronization failed');
    //    console.lof(error);
    //  });
    //  console.log("successful write");



  }


 function writeUserDataToDatabase(firstName,lastName,emailAddress,phoneNumber,userID) {
   firebase.database().ref('users/'+userID).set({
    firstName: firstName,
    lastName: lastName,
    email: emailAddress,
    phoneNumber: phoneNumber
    }).then(function() {
      console.log('Synchronization succeeded');
    })
    .catch(function(error) {
      console.log('Synchronization failed');
      console.lof(error);
    });
    console.log("successful write");
 }
