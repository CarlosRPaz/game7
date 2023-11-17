/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

//// The Firebase Admin SDK to access Firestore. //////////////////////
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
///////////////////////////////////////////////

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});


// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await getFirestore()
        .collection("messages")
        .add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
    // Grab the current value of what was written to Firestore.
    const original = event.data.data().original;

    // Access the parameter `{documentId}` with `event.params`
    logger.log("Uppercasing", event.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing
    // asynchronous tasks inside a function
    // such as writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return event.data.ref.set({uppercase}, {merge: true});
});

// Listens for new messages added to /matches/:documentId/winnerTeamId
exports.addmatchscore = onDocumentUpdated("/matches/{documentId}", (event) => {
    // pseudo code ///////////////////////////////////////
    // - get pickEmGameId by 
    //      pickEmGames 
    //      WHERE pickEmGames.year === match.year 
    //      AND pickEmGames.leagueAbbr === match.leagueAbbr
    // - matchId
    // - winnerTeamId
    // 
    // - selection WHERE pickEmGameId: <pickEmGameId>
    // - if selection.picks[matchId] === winnerTeamValue
    //      THEN increment selection.scoreValue
    /////////////////////////////////////////////////////////

    // Grab the current value of what was written to Firestore.
    const winnerTeamValue = event.data.data().winnerTeamId;

    // Query for all selections (collection) WITH pickEmGameId === <correctPickEmGameId>
    //     where picks[matchId] === winnerTeamValue
    const selectionId = 'pltDCn9xoWqXcS4f44I5';

    // Grab userId from those selections and WRITE/UPDATE score in that user document

    // You must return a Promise when performing
    // asynchronous tasks inside a function
    // such as writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return db.doc(`selections/${selectionId}`).set({winnerTeamValue}, {merge: true});
});