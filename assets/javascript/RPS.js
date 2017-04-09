// Initialize Firebase
var config = {
    apiKey: "AIzaSyDwPvvRbUGSXL5-F76vdGVFdNAmMJ9aUTc",
    authDomain: "multiplayer-r-p-s.firebaseapp.com",
    databaseURL: "https://multiplayer-r-p-s.firebaseio.com",
    projectId: "multiplayer-r-p-s",
    storageBucket: "multiplayer-r-p-s.appspot.com",
    messagingSenderId: "30473759075"
};
firebase.initializeApp(config);

var database = firebase.database();
var players = 0;
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var usersName;







// connectionsRef.on("value", function(snap) {
//     if (snap.val()) {
//         console.log(players)
//         var con = database.ref('/connections/' + players);
//         // con.push({ player: players, wins: 0, loses: 0 });
//         con.onDisconnect().remove();
//     }
// });

connectionsRef.on("value", function(snap) {
    console.log(snap.numChildren());
    players = snap.numChildren();
    if (snap.val()) {
        console.log(players)
        var con = database.ref('/connections/' + players);
        // con.push({ player: players, wins: 0, loses: 0 });
        con.onDisconnect().remove();
    }
    if (players >= 5) {
        $('#usersNameSubmitBtn').attr('disabled', disabled);
    }
})


$('#usersNameSubmitBtn').on('click', function() {
    usersName = $('#usersName').val().trim();
    playerInfo = {};
    playerInfo[players] = { wins: 0, loses: 0, choice: " " };
    connectionsRef.update(playerInfo);
});
