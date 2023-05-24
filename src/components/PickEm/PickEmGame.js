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

function PickEmGame() {

    const user = useSelector(selectUser);

    const ref = useRef(null);

    const {slug} = useParams();
    const [playersList, setPlayersList] = useState([]);
    const [currentPickEmGame, setCurrentPickEmGame] = useState();
    // Store selection here on page-load
    const [activePickID, setActivePickID] = useState('');
    const [selectionID, setSelectionID] = useState('');
    const [isActive, setIsActive] = useState(true);

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

    useEffect(() => {
        // Load selection if it exists
        const loadSelection = async () => {
            const q = query(collection(db, "selections"), where("pickEmGameId", "==", currentPickEmGame.meta_id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log("selectionId => ", doc.id);
                setActivePickID(doc.data().selection);
                setSelectionID(doc.id);
            });
        }

        if(currentPickEmGame) {
            loadSelection().catch(console.error);
        }
    }, [currentPickEmGame])

    // Load All Players List
    useEffect(() => {
        const loadPlayers = async () => {
            const q = query(collection(db, "players"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                setPlayersList(playersList => [...playersList, {...doc.data(), meta_id: doc.id}]);
            });
        }

        loadPlayers().catch(console.error);
    }, [])

    if(activePickID) {
        console.log('activePickID: ', activePickID);
    }

    const sendPick = async (playerId, e) => {
        //e.preventDefault();
        e.target.className += " active";

        // IF selection already exists, UPDATE selection variable, ELSE ADD selection doc
        if(activePickID) {
            const selectionRef = doc(db, 'selections', selectionID);
            await setDoc(selectionRef, {selection: playerId}, {merge: true});
        } else {
            // ADD selection doc
            await addDoc(collection(db, 'selections'), {
                userId: user ?.uid,                                // GOOD
                selection: playerId,                              // GOOD
                pickEmGameId: currentPickEmGame ?.meta_id,         // GOOD
            });
        }

        // Update local selection variable
        setActivePickID(playerId);
    }

    function Selection({player}) {
        return (
            <button
                onClick={(e) => sendPick(player.meta_id, e)}
                className={player.meta_id === activePickID ? "btn active" : "btn"}
            >
                {player.name}
            </button>
        )
    }

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

    return (
        <div className="nflHome" id="content-wrap">
            <div className="nflHome-cont">
                <div className="nflHome-left">
                    <SocialsWidget />
                </div>
                <div className="nflHome-middle">
                    <h3>PickEmGame Page</h3>
                    {slug ? <p>Slug: {slug}</p> : 'loading...'}

                    <div id="btnContainer">
                        {playersList && playersList.map((player, index) => (
                            <Selection key={player.meta_id} player={player} />
                        ))}
                    </div>

                </div>
                <div className="nflHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmGame;