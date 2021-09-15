import React, { useState, useEffect } from 'react';
import './styles/ProfilePage.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { db } from '../../firebase';

function ProfilePage() {
    const user = useSelector(selectUser);

    const [profileComments, setProfileComments] = useState([]);

    useEffect(() => {
        db.collection("comments").where("userId", "==", user.uid).onSnapshot((snapshot) =>
            setProfileComments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            ))
    }, []);

    return (
        <div className="profilePage">
            <div className="profilePage-header">
                <img src={user.photoUrl} alt="" className="profilePage-header-img" />
                <p className="profilePage-header-name">{user.displayName}</p>
                <p className="profilePage-header-email">{user.email}</p>

                <div className="profilePage-header-stats">
                    <div>
                        <label>Comments</label>
                        <span>832</span>
                    </div>
                    <div>
                        <label>Likes</label>
                        <span>98723</span>
                    </div>
                    <div>
                        <label>Reputation</label>
                        <span>119</span>
                    </div>
                </div>
            </div>

            <div className="profilePage-comments">
                <div className="profilePage-comments-panel">
                    filter by recent, popular
                </div>
                {profileComments.map(({ id, data: { message } }) => (
                    <p key={id}>{message}</p>
                ))}
            </div>
        </div>
    )
}

export default ProfilePage
