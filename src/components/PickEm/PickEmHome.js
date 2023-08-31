import React, {useState, useEffect} from "react";
import "./styles/PickEmHome.css";
import {Link} from "react-router-dom";

import PickEmGameCard from "./PickEmGameCard";

import {
    db,
    /*
    addDoc,
    where,
    serverTimestamp,
    */
    collection,
    query,
    onSnapshot,
} from '../../firebase';

// import sanityClient from '../../client.js';
import SocialsWidget from "../Home/SocialsWidget";
import PollWidget from "../Home/PollWidget";


function PickEmHome() {

    const [pickEmGames, setPickEmGames] = useState([]);

    useEffect(() => {
        onSnapshot(query(collection(db, "pickemgames")), (snapshot) => {
            setPickEmGames(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })
    }, []);

    return (
        <div className="nflHome" id="content-wrap">
            <div className="nflHome-cont">
                <div className="nflHome-left">
                    <SocialsWidget />
                </div>
                <div className="nflHome-middle">
                    {pickEmGames && pickEmGames.map((pickemGame, index) => (
                        <Link to={"/pickemgame/" + pickemGame.data.slug} key={pickemGame.id} className="recentArticles-link" style={{textDecoration: 'none'}}>
                            <PickEmGameCard pickemGame={pickemGame.data} key={pickemGame.data.id} />
                        </Link>
                    ))}
                </div>
                <div className="nflHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default PickEmHome;