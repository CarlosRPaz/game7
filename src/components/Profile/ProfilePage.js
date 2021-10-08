import React, { useState, useEffect } from 'react';
import './styles/ProfilePage.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { db } from '../../firebase';

import moment from 'moment';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function ProfilePage() {
    const user = useSelector(selectUser);

    const [profileComments, setProfileComments] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [page, setPage] = useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        db.collection("comments").where("userId", "==", user.uid).onSnapshot((snapshot) =>
            setProfileComments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            ))
    }, []);

    function ProfileComment({ message, likeCount, timestamp }) {
        return (
            <div className="profileComment">
                <div className="profileComment-message">
                    {message}
                </div>
                <div className="profileComment-commentInfo">
                    <div className="profileComment-likeCount">
                        <span>{likeCount}</span> likes
                    </div>
                    <div className="profileComment-timestamp">
                        {moment(timestamp.toDate()).fromNow()}
                    </div>
                </div>
            </div>
        );
    }

    // Get current comments
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentComments = profileComments.slice(indexOfFirstPost, indexOfLastPost);
    const totalCount = Math.ceil(profileComments.length / postsPerPage);

    if (!user) { <h1>Loading...</h1> }

    return (
        <div className="profilePage">
            <div className="profilePage-header">
                <img src={user ? user.photoUrl : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'}
                    alt=""
                    className="profilePage-header-img" />
                <p className="profilePage-header-name">{user ? user.displayName : 'Test Name'}</p>
                <p className="profilePage-header-email">{user ? user.email : 'Test Email'}</p>

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


            <Stack spacing={1}>
                <div className="profilePage-comments">
                    <div className="profilePage-comments-panel">
                        filter by recent, popular
                    </div>

                    {currentComments ? (
                        currentComments.map(({ id, data: { message, likeCount, timestamp } }) => (
                            <ProfileComment
                                key={id}
                                message={message}
                                likeCount={likeCount}
                                timestamp={timestamp}
                            />

                        ))
                    ) : (
                            'Loading...'
                        )
                    }
                </div>

                <Pagination
                    className="home-pagination"
                    count={totalCount}
                    shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                />
            </Stack>
        </div>
    )
}

export default ProfilePage
