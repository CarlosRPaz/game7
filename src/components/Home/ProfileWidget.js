import React from 'react';
import './styles/ProfileWidget.css';
import { selectUser } from "./../../features/userSlice";
import { useSelector } from 'react-redux';

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';

function ProfileWidget() {
    const user = useSelector(selectUser);

    return (
        <div className="profileWidget">
            <img
                src={user.photoUrl}
                alt=""
                className="profileWidget-img"
            />
            <div className="profileWidget-info">
                <div className="profileWidget-info-top">
                    <p className="profileWidget-info-role">V</p>
                    <p className="profileWidget-info-name">{user.displayName}</p>
                </div>
                <div className="profileWidget-info-stats">
                    <div className="profileWidget-info-stat">
                        <ChatBubbleOutlineIcon className="profileWidget-info-stat-icon" />
                        <p className="profileWidget-info-stat-num">83</p>
                    </div>
                    <div className="profileWidget-info-stat">
                        <ThumbUpAltOutlinedIcon className="profileWidget-info-stat-icon" />
                        <p className="profileWidget-info-stat-num">217</p>
                    </div>
                    <div className="profileWidget-info-stat">
                        <LocalActivityIcon className="profileWidget-info-stat-icon" />
                        <p className="profileWidget-info-stat-num">24</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileWidget
