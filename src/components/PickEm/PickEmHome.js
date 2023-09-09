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
import {useSelector} from "react-redux";
import {selectUser} from "../../features/userSlice";
import {Box, Collapse, Grow, IconButton, CloseIcon, Slide, Snackbar} from "@mui/material";
import {Alert} from "@mui/material";


function PickEmHome() {
    const user = useSelector(selectUser);

    const [pickEmGames, setPickEmGames] = useState([]);
    //const [showAlert, setShowAlert] = useState(false);

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const {vertical, horizontal, open} = state;


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

    const handleClick = (newState) => (e) => {
        if(!user) {
            e.preventDefault();
            setState({...newState, open: true});
        } else {
            return;
        }
    };
    const handleClose = () => {
        setState({...state, open: false});
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={handleClose}
                message=""
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="warning" sx={{width: '100%'}}>
                    You must be logged in to access Game7's Pick 'Em Games
                </Alert>
            </Snackbar>
            <div className="pickEmGameHome" id="content-wrap">
                <div className="pickEmGameHome-cont">
                    <div className="pickEmGameHome-left">
                        <SocialsWidget />
                    </div>
                    <div className="pickEmGameHome-middle">
                        <h1>Game7's Pick 'Em Games</h1>
                        {pickEmGames && pickEmGames.map((pickemGame, index) => (
                            <Link to={"/pickemgame/" + pickemGame.data.slug} key={pickemGame.id}
                                className={`recentArticles-link`}
                                style={{textDecoration: 'none'}}
                                onClick={handleClick({vertical: 'bottom', horizontal: 'center'})}
                            >
                                <PickEmGameCard pickemGame={pickemGame.data} key={pickemGame.data.id} />
                            </Link>
                        ))}
                    </div>
                    <div className="pickEmGameHome-right">
                        <PollWidget />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PickEmHome;