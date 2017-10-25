//====================================================================
// Firebase Initialization
//====================================================================
var config = {
    apiKey: "AIzaSyDEsdfSFVD4fSiNAFEGDLdx__FdTLePrNU",
    authDomain: "trainschedule-538f6.firebaseapp.com",
    databaseURL: "https://trainschedule-538f6.firebaseio.com",
    projectId: "trainschedule-538f6",
    storageBucket: "",
    messagingSenderId: "425103394515"
};
firebase.initializeApp(config);
var database = firebase.database();


//====================================================================
//  displayTrainInfo()
//====================================================================
function displayTrainInfo(trainName, destination, firstTime, frequency)
{
  var row = $('<tr></tr>')
  row.append($('<td></td>').text(trainName))
  row.append($('<td></td>').text(destination))
  row.append($('<td></td>').text(frequency))

  var next$ = $('<td></td>')
  var away$ = $('<td></td>')

  row.append(next$)
  row.append(away$)

  $("#train-table > tbody").append(row);

  setInterval(updateTimes, 1000)
  updateTimes()

  function updateTimes () {
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var remainder = diffTime % frequency;

    // Minute Until Train
    var minutesAway = frequency - remainder;

      // Next Train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

    next$.text(nextArrival)
    away$.text(minutesAway)
  }
}


//====================================================================
//  addNewTrain()
//====================================================================
function addNewTrain(){

  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTime = $("#first-time").val().trim();
  var frequency = $("#frequency").val().trim();

  database.ref('/trains').push({
        name: trainName,
        dest: destination,
        time: firstTime,
        freq: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-time").val("");
  $("#frequency").val("");
}


//====================================================================
//  database.ref()
//====================================================================
database.ref('/trains').on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTime = childSnapshot.val().time;
  var frequency = childSnapshot.val().freq;

  displayTrainInfo(trainName, destination, firstTime, frequency);
});
