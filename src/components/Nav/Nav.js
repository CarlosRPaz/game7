import React, { useState } from "react";
import "./styles/Nav.css";

import { Link } from "react-router-dom";
import './styles/Nav.css';
import Logo from './../../img/logo.png';
import AvatarOption from "./AvatarOption";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { logout, selectUser } from "../../features/userSlice";

import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem, Button, Menu } from "@material-ui/core";

import { makeStyles, withStyles } from '@material-ui/core/styles';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloseIcon from "@material-ui/icons/Close";

import { SidebarData } from "./SidebarData";

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


function Nav() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [sidebar, setSidebar] = useState(false);

    const classes = useStyles();

    const showSidebar = () => setSidebar(!sidebar);


    const logoutOfApp = () => {
        dispatch(logout());
        auth.signOut();
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    function Menu() {
        return (
            <div className="menu">
                <ul>
                    <li>
                        <Link to={"/profile/" + user.uid}
                            key={user.uid}
                            className="menu-link"
                            style={{ textDecoration: 'none' }}>
                            <img className="menu-profileIMG"
                                src={user.photoUrl}
                                alt='tempALT'
                                style={{
                                    objectFit: 'cover'
                                }}
                            />
                            My Profile
                        </Link>
                    </li>
                    <hr class="solid" />
                    <li>
                        <div onClick={logoutOfApp}
                            className="menu-logout">
                            <ExitToAppIcon className="menu-logout-icon" />
                            Logout
                        </div>
                    </li>
                </ul>
            </div>
        );
    }


    return (
        <div className="nav">
            <Link to="/" className="nav__logo-cont">
                <img className="nav__logo" src={Logo} alt="Lonely Wrld Logo" />
            </Link>

            <div className="nav-links">
                <Link to="/nfl" style={{ textDecoration: 'none' }}>
                    <div className="nav-links-link">NFL</div>
                </Link>
                <Link to="/nba" style={{ textDecoration: 'none' }}>
                    <div className="nav-links-link">NBA</div>
                </Link>
                <Link to="/mlb" style={{ textDecoration: 'none' }}>
                    <div className="nav-links-link">MLB</div>
                </Link>
                <Link to="/mlr" style={{ textDecoration: 'none' }}>
                    <div className="nav-links-link">MLR</div>
                </Link>
                <AvatarOption onClick={() => setOpenMenu(!openMenu)} avatar={user.photoUrl} className="nav-avatar" />
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
                    <li className='sidebar-text'>
                        <Link to={"/profile/" + user.uid}
                            key={user.uid}
                            className="sidebar-profile"
                            style={{ textDecoration: 'none' }}>
                            <img className="sidebar-profile-img"
                                src={user.photoUrl}
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
                    <hr class="solid" />
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
                </ul>
            </div>


            {openMenu &&
                <Menu />
            }
        </div>
    );
}

export default Nav;