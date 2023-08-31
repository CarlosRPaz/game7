import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import BookIcon from "@material-ui/icons/Book";
import PersonIcon from "@material-ui/icons/Person";
import HelpIcon from "@material-ui/icons/Help";
import MailIcon from "@material-ui/icons/Mail";

import FootballIcon from '@material-ui/icons/SportsFootball';
import BasketballIcon from '@material-ui/icons/SportsBasketball';
import BaseballIcon from '@material-ui/icons/SportsBaseball';
import RugbyIcon from '@material-ui/icons/SportsRugby';

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <HomeIcon className="sidebar-icon" />,
        cName: "sidebar-text"
    },
    {
        title: "NFL",
        path: "/nfl",
        icon: <FootballIcon className="sidebar-icon" />,
        cName: "sidebar-text"
    },
    {
        title: "NBA",
        path: "/nba",
        icon: <BasketballIcon className="sidebar-icon" />,
        cName: "sidebar-text"
    },
    {
        title: "MLB",
        path: "/mlb",
        icon: <BaseballIcon className="sidebar-icon" />,
        cName: "sidebar-text"
    },
    {
        title: "MLR",
        path: "/mlr",
        icon: <RugbyIcon className="sidebar-icon" />,
        cName: "sidebar-text"
    },
];
