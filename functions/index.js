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

const repData = require('./data/repData.json');

initializeApp();
const dbContext = getFirestore();


// helper fxn
const updateUserRep = async (userLeagueScoreData, userRef, pickEmGameId, league, year, score) => {
    //console.log('INSIDE UPDATE USER REP FUNCTION');
    //console.log('userLeagueScoreData parameter:', userLeagueScoreData);
    //console.log('league parameter:', league);
    //console.log('year parameter:', year);
    //console.log('repData.gameWeight >>> ', repData[league][year]['2024-NFL-Weeklypickems'].gameWeight);
    //console.log('repData >>> ', repData[league]);
    //console.log('userLeagueScoreData parameter >>> ', userLeagueScoreData.pickEmGameScores[league]);
    const userScore = score;
    const maxPossibleScore = repData[league][year][pickEmGameId].maxPossibleScore;
    const gameWeight = repData[league][year][pickEmGameId].gameWeight;

    console.log("userScore: ", userScore)
    console.log("repData.maxPossibleScore: ", maxPossibleScore)
    console.log("repData.gameWeight: ", gameWeight)

    const weightedScore = ((userScore/maxPossibleScore)*gameWeight)

    console.log("weightedScore: ", weightedScore)

    //console.log("user weightedScore >>> ", weightedScore);
    // Update the user's pickEmGameScores with the new weighted score
    await userRef.update({
        [`pickEmGameScores.${league}.${year}.${pickEmGameId}.weightedScore`]: weightedScore
    });

    // We are not pulling the updated DB pickEmGameScores, so we will update the local pickEmGameScores with the new weighted score as well
    if (!userLeagueScoreData.pickEmGameScores[league][year][pickEmGameId]) {
        userLeagueScoreData.pickEmGameScores[league][year][pickEmGameId] = {};
    }
    userLeagueScoreData.pickEmGameScores[league][year][pickEmGameId].weightedScore = weightedScore;

    // Recalculate the total weighted score for this league-year; starts with local data
    let totalWeightedScore = 0;
    let gameCount = 0;

     // Loop through all the games in the league-year and sum their weighted scores
    const leagueYearGames = userLeagueScoreData.pickEmGameScores[league][year];
    for (const game in leagueYearGames) {
         if (leagueYearGames[game].weightedScore) {
             totalWeightedScore += leagueYearGames[game].weightedScore;
             gameCount++;
         }
     }

     //console.log("totalWeightedScore for league-year> > > ", totalWeightedScore); ///// WORKS
     //console.log("gameCount > > > ", gameCount);

    // TO-DO: Store leagueYearUserRepScore in the user's document.
    const leagueYearUserRepScore = totalWeightedScore;
    await userRef.update({
        [`pickEmGameScores.${league}.${year}.leagueYearUserRepScore`]: leagueYearUserRepScore
    }); 

    // We are not pulling the updated DB pickEmGameScores, so we will update the local pickEmGameScores with the new leagueYearUserRepScore as well
    userLeagueScoreData.pickEmGameScores[league][year].leagueYearUserRepScore = leagueYearUserRepScore;

    // TO-DO: Recalculate leagueUserRepScore by averaging all leagueYearUserRepScore values for a specific league adn store as leagueUserRepScore
    // Now, recalculate the leagueUserRepScore (average of all leagueYearUserRepScore for this league)
    let totalRepScore = 0;
    let yearCount = 0;
    const leagueYears = userLeagueScoreData.pickEmGameScores[league];

    // Loop through all the years in the league
    for (const year in leagueYears) {
        if (leagueYears[year].leagueYearUserRepScore) {
            totalRepScore += leagueYears[year].leagueYearUserRepScore;
            yearCount++;
        }
    }

    // Calculate the average league user rep score
    const leagueUserRepScore = totalRepScore / yearCount;

    // Update the leagueUserRepScore at the root level for the user
    await userRef.update({
        [`${league}-Rep`]: leagueUserRepScore
    });

    // TO-DO: CLEAN LOGS TO PRESENT TO G7 STAFF

    return `updateUserRep executed`;
};



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to check the answers and add score to user's selections document
exports.updateSelectionScores = onDocumentUpdated('pickemgames/{pickEmGameId}', 
    async (change) => {
        //console.log("Inside updateSelectionScores");

        //console.log("pickEmGame before: ", change.data.before.data().correctAnswers);
        //console.log("pickEmGame after: ", change.data.after.data().correctAnswers);

        // Only trigger the function if the 'correctAnswers' field was updated with new information
        if (change.data.before.data().correctAnswers !== change.data.after.data().correctAnswers) {
            //console.log("Inside if statement correctAnswers field updated");


            const correctAnswers = change.data.after.data().correctAnswers;
            const pickEmGameId = change.params.pickEmGameId;
            //console.log("Correct Answers", correctAnswers)
            //console.log("pickEmGameId", pickEmGameId)

            // Get all selections related to the updated pickEmGameId
            const selectionsSnapshot = await dbContext.collection('selections')
                .where('pickEmGameId', '==', pickEmGameId)
                .get();

            // Create a batch to update multiple documents
            const batch = dbContext.batch();

            // Process each selection and update the score
            selectionsSnapshot.forEach(selectionDoc => {
                //console.log(selectionDoc.id, '=>', selectionDoc.data());
                const selectionData = selectionDoc.data();
                const picks = selectionData.picks;
                
                //console.log("picks", picks)
                //console.log("selectionSnapshot ==>", selectionData)

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
                // Update the score in the selections document
                batch.update(selectionDoc.ref, { score, attempted });
            });

            // Commit the batch update`
            await batch.commit();

            //console.log(`Scores updated for pickEmGameId: ${pickEmGameId}`);
        }
        return null;
    });
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
/// Cloud function 2:
/// when score is added to a selection, recalculate that users total score
/// CONSIDER: Is there a case in which score ISN't updated but rep would need to be recalculated?
////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateUserScores = onDocumentUpdated('selections/{selectionId}',
    async (change) => {
        //console.log("Full selection data >>> ", change.data.after.data())
        //console.log("selection score before: ", change.data.before.data().score);
        //console.log("selection score after: ",change.data.after.data().score);

        // Only trigger the function if the 'score' field was updated
        if (change.data.before.data().score !== change.data.after.data().score) {
            const selectionId = change.params.selectionId;
            const score = change.data.after.data().score;
            const pickEmGameId = change.data.after.data().pickEmGameId;
            const attempted = change.data.after.data().attempted;
            const userId = change.data.after.data().userId;
            const league = change.data.after.data().league;
            const year = change.data.after.data().year;
            //console.log("LEAGUE right here >>>>>", league);
            
            // Set user's score in user doc
            const userRef = dbContext.collection('users').doc(userId);
            const res = await userRef.set(
                { 
                    pickEmGameScores: {
                        [`${league}`]: {
                            [`${year}`]: {
                                [`${pickEmGameId}`]: {
                                    score: score,
                                    attempted: attempted
                                }
                            }
                        }
                    }
                }, 
                { merge: true }
            );

            // take all of user's scores and recalculate rep with an external fxn
            const docSnapshot = await userRef.get(); // This retrieves the document
            if (docSnapshot.exists) {
                // If the document exists, you can extract and use the data
                const userData = docSnapshot.data();
                //console.log("userDocSnapshot > userData >>>", userData); // Logs the entire document data
            } else {
                console.log("No such document!");
            }

            updateUserRep(docSnapshot.data(), userRef, pickEmGameId, league, year, score);
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


