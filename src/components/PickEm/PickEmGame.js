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
    const [jointMatchList, setJointMatchList] = useState([]);

    const [page, setPage] = useState(1);

    // Store selection here on page-load

    useEffect(() => {
        // Load pickemgame data from pickemgame that contains the slug that is passed through
        const loadPickEmGame = async () => {
            const q = query(collection(db, "pickemgames"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
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
                    where("year", "==", currentPickEmGame.year),
                    orderBy("gametime"));
                const querySnapshot = await getDocs(matchesRef);

                setMatchList([]);

                querySnapshot.forEach((doc) => {
                    setMatchList(matchList => [...matchList, {...doc.data(), meta_id: doc.id}]);
                });
            }

            loadMatches().catch(console.error);
        }
    }, [currentPickEmGame, page]);

    //TODO: make sure to have fallback if selection doesnt exist
    // create useEffect to load in weekly selection object
    useEffect(() => {
        if(currentPickEmGame?.gameType === "matchSelections") {
            // Load selection if it exists
            const loadSelection = async () => {
                const q = query(collection(db, "selections"),
                    where("pickEmGameId", "==", currentPickEmGame.meta_id),
                    where("userId", "==", user?.uid));
                const querySnapshot = await getDocs(q);

                if(querySnapshot.empty) {
                    setJointMatchList(matchList);
                } else {
                    querySnapshot.forEach((doc) => {
                        let picks = doc.data().picks;
                        let result = matchList.map(match => ({
                            ...match,
                            selection: picks[match.meta_id],
                            selectionId: doc.id,
                        }));
                        setJointMatchList(result);
                    });
                }
            }

            currentPickEmGame && loadSelection().catch(console.error);
        }
    }, [currentPickEmGame, user, matchList, page]);

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

    function PickEmGameElement({currentPickEmGame, jointMatchList}) {
        //const gameType = currentPickEmGame.gameType;

        if(currentPickEmGame.gameType === "oneOfMany") {
            return <OneOfMany currentPickEmGame={currentPickEmGame} />;
        } else if(currentPickEmGame.gameType === "matchSelections") {
            return <MatchSelections currentPickEmGame={currentPickEmGame} jointMatchList={jointMatchList} setPage={setPage} page={page} />;
        }
        return <p>gameType error</p>;
    }

    return (
        <div className="pickEmGame">
            <div className="pickEmGame-cont">
                <div className="pickEmGame-left">
                    <SocialsWidget />
                </div>

                <div className="pickEmGame-middle">
                    <h1>
                        {currentPickEmGame ? <p>{currentPickEmGame.name}</p> : 'loading...'}
                    </h1>

                    {/* Need gameType and pickemgame data */}
                    {currentPickEmGame && <PickEmGameElement currentPickEmGame={currentPickEmGame} jointMatchList={jointMatchList} setPage={setPage} page={page} />}
                </div>

                <div className="pickEmGame-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmGame;