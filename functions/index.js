
var firebase = require('firebase-admin');

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD_Wldco4Zxm7iY9ciLApCTHSZ8zmVVvnk",
  authDomain: "r3mind-me.firebaseapp.com",
  databaseURL: "https://r3mind-me.firebaseio.com",
  projectId: "r3mind-me",
  storageBucket: "r3mind-me.appspot.com",
  messagingSenderId: "667296460770"
});


var events=[];

var TWILIO_ACCOUNT_sid='AC40f97bf7971288974830ce8bf0850e12';
var TWILIO_PHONE_NUMBER='+18178736463';
var TWILIO_AUTH_TOKEN='591995cd8367c406d6084f4120288fe5';

// const functions = require('firebase-functions');
var twilio = require('twilio');
const twilioCall = require('twilio').twiml.VoiceResponse;
const callResponse = new twilioCall();
var client = new twilio(TWILIO_ACCOUNT_sid, TWILIO_AUTH_TOKEN);
cronJob = require('cron').CronJob;



var textJob = new cronJob( '* * * * *', function(){
  console.log('starts now ehhhhhh');
  var x  = getDataFromFirebase( function() {

    for(var i =0; i<events.length;i++){
      var eventObj = events[i];
      var phoneNumber = "+1"+eventObj.phoneNumber;
      var taskMessage = eventObj.message;
      var eventTime = eventObj.time;

      var userMessage = "Dear user, this is a reminder for your task: "+ taskMessage+".\nHope you have an amazing day!\n-r3mind.me";
      console.log(userMessage+" to " + phoneNumber);
      client.messages.create( { to:phoneNumber, from:TWILIO_PHONE_NUMBER, body:userMessage },
      function( err, data ) {
          if(err){
            console.log(err);
          }
          else{
            console.log("message sending success");
          }

      });
    }

    events=[];

  });





},  null, true);

function getDataFromFirebase(_callbackFunc) {


  var query = firebaseApp.database().ref('events');
      query.once("value")
        .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childSnapshot.forEach(function(eventSnapshot){
            // console.log("this is a child's child");
            // console.log(eventSnapshot.val().Message);
            // console.log(eventSnapshot.val().PhoneNumber);
            var eventDate=eventSnapshot.val().Date;
            var eventTime=eventSnapshot.val().Time;
            var timeDifference = checkUpcoming(eventDate,eventTime);
            if(timeDifference != -1){
              var phoneNumber = eventSnapshot.val().PhoneNumber;
              var message = eventSnapshot.val().Message;
              var event  = {
                message: message,
                date: eventDate,
                time: eventTime,
                phoneNumber:phoneNumber,
                difference : timeDifference
              };
              events.push(event);
            }
          });
        });
        console.log("upcoming events");
        console.log(events);

        _callbackFunc();
      }).catch(function(error) {
       console.log('reading failed');
       console.log(error);
     });

}

function checkUpcoming(eventDate,eventTime) {

  var dtToday = new Date().getTime();
  var dateParts = eventDate.split("-");
  var year = parseInt(dateParts[0]);
  var month = parseInt(dateParts[1] - 1);
  var day = parseInt(dateParts[2]);
  var timeParts = eventTime.split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);

  var eventDate = new Date(year, month, day, hours, minutes, 0, 0).getTime();
  var difference = eventDate - dtToday;
  if (difference >=0 && difference <= 60000) {
    return difference;
  }
  else{
    return -1;
  }
}





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
