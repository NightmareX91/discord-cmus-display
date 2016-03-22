try {
    var discord = require("discord.js");
}
catch (e) {
    console.log("You need to run npm install and make sure it passes with no errors!");
    process.exit();
}

try {
    var colours = require("colors");
}
catch (e) {
    console.log("You need to run npm install and make sure it passes with no errors!");
    process.exit();
}

try {
    var authDetails = require("./auth.json");
}
catch (e) {
    console.log("You need to make an auth.json using the example file on the github!");
    process.exit();
}

var bot = new discord.Client();
var exec = require("child_process").exec;
var cmd = "cmus-remote -Q";
var songTitle;
var cmusStatus;

bot.on("ready", function() {
    console.log("Connected!".green);

    setInterval(function() {
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                if (err.message.includes("cmus is not running")) {
                    bot.setPlayingGame("cmus: Not running");
                }
                else {
                    throw err;
                }
            }
            else if (stdout.includes("status stopped")) {
                bot.setPlayingGame("cmud: Stopped");
            }
            else {
                // Song title separation
                var str1;
                var str2;
                var str3;

                str1 = stdout.split("tag title ")[1];
                str2 = str1.split("tag date ")[0];
                str3 = str2.replace(/(\r\n|\n|\r)/gm, "");

                songTitle = str3;

                // Status separation
                var str4;
                var str5;
                var str6;

                str4 = stdout.split("status ")[1];
                str5 = str4.split("file ")[0];
                str6 = str5.replace(/(\r\n|\n|\r)/gm, "");

                cmusStatus = str6;
            }
        });

        if (cmusStatus === "stopped") {
            //console.log("cmus status: stopped".yellow);
            bot.setPlayingGame("cmus: Stopped");
        }
        else if (cmusStatus === "paused") {
            //console.log("cmus status: paused".yellow);
            bot.setPlayingGame("cmus: Song Paused");
        }
        else if (cmusStatus === "playing") {
            //console.log("cmus status: playing".yellow);
            bot.setPlayingGame("cmus: " + songTitle);
        }
    }, 500);
});

bot.on("disconnected", function() {
    console.log("Disconnected!".red);
    process.exit();
});

bot.login(authDetails.username, authDetails.password);
