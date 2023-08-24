import React, {useEffect, useState} from 'react'

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

function OneOfMany({currentPickEmGame, user}) {
    const [eachSelection, setEachSelection] = useState();

    const [playersList, setPlayersList] = useState([]);

    const [activePickID, setActivePickID] = useState('');
    const [selectionID, setSelectionID] = useState('');
    const [isActive, setIsActive] = useState(true);

    // On every component load, load selection from DB
    useEffect(() => {
        // Load selection if it exists
        const loadSelection = async () => {
            const q = query(collection(db, "selections"), where("pickEmGameId", "==", currentPickEmGame.meta_id), where("userId", "==", user.uid));
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
        console.log("CPEG", currentPickEmGame);
    }, [currentPickEmGame, user])

    // On every component load, load selection from DB Load All Players List
    useEffect(() => {
        const loadPlayers = async () => {
            const q = query(collection(db, currentPickEmGame.pool), where("leagueAbbr", "==", currentPickEmGame.leagueAbbr));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                setPlayersList(playersList => [...playersList, {...doc.data(), meta_id: doc.id}]);
            });
        }

        loadPlayers().catch(console.error);
    }, [currentPickEmGame]);

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
                userId: user?.uid,                                // GOOD
                selection: playerId,                              // GOOD
                pickEmGameId: currentPickEmGame?.meta_id,         // GOOD
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
                {player?.name}
            </button>
        )
    }

    return (
        <div>
            <h1>OneOfMany component</h1>

            <div id="btnContainer">
                {playersList && playersList.map((player, index) => (
                    <Selection key={player.meta_id} player={player} />
                ))}
            </div>
        </div>
    )
}

export default OneOfMany