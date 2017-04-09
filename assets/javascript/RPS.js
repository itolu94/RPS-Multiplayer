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
var connectionsRef = database.ref("/connections");
var opponentRef;
var playerRef = database.ref('/connections/');
var connectedRef = database.ref(".info/connected");
var RPSMoves = ["Rock", "Paper", "Scissors"];
var opponentsChoice;
var players;
var player;
var usersName;
var opponent = 1;
var opponentName;
var alreadyPlaying = false;
var gameStarted = false
var turnRef = database.ref('/turn');
var turn = 0;
var wins = 0;
var loses = 0;




connectionsRef.on("value", function(snap) {
    players = snap.numChildren();
    gameplayText();
    if (snap.val()) {
        playerRef.onDisconnect().remove();
    }
    if (players > 1) {
        $('#usersNameSubmitBtn').attr('disabled', true);
        RPSGameplay1();

    }
    // if a player leaves a user is not alreayd playing, they will get to join the game.   
    else if (alreadyPlaying === false && players < 2) {
        $('#usersNameSubmitBtn').attr('disabled', false);
    }


});

turnRef.on('value', function(snapshot) {
    console.log(snapshot.val().turn);
    turn = snapshot.val().turn;
    if (turn === 1) {
        RPSGameplay1();
    } else if (turn === 2) {
        RPSGameplay2();
    } else if (turn === 3) {
        setTimeout(isGameFinished, 4000);
    }
});



// opponentRef.on('value', function(snapshot) {
//     console.log(snapshot.val());
// })



$('#usersNameSubmitBtn').on('click', function() {
    usersName = $('#usersName').val().trim();
    player = players;
    if (player === 0) {
        playerRef = database.ref('/connections/0');
        opponentRef = database.ref('/connections/1')
    } else if (player === 1) {
        playerRef = database.ref('/connections/1');
        opponentRef = database.ref('/connections/0');
        turnRef.update({
            turn: 1
        });
    }
    alreadyPlaying = true;
    playerInfo = {};
    playerInfo[players] = { name: usersName, wins: 0, loses: 0, choice: " " };
    connectionsRef.update(playerInfo);
    $('#usersNameSubmitBtn').attr('disabled', true);

});



// text displayed when game is beging(users and are about to start playing)
function gameplayText() {
    if (players >= 2) {
        $('#registrationDiv').empty();
        var gameText = $('<h3>');
        gameText.html("Let the games begin");
        $('#registrationDiv').append(gameText);

    } else if (players >= 1 && alreadyPlaying === true) {
        $('#registrationDiv').empty();
        var gameText = $('<h3>');
        gameText.html("Waiting for opponent");
        $('#registrationDiv').append(gameText);
    }
};



function RPSGameplay1() {
    if (player === 0) {
        $('.player1View').empty();
        for (var i = 0; i < RPSMoves.length; i++) {
            var paragraph = $('<p>');
            paragraph.html(RPSMoves[i]);
            paragraph.attr('data', RPSMoves[i]);
            paragraph.attr('class', 'RPSText');
            $('.player1View').append(paragraph);
        }
        $('.player2View').empty();
        var paragraph2 = $('<p>');
        paragraph2.html("Opponent waiting for you to make a move");
        $('.player2View').append(paragraph2);
    } else if (player === 1) {
        $('.player2View').empty();
        $('.player1View').empty();
        var paragraph = $('<p>');
        paragraph.html("Waiting for Opponent to make a move");
        $('.player1View').append(paragraph);
        $('.player2View').append(paragraph);
    }
}


function RPSGameplay2() {
    opponentRef.on('value', function(snap) {
        opponentName = snap.val().name
        opponentsChoice = snap.val().choice
    });
    if (player === 1) {
        $('.player2View').empty();
        for (var i = 0; i < RPSMoves.length; i++) {
            var paragraph = $('<p>');
            paragraph.html(RPSMoves[i]);
            paragraph.attr('data', RPSMoves[i]);
            paragraph.attr('class', 'RPSText');
            $('.player2View').append(paragraph);
        }
        $('.player1View').empty();
        var paragraph2 = $('<p>');
        paragraph2.html("Player has made a move");
        $('.player1View').append(paragraph2);
    } else if (player === 0) {
        $('.player2View').empty();
        var paragraph2 = $('<p>');
        paragraph2.html("Waiting for Opponent to make a move");
        $('.player2View').append(paragraph2);
    }
}



function isGameFinished() {
    console.log("Final Step");
    if (choice === "Rock") {
        if (opponentsChoice === "Rock") {
            console.log("ties");
        } else if (opponentsChoice === "Paper") {
            loses++
            playerRef.update({
                loses: loses
            });
            console.log("loses");
        } else if (opponentsChoice === "Scissors") {
            wins++
            playerRef.update({
                wins: wins
            });
            console.log("wins");
        }
    }
    if (choice === "Paper") {
        if (opponentsChoice === "Paper") {
            console.log("ties");
        } else if (opponentsChoice === "Scissors") {
            loses++
            playerRef.update({
                loses: loses
            });
            console.log("loses");
        } else if (opponentsChoice === "Rock") {
            wins++
            playerRef.update({
                wins: wins
            });
            console.log("wins");
        }
    }

    if (choice === "Scissors") {
        if (opponentsChoice === "Scissors") {
            console.log("ties");
        } else if (opponentsChoice === "Rock") {
            loses++
            playerRef.update({
                loses: loses
            });
            console.log("loses");
        } else if (opponentsChoice === "Paper") {
            wins++
            playerRef.update({
                wins: wins
            });
            console.log("wins");
        }
    }
}



$('.player1View').on('click', 'p.RPSText', function() {
    choice = $(this).attr('data');
    playerRef.update({
        choice: choice
    });
    turnRef.update({
        turn: 2
    })

});


$('.player2View').on('click', 'p.RPSText', function() {
    choice = $(this).attr('data');
    turnRef.update({
        turn: 3
    });
    playerRef.update({
        choice: choice
    });

    console.log($(this).attr('data'));
});
