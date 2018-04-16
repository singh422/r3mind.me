function body_on_load(){

  loginButtonInput.onclick = onClickLoginButton;
  signupButtonInput.onclick = onClickSignupButton;

 }

 function onClickSignupButton(){
   alert("comes here");
   var firstName = firstNameInputField.value;
   var lastName = lastNameInputField.value;
   var phoneNumber = phoneNumberInputField.value;
   var emailAddress = emailInputField.value;
   var password = passwordInputField.value;

   alert("Name = " + firstName + lastName +emailAddress)

 }
 function onClickLoginButton() {
   var emailAddress = emailSignInInputField.value;
   var password = passwordInputField.value;
   alert("comes  here " + emailAddress);

 }
