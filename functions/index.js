/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const dbContext = getFirestore();

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to check the answers and add score to user's selections document
exports.updateSelectionScores = onDocumentUpdated('z_pickemgames/{pickEmGameId}', 
    async (change) => {
        console.log("pickEmGame before: ", change.data.before.data().correctAnswers);
        console.log("pickEmGame after: ", change.data.after.data().correctAnswers);

        // Only trigger the function if the 'correctAnswers' field was updated
        if (change.data.before.data().correctAnswers !== change.data.after.data().correctAnswers) {
            const correctAnswers = change.data.after.data().correctAnswers;
            const pickEmGameId = change.params.pickEmGameId;
            console.log("Correct Answers", correctAnswers)
            console.log("pickEmGameId", pickEmGameId)

            // Get all selections related to the updated pickEmGameId
            const selectionsSnapshot = await dbContext.collection('z_selections')
                .where('pickEmGameId', '==', pickEmGameId)
                .get();

            // Create a batch to update multiple documents
            const batch = dbContext.batch();

            // Process each selection and update the score
            selectionsSnapshot.forEach(selectionDoc => {
                //console.log(selectionDoc.id, '=>', selectionDoc.data());
                const selectionData = selectionDoc.data();
                const picks = selectionData.picks;
                
                console.log("picks", picks)
                console.log("selectionSnapshot ==>", selectionData)

                // Count the number of matching picks
                // Regrades on every update of correctAnswers`
                let score = 0;
                let attempted = 0;
                for (const [question, answer] of Object.entries(picks)) {
                    attempted++;
                    if (correctAnswers[question] === answer) {
                        score++;
                    }
                }
                // Update the score in the z_selections document
                batch.update(selectionDoc.ref, { score, attempted });
            });

            // Commit the batch update`
            await batch.commit();

            console.log(`Scores updated for pickEmGameId: ${pickEmGameId}`);
        }
        return null;
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
/// Cloud function 2:
/// when score is added to a selection, recalculate that users total score
////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateUserScores = onDocumentUpdated('z_selections/{selectionId}',
    async (change) => {
        console.log("Full selection data >>> ", change.data.after.data())
        console.log("selection score before: ", change.data.before.data().score);
        console.log("selection score after: ",change.data.after.data().score);

        // Only trigger the function if the 'score' field was updated
        if (change.data.before.data().score !== change.data.after.data().score) {
            const selectionId = change.params.selectionId;
            const score = change.data.after.data().score;
            const pickEmGameId = change.data.after.data().pickEmGameId;
            const maxPossibleScore = change.data.after.data().maxPossibleScore;
            const userId = change.data.after.data().userId;
            console.log("selectionId >>>", selectionId)
            console.log("score >>>", score)
            console.log("pickEmGameId >>>", pickEmGameId)
            console.log("maxPossibleScore >>>", maxPossibleScore)
            console.log("userId >>>", userId)
            
            // Get all users related to the userId
            const userRef = dbContext.collection('z_users').doc(userId);
            const res = await userRef.set(
                { 
                    pickEmGameScores: {
                        [`${pickEmGameId}`]: {
                            score: score,
                            maxPossibleScore: maxPossibleScore
                        }
                    }
                }, 
                { merge: true }
            );
        }
        return null;
    });


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
// http://127.0.0.1:5001/game7-blog/us-central1/addmessage?text=yabbayabba
// adds document with field "original" and value "yabbayabba"
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
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////