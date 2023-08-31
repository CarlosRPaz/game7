import React, {useState, useEffect, useRef} from "react";
import "./styles/PickEmGame.css";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

import {useSelector} from "react-redux";
import {selectUser} from "../../features/userSlice";

import sanityClient from '../../client.js';
import SocialsWidget from "../Home/SocialsWidget";
import PollWidget from "../Home/PollWidget";

import {
    db,
    addDoc,
    doc,
    getDocs,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    // update doc
    onSnapshot,
    serverTimestamp,
} from '../../firebase';
import MatchSelections from "./MatchSelections";
import OneOfMany from "./OneOfMany";
import {getCountFromServer, orderBy} from "firebase/firestore";

function PickEmGame() {

    const user = useSelector(selectUser);

    const ref = useRef(null);

    const {slug} = useParams();
    const [currentPickEmGame, setCurrentPickEmGame] = useState();

    const [matchList, setMatchList] = useState([]);

    const [page, setPage] = useState(1);

    // Store selection here on page-load

    useEffect(() => {
        // Load pickemgame data from pickemgame that contains the slug that is passed through
        const loadPickEmGame = async () => {
            const q = query(collection(db, "pickemgames"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                // SAVE PICKEMGAME DATA IN useState([]) variable
                setCurrentPickEmGame({...doc.data(), meta_id: doc.id});
            });
        }

        loadPickEmGame().catch(console.error);
    }, [slug])
    /*
        // load matches if gameType == matchSelections
        useEffect(() => {
            if(currentPickEmGame?.gameType === "matchSelections") {
                const loadMatches = async () => {
                    const q = query(collection(db, "matches"),
                        where("leagueAbbr", "==", currentPickEmGame.leagueAbbr),
                        where("year", "==", currentPickEmGame.year));
                    const querySnapshot = await getDocs(q);
    
                    querySnapshot.forEach((doc) => {
                        setMatchList(matchList => [...matchList, {...doc.data(), meta_id: doc.id}]);
                    });
                }
    
                loadMatches().catch(console.error);
            }
        }, [currentPickEmGame]);
        */

    // load matches FOR PAGINATION ///////////////////////////////////////// UNDER CONSTRUCTION
    useEffect(() => {
        if(currentPickEmGame?.gameType === "matchSelections" && page) {
            const loadMatches = async () => {
                const matchesRef = query(collection(db, "matches"),
                    where("week", "==", page),
                    where("leagueAbbr", "==", currentPickEmGame.leagueAbbr),
                    where("year", "==", currentPickEmGame.year));
                const querySnapshot = await getDocs(matchesRef);

                setMatchList([]);

                querySnapshot.forEach((doc) => {
                    setMatchList(matchList => [...matchList, {...doc.data(), meta_id: doc.id}]);
                });
            }

            loadMatches().catch(console.error);
        }
    }, [currentPickEmGame, page]);

    /*
    // Get the container element
    var btnContainer = document.getElementById("btnContainer");

    // Get all buttons with class="btn" inside the container
    var btns = btnContainer.getElementsByClassName("btn");

    // Loop through the buttons and add the active class to the current/clicked button
    for(var i = 0;i < btns.length;i++) {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");

            // If there's no active class
            if(current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }

            // Add the active class to the current/clicked button
            this.className += " active";
        });
    }
    */

    function PickEmGameElement({currentPickEmGame, user, matchList}) {
        //const gameType = currentPickEmGame.gameType;

        if(currentPickEmGame.gameType === "oneOfMany") {
            return <OneOfMany currentPickEmGame={currentPickEmGame} user={user} />;
        } else if(currentPickEmGame.gameType === "matchSelections") {
            return <MatchSelections currentPickEmGame={currentPickEmGame} user={user} matchList={matchList} setPage={setPage} page={page} />;
        }
        return <p>gameType error</p>;
    }

    return (
        <div className="pickEmGame">
            <div className="nflHome-cont">
                <div className="nflHome-left">
                    <SocialsWidget />
                </div>

                <div className="nflHome-middle">
                    <h1>
                        {currentPickEmGame ? <p>{currentPickEmGame.name}</p> : 'loading...'}
                    </h1>

                    {/* Need gameType and pickemgame data */}
                    {currentPickEmGame && <PickEmGameElement currentPickEmGame={currentPickEmGame} user={user} matchList={matchList} setPage={setPage} page={page} />}
                </div>

                <div className="nflHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmGame;