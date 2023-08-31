import {DocumentReference, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import {db} from '../../firebase';

import "./styles/MatchSelections.css";

import moment from 'moment';

import Pagination from '@mui/material/Pagination';


// Each blue element
function MatchSelections({currentPickEmGame, user, matchList, setPage, page}) {
    //const [matchDataList, setMatchDataList] = useState([]);
    //const [activePickID, setActivePickID] = useState('');
    //const [weeklySelections, setWeeklySelections] = useState();
    const [newMatchData, setNewMatchData] = useState();

    document.querySelector('button').addEventListener('click', changeStyle);

    function changeStyle(e) {
        e.target.classList.toggle("btn active");
    }

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
        } else { // ELSE ADD selection doc
            const docData = {
                pickEmGameId: currentPickEmGame.meta_id,
                userId: user.uid,
                picks: {
                    [matchId]: teamId
                }
            }
            await addDoc(collection(db, "selections"), docData);
        }
    }

    // Each gray element
    const MatchElement = ({/*matchData, activePickID,*/ sendPick, singleMatchData}) => {

        const [selectionTester, setSelectionTester] = useState(singleMatchData.selection)

        return (
            <div className="matchElement">
                <div className="matchInfo">
                    <p>{moment(singleMatchData.gametime.toDate()).format('[Game time: ] MMM Do, h:mm a')}</p>
                    <p>{singleMatchData.stadiumLocation}</p>
                </div>

                <div className="btnContainer">
                    <button
                        onClick={(e) => {
                            sendPick(
                                singleMatchData.awayTeam.teamId,
                                singleMatchData.meta_id,
                                singleMatchData.selectionId,
                                e)
                            setSelectionTester(singleMatchData.awayTeam.teamId)
                        }}
                        className={singleMatchData.awayTeam.teamId === selectionTester ? "btn active" : "btn"}
                        disabled={selectionTester === singleMatchData.awayTeam.teamId}
                    >
                        <p className="btn-teamName">{singleMatchData.awayTeam.name}</p>
                        <p className="btn-teamNickname">{singleMatchData.awayTeam.nickname}</p>
                    </button>
                    <div className="atSymbol-cont">
                        <img src="https://firebasestorage.googleapis.com/v0/b/game7-blog.appspot.com/o/app%2Fimages%2Fat%20symbol.svg?alt=media&token=5a47c90a-d7e2-4329-a5aa-74b2ab979a1b"
                            alt="@ symbol"
                            className="atSymbol" />
                    </div>
                    <button
                        onClick={(e) => {
                            sendPick(
                                singleMatchData.homeTeam.teamId,
                                singleMatchData.meta_id,
                                singleMatchData.selectionId,
                                e)
                            setSelectionTester(singleMatchData.homeTeam.teamId)
                        }}
                        className={singleMatchData.homeTeam.teamId === selectionTester ? "btn active" : "btn"}
                        disabled={selectionTester === singleMatchData.homeTeam.teamId}
                    >
                        <p className="btn-teamName">{singleMatchData.homeTeam.name}</p>
                        <p className="btn-teamNickname">{singleMatchData.homeTeam.nickname}</p>
                    </button>
                </div>
            </div>
        )
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
                size="large"
            />
            {newMatchData &&
                newMatchData.map((matchData, index) => (
                    <MatchElement key={matchData.meta_id} /*matchData={matchData} activePickID={activePickID}*/ sendPick={sendPick} singleMatchData={newMatchData[index]}
                    />
                ))
            }
            <Pagination
                className="matchSelections-pagination"
                count={totalCount}
                shape="rounded"
                page={page}
                onChange={handlePageChange}
                size="large"
            />
        </div>
    )
}

export default MatchSelections