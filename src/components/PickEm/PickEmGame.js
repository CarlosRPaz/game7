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

function PickEmGame() {

    const user = useSelector(selectUser);

    const ref = useRef(null);

    const {slug} = useParams();
    const [currentPickEmGame, setCurrentPickEmGame] = useState();
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

    function PickEmGameElement({currentPickEmGame, user}) {
        const gameType = currentPickEmGame.gameType;

        if(gameType === "oneOfMany") {
            return <OneOfMany currentPickEmGame={currentPickEmGame} user={user} />;
        } else if(gameType === "matchSelections") {
            return <MatchSelections currentPickEmGame={currentPickEmGame} user={user} />;
        }
        return <p>gameType error</p>;
    }

    return (
        <div className="nflHome" id="content-wrap">
            <div className="nflHome-cont">
                <div className="nflHome-left">
                    <SocialsWidget />
                </div>

                <div className="nflHome-middle">
                    <h3>PickEmGame Page</h3>
                    {slug ? <p>Slug: {slug}</p> : 'loading...'}
                    {currentPickEmGame ? <p>{currentPickEmGame.gameType}</p> : 'loading...'}

                    {/* Need gameType and pickemgame data */}
                    {currentPickEmGame && <PickEmGameElement currentPickEmGame={currentPickEmGame} user={user} />}
                </div>

                <div className="nflHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmGame;