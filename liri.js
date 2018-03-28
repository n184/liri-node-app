require("dotenv").config();

var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var commands = process.argv[2];
var value = process.argv[3];

switch (commands) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        songs();
        break;

    case "movie-this":
        movies();
        break;

    case "do-what-it-says":
        doIt();
        break;
}

function tweets() {

    var params = { screen_name: 'bluechipor' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            if (tweets >= 20) {
                for (var i = 0; i < 20; i++) {
                    console.log(tweets[i].user.created_at);
                    console.log(tweets[i].text);
                }
            } else {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].user.created_at);
                    console.log(tweets[i].text);
                }
            }
        } else {
            return console.log(error);
        }
    });
}

function songs() {

    var nodeArgs = process.argv
    if (process.argv[3] == null) {
        var songName = "The+sign";
    } else {
        var songName = "";

        if (process.argv[4] == null) {
            songName = process.argv[3];
        } else {

            // Capture all the words in the movie (again ignoring the first two Node arguments)
            for (var i = 3; i < nodeArgs.length; i++) {

                // Build a string with the address.
                songName = songName + "+" + nodeArgs[i];
            }
        }
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            for (i = 0; i <5; i++) {
            console.log("The album's name is: " + data.tracks.items[i].album.name);
            console.log("The song's singer is: " + data.tracks.items[i].artists[0].name);
            console.log("The song's name is: " + data.tracks.items[i].name);
            console.log("The song's spotify link is: ");
            console.log(data.tracks.items[i].album.external_urls);
             console.log("------------------------------------------");
        }
        }

    });
}

function movies() {
    var nodeArgs = process.argv
    if (process.argv[3] == null) {
        var movieName = "Mr." + "Nobody";
    } else {
        var movieName = "";
        if (process.argv[4] == null) {
            movieName = process.argv[3];
        } else {

            // Capture all the words in the movie (again ignoring the first two Node arguments)
            for (var i = 3; i < nodeArgs.length; i++) {

                // Build a string with the address.
                movieName = movieName + "+" + nodeArgs[i];
            }
        }
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) { 
        if (!error && response.statusCode === 200) {          
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie's year is: " + JSON.parse(body).Year);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's rotten tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie's country produced is: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("The movie's actors are: " + JSON.parse(body).Actors);
        }

    });
}

function doIt() {
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        } else {
            var output = data.split(",");

            // Loop Through the newly created output array
            for (var i = 0; i < output.length; i++) {
                if (output[i] == "my-tweets") {
                    tweets();
                }
                if (output[i] == "spotify-this-song") {
                    i++;
                    value = output[i];
                    songs();
                }
                if (output[i] == "movie-this") {
                    i++;
                    value = output[i];
                    movies();
                }

            }

        }
    });
}

