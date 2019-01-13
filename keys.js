console.log("this is loaded");

exports.spotify = {
    id: ProcessingInstruction.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};