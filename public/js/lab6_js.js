var baseUrl = "http://localhost:5000/";



function body_on_load(){

  loginButtonInput.onclick = onClickLoginButton;
  signupButtonInput.onclick = onClickSignupButton;
  logoutButtonInput.onclick = onClicklogoutButton;
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

   var firstName = firstNameInputField.value;
   var lastName = lastNameInputField.value;
   var phoneNumber = phoneNumberInputField.value;
   var emailAddress = emailInputField.value;
   var password = passwordInputField.value;

   //alert("Name = " + firstName + lastName +emailAddress);
   firebase.auth().createUserWithEmailAndPassword(emailAddress, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });
 }

 function onClickLoginButton() {
   var emailAddress = emailSignInInputField.value;
   var password = passwordSignInInputField.value;
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
