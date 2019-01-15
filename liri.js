require("dotenv").config();
var fs = require("fs");
var moment = require("moment");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var axios = require("axios");
var spotify = new Spotify(keys.spotify);


//variable to hold user's command
var command = process.argv[2];
//loop to collect other info entered by user
var userQuery = "";

for(i=3; i < process.argv.length; i++){
    if(i == 3){
        userQuery = process.argv[i];
    }
    else{
            userQuery += "+" + process.argv[i];
    }
    
}


//function containing app logic used because requires recursion for do-what-it-says command
function runApp(){
    fs.appendFile("log.txt", command + "| ", function(err){
        if(err){
            return console.log(err)
        }
    })
    
    //for command do-what-it-says
    if(command === "do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
            return console.log(error);
            }
            var dataArr = data.split(",");
            userQuery = dataArr[1];
            command = dataArr[0];
            runApp();
        });
    }
    //for user command concert-this
    if(command === "concert-this"){
        axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp").then(
            function(response){
            
                for(i=0; i < response.data.length; i++){
                    date = moment(response.data[i].datetime).format("L")
                    var concertData = "\nVenue: " + response.data[i].venue.name + " \nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country + " \nDate: " + date;
                    console.log(concertData)
                    fs.appendFile("log.txt", userQuery +"| ", function(err){
                        if(err){
                            return console.log(err)
                        }
                        fs.appendFile("log.txt", concertData +"| ", function(err){
                            if(err){
                                return console.log(err)
                            }
                        })
                    })
                    
                }
            }
        )
    }
    //for command spotify-this-song
    if(command === "spotify-this-song"){
        if(userQuery == ""){
            userQuery = "the sign ace of base"
        }
        spotify.search({ type: 'track', query: userQuery }).then(
            function(response){
                var songData = "\nArtist: " + response.tracks.items[0].artists[0].name + " \nSong: " + response.tracks.items[0].name + " \nPreview Link: " + response.tracks.items[0].preview_url + " \nAlbum name: " + response.tracks.items[0].album.name;
                console.log(songData);
                fs.appendFile("log.txt", userQuery + "| ", function(err){
                    if(err){
                        return console.log(err)
                    }
                    fs.appendFile("log.txt", songData +"| ", function(err){
                        if(err){
                            return console.log(err)
                        }
                    })
                })
                
            }
        )
    }
    //for command movie this
    if(command === "movie-this"){
        if(userQuery == ""){
            userQuery = "Mr Nobody"
        }
        axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy").then(
            function(response) {
                var path = response.data
                var movieData = "\nTitle: " + path.Title + " \nRelease Year: " + path.Year + " \nIMDB rating: " + path.imdbRating + " \nRotten Tomatoes Rating: " + path.Ratings[1].Value + " \nCountry: " + path.Country + " \nLanguage: " + path.Language + " \nPlot: " + path.Plot + " \nActors: " + path.Actors
                console.log(movieData);
                fs.appendFile("log.txt", userQuery + "| ", function(err){
                    if(err){
                        return console.log(err)
                    }
                    fs.appendFile("log.txt", movieData + "| ", function(err){
                        if(err){
                            return console.log(err)
                        }
                    })
                })
                
            }     
        );
    }
}
runApp();