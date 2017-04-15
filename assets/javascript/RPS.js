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
var connectedRef = database.ref(".info/connected");
var turnRef = database.ref('/turn');
var chatBoxRef = database.ref('/chat');
var usersName;
var playerRef, opponentRef;
var RPSMoves = ["Rock", "Paper", "Scissors"];
var turn = 0;
var wins = 0;
var loses = 0;
var alreadyPlaying = false;
var gameStarted = false;
var opponentName, opponentsChoice
var player, totalPlayers;
var playersList = [""]


// displays text between players in chatbox div
chatBoxRef.on('child_changed', function(snapshot) {
    console.log(snapshot.val());
    var paragraph = $('<p>');
    paragraph.html(snapshot.val())
    $('#chatBox').append(paragraph);
});

// displays text when opponent disconnects
connectionsRef.on("child_removed", function(snap) {
    disconnectText = opponentsName + ': Disconnected.'
    chatBoxRef.set({
        chat: disconnectText
    })
    console.log('Somebody left');
});

// key to making the perfect game
// console.log(Object.keys(snap.val()));

// keeps trackof how many player are playing
connectionsRef.on("value", function(snap) {
    console.log(snap.val());
    totalPlayers = snap.numChildren();
    playersList = Object.keys(snap.val());
    gameplayText();
    if (snap.val()) {
        // user is removed when they disconnect
        playerRef.onDisconnect().remove();
    }
});

// keeps track of turns
turnRef.on('value', function(snapshot) {
    console.log(snapshot.val().turn);
    turn = snapshot.val().turn;
    if (turn === 1) {
        setTimeout(RPSGameplay1, 2000)
    } else if (turn === 2) {
        RPSGameplay2();
    } else if (turn === 3) {
        // setTimeout so that firebase can update player 1's choice
        setTimeout(isGameFinished, 4000);
    }
});





// Establish witch ref is for each player
$('#usersNameSubmitBtn').on('click', function() {
    usersName = $('#usersName').val().trim();
    if (playersList[0] === '1') {
        player = 0;
        playerRef = database.ref('/connections/0');
        opponentRef = database.ref('/connections/1')
        turnRef.set({
            turn: 1
        });
    } else {
        player = totalPlayers;
        if (player === 0) {
            playerRef = database.ref('/connections/0');
            opponentRef = database.ref('/connections/1')
        } else if (player === 1) {
            playerRef = database.ref('/connections/1');
            opponentRef = database.ref('/connections/0');
            // This update triggers .on('value') for turn to run RPSGameplay1();
            turnRef.set({
                turn: 1
            });
        }
    }
    alreadyPlaying = true;
    playerInfo = {};
    playerInfo;
    connectionsRef.child(player).update({ name: usersName, wins: 0, loses: 0, choice: " " });
    $('#usersNameSubmitBtn').attr('disabled', true);

});



// text displayed when game is beging
function gameplayText() {
    if (totalPlayers >= 2) {
        $('#registrationDiv').empty();
        var gameText = $('<h3>');
        gameText.html("Let the games begin");
        $('#registrationDiv').append(gameText);

    } else if (totalPlayers >= 1 && alreadyPlaying === true) {
        $('#registrationDiv').empty();
        var gameText = $('<h3>');
        gameText.html("Waiting for opponent");
        $('#registrationDiv').append(gameText);
    }
};

// Logic for player1's turn
function RPSGameplay1() {
    opponentRef.on('value', function(snap) {
        opponentsName = snap.val().name
    });
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
        $('.player1View').empty();
        var paragraph = $('<p>');
        paragraph.html(opponentsName + " is choosing an attack!")
        $('.player1View').append(paragraph);

        $('.player2View').empty();
        var paragraph = $('<p>');
        paragraph.html("Waiting for Opponent to make a move");
        $('.player1View').append(paragraph);
        $('.player2View').append(paragraph);
    }
}


// Logic for player2's turn
function RPSGameplay2() {
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
        paragraph2.html(opponentsName + " has made a move");
        $('.player1View').append(paragraph2);
    } else if (player === 0) {
        $('.player1View').empty();
        var paragraph2 = $('<p>');
        paragraph2.html(usersName + ", you chose " + choice);
        $('.player1View').append(paragraph2);

        $('.player2View').empty();
        var paragraph2 = $('<p>');
        paragraph2.html("Waiting for Opponent to make a move");
        $('.player2View').append(paragraph2);
    }
}


// When turn is 3(Each player has made a move), isGameFinished Determines who won
// each option pushes results to firebase
function isGameFinished() {
    opponentRef.on('value', function(snap) {
        opponentsChoice = snap.val().choice
    });
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
    setTimeout(RPSGameplay1, 2000);
}


// Try to make .player1View and .player2View into one function. 
$('.player1View').on('click', 'p.RPSText', function() {
    choice = $(this).attr('data');
    console.log(choice);
    playerRef.update({
        choice: choice
    });
    turnRef.update({
        turn: 2
    })

});


$('.player2View ').on('click', "p.RPSText", function() {
    choice = $(this).attr('data');
    turnRef.update({
        turn: 3
    });
    playerRef.update({
        choice: choice
    });

    console.log($(this).attr('data'));
});


// chatbox logic
$('#chatboxSubmit').on('click', function() {
    if (typeof usersName === 'undefined') {
        $('#registrationDiv h1').html("Please Sign in Below");
    } else {
        var paragraph = $('<p>');
        var text = usersName + ": " + $('#chatboxText').val().trim();
        chatBoxRef.set({
            chat: text
        })
    }
});
