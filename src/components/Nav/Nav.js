import React, {useEffect, useState} from "react";
import "./styles/Nav.css";

import {Link} from "react-router-dom";
import './styles/Nav.css';
import Logo from './../../img/logo.png';
import AvatarOption from "./AvatarOption";
import {useDispatch, useSelector} from "react-redux";
import {auth, collection, db, onSnapshot, query, where} from "../../firebase";
import {logout, selectUser} from "../../features/userSlice";

import MenuIcon from '@mui/icons-material/Menu';
import {MenuItem, Button, Menu} from "@mui/material";

import {makeStyles, withStyles} from '@mui/material/styles';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from "@mui/icons-material/Close";
//import Modal from '@mui/material/Modal';
//import Box from '@mui/material/Box';
//import Typography from '@mui/material/Typography';

import {SidebarData} from "./SidebarData";
//import Login from "../Auth/Login";

import {useNavigate} from 'react-router-dom';

import DefaultProfImg from './../../img/default profile img.jpg';


/*
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '3px',
    boxShadow: 24,
    p: 0,
};

const useStyles = makeStyles({
    root: {
        background: '#2C2C30',
        borderRadius: 3,
        border: 0,
        color: '#eaeef3',
        height: '2rem',
        fontWeight: '600',
        textDecoration: 'none',
        padding: 0,
    },
    label: {
        textTransform: 'capitalize',
    },
});
*/


function Nav() {
    const user = useSelector(selectUser);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [openMenu, setOpenMenu] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    //const [anchorEl, setAnchorEl] = React.useState(null);
    const [sidebar, setSidebar] = useState(false);

    //const classes = useStyles();

    const showSidebar = () => setSidebar(!sidebar);
    const showModal = () => {
        setOpenModal(true);
        setOpenMenu(!openMenu);
    }
    // const hideModal = () => setOpenModal(false);

    const [profileData, setProfileData] = useState(null);
    const [profileImg, setProfileImg] = useState();


    const logoutOfApp = () => {
        dispatch(logout());
        auth.signOut();
        navigate("/");
        setOpenMenu(!openMenu);
        setProfileImg();
        // update img TODO: create state for img. set img state on useEffect
    };

    /*
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    */

    // Load user's data from database
    useEffect(() => {
        const getUserProfileData = async () => {
            if(user) {
                // get query ref for a user with a certain id
                const q = query(collection(db, "users"), where("userId", "==", user.uid));

                // get snapshot of user profile and set to currentProfile
                onSnapshot(q, (snapshot) => {
                    setProfileData(
                        snapshot.docs.at(0).data()
                    );
                    setProfileImg(snapshot.docs.at(0).data().url)
                },
                    (error) => {
                        console.log("onSnapshot error: ", error);
                    });
            }
        }

        getUserProfileData();

        console.log("PP useEffect ran: load user's data");
    }, [user]);

    function Menu() {
        return (
            <div className="menu">
                <ul>
                    {user ? (
                        <li>
                            <Link to={"/profile/" + user.uid}
                                key={user.uid}
                                className="menu-link"
                                style={{textDecoration: 'none'}}
                                onClick={() => setOpenMenu(!openMenu)}>
                                <img className="menu-profileIMG"
                                    src={profileData?.url ? profileData?.url : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'}
                                    alt='tempALT'
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                />
                                My Profile
                            </Link>
                        </li>
                    ) : (
                        void 0
                    )}

                    {user ? <hr className="solid" /> : void 0}

                    <li>
                        {user ? (
                            <div onClick={logoutOfApp}
                                className="menu-authBtn logoutBtn">
                                <LogoutIcon className="menu-authBtn-icon" />
                                Logout
                            </div>
                        ) : (
                            <Link to="/landing" className="landingLink ">
                                <div onClick={showModal}
                                    className="menu-authBtn loginBtn">
                                    <LoginIcon className="menu-authBtn-icon" />
                                    Login
                                </div>
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        );
    }

    console.log("user", user);
    console.log("profileData", profileData);

    return (
        <div className="nav">
            <div className="nav-links">
                <Link to="/" className="nav__logo-cont">
                    <img className="nav__logo" src={Logo} alt="Game7 Logo" />
                </Link>
                <div className="nav-linksToHide">
                    <Link to="/nfl" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">NFL</div>
                    </Link>
                    <Link to="/nba" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">NBA</div>
                    </Link>
                    <Link to="/mlb" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">MLB</div>
                    </Link>
                    <Link to="/mlr" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">MLR</div>
                    </Link>
                    <Link to="/fantasy" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">Fantasy</div>
                    </Link>
                    <Link to="/history" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">History</div>
                    </Link>
                    <Link to="/pickem" style={{textDecoration: 'none'}} className="nav-links-link">
                        <div className="nav-links-text">Pick 'Ems</div>
                    </Link>
                </div>
            </div>
            {/* TODO: replace default img with local img */}
            <div className="nav-icons">
                <AvatarOption onClick={() => setOpenMenu(!openMenu)} avatar={profileImg ? profileImg : DefaultProfImg} className="nav-avatar" />
            </div>

            <div className="menuIcon-cont">
                <MenuIcon className="menuIcon" onClick={showSidebar} />
            </div>

            <div className={sidebar ? "sidebar active" : "sidebar"}>
                <ul className="sidebar-items" onClick={showSidebar}>
                    <li className="sidebar-toggle">
                        <Link to="#" className="sidebar-close">
                            <CloseIcon className="sidebar-close-icon" />
                        </Link>
                    </li>
                    {user ? (
                        <li className='sidebar-text'>
                            <Link to={"/profile/" + user.uid}
                                key={user.uid}
                                className="sidebar-profile"
                                style={{textDecoration: 'none'}}>
                                <img className="sidebar-profile-img"
                                    src={profileData?.url ? profileData?.url : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'}
                                    alt='tempALT'
                                    style={{
                                        objectFit: 'cover'
                                    }}
                                />
                                <p className='sidebar-profile-name'>
                                    My Profile
                                </p>
                            </Link>
                        </li>
                    ) : (
                        void 0
                    )}
                    {user ? <hr className="solid" /> : void 0}
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                    <hr className="solid" />

                    {user ? (
                        <div onClick={logoutOfApp}
                            className="sidebar-auth sidebar-logout">
                            <LogoutIcon className="sidebar-auth-icon" />
                            <span>Logout</span>
                        </div>
                    ) : (
                        <Link to="/landing" className="landingLink">
                            <div
                                className="sidebar-auth sidebar-login">
                                <LoginIcon className="sidebar-auth-icon" />
                                <span>Login</span>
                            </div>
                        </Link>
                    )}

                </ul>
            </div>

            {openMenu &&
                <Menu />
            }
        </div>
    );
}

export default Nav;