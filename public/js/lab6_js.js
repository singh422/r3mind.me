var baseUrl = "http://localhost:5000/";

var firstName;
var lastName;
var phoneNumber;
var emailAddress;
var password;
var user = firebase.auth().currentUser;
var database = firebase.database();
var events = [];

function body_on_load(){

  loginButtonInput.onclick = onClickLoginButton;
  signupButtonInput.onclick = onClickSignupButton;
  logoutButtonInput.onclick = onClicklogoutButton;
  submitNewEventButtonInput.onclick = onClickSubmitEventButton;

  if (user) {
    // User is signed in.
    loginForm.style.display = "none";
    reminderPage.style.display = "block";
    //console.log("comes here and is successful")

  } else {
    // No user is signed in.
    loginForm.style.display = "block";
    reminderPage.style.display = "none";

  }

  setMinDate();

 }


 firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
     // User is signed in.
     //alert("Ho ho ho user logged in");
     loginForm.style.display = "none";
     reminderPage.style.display = "block";
     console.log("comes here and is successful")
     getEventsData();
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
   if (checkValidSignupInput(firstName,lastName,phoneNumber,emailAddress,password)){
     //alert("Name = " + firstName + lastName +emailAddress);
     firebase.auth().createUserWithEmailAndPassword(emailAddress, password).then(function(response) {
        console.log(response.uid);
        writeUserDataToDatabase(firstName,lastName,emailAddress,phoneNumber,response.uid);

        }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    // ...
    });
  }else {
    console.log("comes here");
  }

 }


 function checkValidSignupInput(firstName,lastName,phoneNumber,emailAddress,password) {

   if(firstName.trim()===""){
     alert("Please enter valid First Name");
     firstNameInputField.focus();
     return false;
   } else if(lastName.trim()===""){
     alert("Please enter valid Last Name");
     lastNameInputField.focus();
     return false;
   } else if(phoneNumber.trim()===""){
     alert("Please enter valid Phone Number");
     phoneNumberInputField.focus();
     return false;
   } else if(emailAddress.trim()===""){
     alert("Please enter valid Email Address");
     emailInputField.focus();
     return false;
   } else if (password.trim()===""){
     alert("Please enter valid Password");
     passwordInputField.focus();
     return false;
   }
   if (checkValidPhoneNumber(phoneNumber)){
     return true;
   }
   alert("Please enter valid Phone Number");
   phoneNumberInputField.focus();
   return false;
 }

 function checkValidPhoneNumber(phoneNumber) {
   return phoneNumber.match(/\d/g).length===10;
 }

 function onClickLoginButton() {
   emailAddress = emailSignInInputField.value;
   password = passwordSignInInputField.value;

   if (checkValidLoginInput(emailAddress,password)){
     firebase.auth().signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("sad coz it comes here");
      console.log(errorMessage);
      alert(errorMessage);
    // ...
    });

   }
 }

 function checkValidLoginInput(emailAddress,password){

   if(emailAddress.trim()===""){
     alert("Please enter valid Email Address");
     emailSignInInputField.focus();
     return false;
   } else if (password.trim()===""){
     alert("Please enter valid Password");
     passwordSignInInputField.focus();
     return false;
   }
   return true;
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
    var callFeature;
    var messageFeature;
    if(callCheckboxInput1.checked){
      callFeature = callCheckboxInput1.value;
    }else {
      callFeature = callCheckboxInput2.value;
    }
    if ( messageCheckboxInput1.checked){
      messageFeature = messageCheckboxInput1.value;
    } else {
      messageFeature = messageCheckboxInput2.value;
    }
    if (validateEventInputButton(message,date,time)) {
        writeEventDetailsToDatabase(message,date,time,callFeature,messageFeature);
        modal.style.display = "none";
    }
    console.log(date);
    console.log(time);
    console.log(firebase.auth().currentUser.uid);
    //check for validation functions

  }

  function validateEventInputButton(message,date,time) {

    if(message.trim()===""){
      alert("Please enter valid task message");
      messageInput.focus();
      return false;
    } else if(date.trim()==="") {
      alert("Please enter a valid date");
      dateInput.focus();
      return false;
    } else if(time.trim()==="") {
      alert("Please enter a valid time");
      timeInput.focus();
      return false;
    }

    var dtToday = new Date();

     var month = dtToday.getMonth() + 1;
     var day = dtToday.getDate();
     var year = dtToday.getFullYear();

     if(month < 10)
         month = '0' + month.toString();
     if(day < 10)
         day = '0' + day.toString();

     var currentDate = year + '-' + month + '-' + day;

     if(date < currentDate){
       alert("Please enter a valid date which is in the future.");
       dateInput.focus();
       return false;
     } else if ( date === currentDate) {
       var d = new Date();
       var h = (d.getHours()<10?'0':'') + d.getHours();
       var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
       var currTime = h + ":" +m;
       if(time < currTime ) {
         alert("Please enter a valid time which is in the future");
         timeInput.focus();
         return false;
       }
     }

    return true;
  }

  function getEventsData() {
    console.log("comes here 1");
    var userID = firebase.auth().currentUser.uid;
    var query = firebase.database().ref("events/"+userID);
        query.once("value")
          .then(function(snapshot) {
            //console.log(snapshot.val());
            snapshot.forEach(function(childSnapshot) {
              var task = childSnapshot.val().Message;
              var date = childSnapshot.val().Date;
              var time = childSnapshot.val().Time;
              var messageFeature = childSnapshot.val().MessageFeature;
              var callFeature = childSnapshot.val().CallFeature;

              var event  = {
                task: task,
                date: date,
                time: time,
                messageFeature: messageFeature,
                callFeature: callFeature,
                //id: childSnapshot.key
              };

              events.push(event);
          });

          console.log(events.length);
          loadEventsTable();
        }).catch(function(error) {
         console.log('reading failed');
         console.log(error);
        });





  }

  function loadEventsTable() {

    var count = 0;
    // console.log("load");
    // console.log(events);
    // console.log(events.length);
    while (count < events.length) {


      var eventObj = events[count];
      var row = eventsTable.insertRow();




      var cell1 = row.insertCell(0);
      // var cell2 = row.insertCell(1);



      //////
      var rowDiv = document.createElement("div");
      // var taskDiv =  document.createElement("div");
      var dateDiv =  document.createElement("div");
      var timeDiv =  document.createElement("div");
      var callFeature = document.createElement("div");
      var messageFeature = document.createElement("div");
      var timerDiv = document.createElement("div");
      var taskMessageDiv = document.createElement("div");

      cell1.setAttribute("id","tableTaskDiv");
      // taskDiv.setAttribute("id","tableTaskDiv");
      dateDiv.setAttribute("id","tableDateDiv");
      timeDiv.setAttribute("id","tableTimeDiv");
      callFeature.setAttribute("id","tableCallDiv");
      messageFeature.setAttribute("id","tableMessageDiv");
      taskMessageDiv.setAttribute("id","taskMessageDiv");
      rowDiv.setAttribute("id", "rowElementDiv");
      timerDiv.setAttribute("class", "timerDivClass");

      timerDiv.setAttribute("id", "timerDiv"+count);

      createTimer("timerDiv"+count,eventObj.date, eventObj.time);



      //timerDiv.innerHTML = "hey it should be here";
      //cell1.innerHTML = eventObj.task;
      cell1.append(timerDiv);
        //cell1.innerHTML = timerDiv;

      // taskDiv.innerHTML = eventObj.task;


      taskMessageDiv.innerHTML = eventObj.task;
      dateDiv.innerHTML = eventObj.date;
      timeDiv.innerHTML = eventObj.time;
      callFeature.innerHTML = eventObj.callFeature;
      messageFeature.innerHTML = eventObj.messageFeature;


      // rowDiv.appendChild(taskDiv);
      rowDiv.appendChild(taskMessageDiv);
      rowDiv.appendChild(dateDiv);
      rowDiv.appendChild(timeDiv);
      rowDiv.appendChild(callFeature);
      rowDiv.appendChild(messageFeature);
      
      rowDiv.setAttribute("onClick","editEvent(this.id)");
      row.appendChild(rowDiv);

      eventsTable.insertRow(row);
      count++;
    }
  }

  function createTimer(divElement, dateVal, timeVal) {


    //console.log(dateVal);
    //console.log(timeVal);
    var dateParts = dateVal.split("-");
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]);
    var day = parseInt(dateParts[2]);
    var timeParts = timeVal.split(":");
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);

    var eventDate = new Date(year, month, day, hours, minutes, 0, 0);
    //console.log(eventDate.getTime());


    var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();
        var countDownDate = eventDate.getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById(divElement).innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
          document.getElementById(divElement).innerHTML = "Your event has expired";
        }
      }, 1000);





  }

  function editEvent (id) {
    console.log("edit clicked");
  }



  function writeEventDetailsToDatabase(message,date,time,callFeature,messageFeature) {

     var userID = firebase.auth().currentUser.uid;
     var messageListRef = firebase.database().ref('events/'+userID);
     var newMessageRef = messageListRef.push();
     newMessageRef.set({
     'Message': message,
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

 function setMinDate() {
   var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var minDate = year + '-' + month + '-' + day;

    dateInput.setAttribute("min",minDate);
 }
