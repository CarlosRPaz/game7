import {DocumentReference, collection, doc, getDoc, getDocs, query, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import {db} from '../../firebase';

import "./styles/MatchSelections.css";

import moment from 'moment';


// Each blue element
function MatchSelections({currentPickEmGame, user, matchList}) {
    //const [matchDataList, setMatchDataList] = useState([]);
    const [activePickID, setActivePickID] = useState('usctrojans');
    const [weeklySelections, setWeeklySelections] = useState();


    //console.log("new matchData", matchData);

    // create useEffect to load in weekly selection object
    useEffect(() => {
        // Load selection if it exists
        const loadSelection = async () => {
            const q = query(collection(db, "selections"),
                where("pickEmGameId", "==", currentPickEmGame.meta_id),
                where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //let weeks = doc.data().weeks;
                setWeeklySelections(doc.data().weeks);
            });
        }

        loadSelection().catch(console.error);
    }, [currentPickEmGame, user]);

    const sendPick = async (teamId, e) => {
        //e.preventDefault();
        console.log("teamId selected", teamId);
    }

    // Each gray element
    const MatchElement = ({matchData, sendPick, activePickID}) => {

        return (
            <div className="matchElement">
                <p>{moment(matchData.gametime.toDate()).format('[Game time: ] MMM Do, h:mm a')}</p>
                <p>{matchData.stadiumLocation}</p>

                <button
                    onClick={(e) => sendPick(matchData.awayTeam.teamId, e)}
                    className={matchData.teamId === activePickID ? "btn active" : "btn"}
                >
                    {matchData.awayTeam.name}
                    {matchData.awayTeam.nickName}
                </button>

                <button
                    onClick={(e) => sendPick(matchData.homeTeam.teamId, e)}
                    className={matchData.teamId === activePickID ? "btn active" : "btn"}
                >
                    {matchData.homeTeam.name}
                    {matchData.homeTeam.nickName}
                </button>
            </div>
        )
    }

    if(matchList) {
        console.log("matchList", matchList);
    }

    return (
        <div className="matchSelections">
            <h1>matchSelections component</h1>
            <div>{currentPickEmGame?.gameType}</div>
            {matchList &&
                matchList.map((matchData, index) => (
                    <MatchElement key={matchData.meta_id} matchData={matchData} sendPick={sendPick} activePickID={activePickID} />
                ))
            }
        </div>
    )
}

export default MatchSelections