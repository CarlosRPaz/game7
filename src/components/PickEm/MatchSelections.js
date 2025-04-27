import {DocumentReference, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import {db} from '../../firebase';

import "./styles/MatchSelections.css";

import moment from 'moment';

import Pagination from '@mui/material/Pagination';
import MatchElement from './MatchElement';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/userSlice';


// Each blue element
function MatchSelections({currentPickEmGame, jointMatchList, setPage, page}) {
    const user = useSelector(selectUser);
    const [ygra, setYGRA] = useState();

    //const [newMatchData, setNewMatchData] = useState();

    document.querySelector('button').addEventListener('click', changeStyle);

    function changeStyle(e) {
        e.target.classList.toggle("btn active");
    }

    /*
    //TODO: make sure to have fallback if selection doesnt exist
    // create useEffect to load in weekly selection object
    useEffect(() => {
        // Load selection if it exists
        const loadSelection = async () => {
            const q = query(collection(db, "selections"),
                where("pickEmGameId", "==", currentPickEmGame.meta_id),
                where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if(querySnapshot.empty) {
                setNewMatchData(matchList);
            } else {
                querySnapshot.forEach((doc) => {
                    let picks = doc.data().picks;
                    let result = matchList.map(match => ({
                        ...match,
                        selection: picks[match.meta_id],
                        selectionId: doc.id,
                    }));
                    setNewMatchData(result);
                });
            }
        }

        currentPickEmGame && loadSelection().catch(console.error);
    }, [currentPickEmGame, user, matchList]);
    */

    const sendPick = async (teamId, matchId, selectionId, e) => {
        //e.preventDefault();
        //e.target.className = "btn active";
        console.log("teamId selected", teamId);

        //TODO: Once you add doc, the page doesnt reload, so when you select a new game, it can't read selectionId because it hasn't pulled new data from DB. Either reload, or have the newMatchData be loaded in on a Listener maybe???? research that
        // IF selection exists, UPDATE selection in picks object of selection doc
        if(selectionId) {
            const selectionRef = doc(db, "selections", selectionId);
            let selectionsUpdate = {};
            selectionsUpdate[`picks.${matchId}`] = teamId;
            await updateDoc(selectionRef, selectionsUpdate, {merge: true});
        } else if(ygra) {
            const selectionRef = doc(db, "selections", ygra);
            let selectionsUpdate = {};
            selectionsUpdate[`picks.${matchId}`] = teamId;
            await updateDoc(selectionRef, selectionsUpdate, {merge: true});
        } else { // ELSE ADD selection doc
            const docData = {
                pickEmGameId: currentPickEmGame.meta_id,
                userId: user.uid,
                league: currentPickEmGame?.leagueAbbr,
                year: currentPickEmGame?.year,
                picks: {
                    [matchId]: teamId
                }
            }
            const docRef = await addDoc(collection(db, "selections"), docData);
            setYGRA(docRef.id);
        }
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const totalCount = 13;

    return (
        <div className="matchSelections">
            <h2>Week</h2>
            <Pagination
                className="matchSelections-pagination"
                count={totalCount}
                shape="rounded"
                page={page}
                onChange={handlePageChange}
            /*size="large"*/
            />
            {jointMatchList &&
                jointMatchList.map((matchData, index) => (
                    <MatchElement key={matchData.meta_id} sendPick={sendPick} singleMatchData={jointMatchList[index]}
                    />
                ))
            }
            <Pagination
                className="matchSelections-pagination"
                count={totalCount}
                shape="rounded"
                page={page}
                onChange={handlePageChange}
            /*size="large"*/
            />
        </div>
    )
}

export default MatchSelections