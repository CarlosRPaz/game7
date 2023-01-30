import React, {useState, useEffect} from "react";
import "./styles/PickEmGame.css";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

import sanityClient from '../../client.js';
import SocialsWidget from "../Home/SocialsWidget";
import PollWidget from "../Home/PollWidget";

import {
    db,
    addDoc,
    doc,
    getDocs,
    collection,
    query,
    where,
    onSnapshot,
    serverTimestamp,
} from '../../firebase';


function PickEmGame() {

    const {slug} = useParams();
    const [playersList, setPlayersList] = useState([]);

    // Load pickemgame data from pickemgame that contains the slug that is passed through
    useEffect(() => {
        const loadPickEmGame = async () => {
            const q = query(collection(db, "pickemgames"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        }

        loadPickEmGame().catch(console.error);
    }, [])

    // Load Players
    useEffect(() => {
        const loadPlayers = async () => {
            const q = query(collection(db, "players"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                setPlayersList(playersList => [...playersList, doc.data()]);
            });
        }

        loadPlayers().catch(console.error);
    }, [])

    if(playersList) {
        console.log('Full list', playersList);
    }

    return (
        <div className="nflHome" id="content-wrap">
            <div className="nflHome-cont">
                <div className="nflHome-left">
                    <SocialsWidget />
                </div>
                <div className="nflHome-middle">
                    PickEmGame Page. Slug:
                    {slug ? <p>{slug}</p> : 'loading...'}

                    {playersList && playersList.map((player, index) => (
                        <p key={player.name}>
                            {player.name}
                        </p>
                    ))}

                </div>
                <div className="nflHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmGame;