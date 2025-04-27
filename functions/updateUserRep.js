const repData = require('./data/repData.json');
const {getFirestore} = require("firebase-admin/firestore");


// ERROR: no "error" but in one case, it updated the user's pickemgamescores really weird. I couldn't replicate it. It happened at first run of function after starting emulators

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

// Export the function so it can be used in other files
module.exports = { updateUserRep };