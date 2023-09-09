import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";
import MailIcon from "@mui/icons-material/Mail";

import FootballIcon from '@mui/icons-material/SportsFootball';
import BasketballIcon from '@mui/icons-material/SportsBasketball';
import BaseballIcon from '@mui/icons-material/SportsBaseball';
import RugbyIcon from '@mui/icons-material/SportsRugby';

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
