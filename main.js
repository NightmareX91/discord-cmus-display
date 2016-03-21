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

bot.on("ready", function() {
    console.log("Connected!".green);

    setInterval(function() {
        exec(cmd, function(err, stdout, stderr) {
            if (err) {
                throw err;
            }

            var str1;
            var str2;
            var str3;

            str1 = stdout.split("tag title ")[1];
            str2 = str1.split("tag date ")[0];
            str3 = str2.replace(/(\r\n|\n|\r)/gm, "");

            songTitle = str3;
        });

        bot.setPlayingGame(songTitle);
    }, 500);
});

bot.on("disconnected", function() {
    console.log("Disconnected!".red);
    process.exit();
});

bot.login(authDetails.username, authDetails.password);
