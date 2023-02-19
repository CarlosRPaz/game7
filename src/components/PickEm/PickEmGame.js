import React, {useState, useEffect} from "react";
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
    collection,
    query,
    where,
    onSnapshot,
    serverTimestamp,
} from '../../firebase';


function PickEmGame() {

    const user = useSelector(selectUser);

    const {slug} = useParams();
    const [playersList, setPlayersList] = useState([]);
    const [currentPickEmGame, setCurrentPickEmGame] = useState();
    const [activePickID, setActivePickID] = useState();
    const [isActive, setIsActive] = useState();

    // Load pickemgame data from pickemgame that contains the slug that is passed through
    useEffect(() => {
        const loadPickEmGame = async () => {
            const q = query(collection(db, "pickemgames"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                // SAVE PICKEMGAME DATA IN useState([]) variable
                setCurrentPickEmGame({...doc.data(), meta_id: doc.id});
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
                setPlayersList(playersList => [...playersList, {...doc.data(), meta_id: doc.id}]);
            });
        }

        loadPlayers().catch(console.error);
    }, [])

    if(playersList) {
        console.log('Full list', playersList);
    }

    if(currentPickEmGame) {
        console.log('Pick Em Game Info: ', currentPickEmGame);
    }

    const sendPick = async (playerId) => {
        console.log(playerId);
        await addDoc(collection(db, 'selections'), {
            userId: user.id,                // CHANGE
            selection: playerId,            // GOOD
            pickEmGameId: currentPickEmGame.meta_id,     // CHANGE
        });
    }

    function Selection({player}) {
        return (
            <button onClick={(e) => sendPick(player.meta_id)}>
                {player.name}
            </button>
        )
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

                    {playersList && playersList.map((player, index) => (
                        <Selection key={player.meta_id} player={player} />
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