import React, { useState, useEffect } from 'react';
import './styles/CommentSection.css';
import Comment from './Comment';

import { db } from '../../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import uniqid from 'uniqid';
import { Input, TextField, Button } from '@material-ui/core';
import LogoGray from './../../img/logogray.png';

function CommentSection({ currentArticleId }) {
    const user = useSelector(selectUser);
    const [input, setInput] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        db.collection("comments")
            .where("articleId", "==", currentArticleId)
            .onSnapshot((snapshot) =>
                setComments(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            )
    }, []);


    const sendComment = async (e) => {
        e.preventDefault();

        let genID = uniqid();

        await db.collection('comments').add({
            name: user.displayName,
            userId: user.uid,
            message: input,
            likeCount: 0,
            photoUrl: user.photoUrl || '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            articleId: currentArticleId,
            commentId: genID,
            numReplies: 0,
        });

        setInput("");
    }

    return (
        <section className='commentSection'>
            <div className="commentSection-header">
                <h3>Comment Section</h3>
                <div>
                    <img src={user ? user.photoUrl : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'} alt="" className="commentSection-header-img" />
                    <form noValidate autoComplete="off" className="commentSection-header-form">
                        <input
                            type="text"
                            className="commentSection-header-input"
                            placeholder={!user ? "You must be logged in to comment..." : "Comment..."}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={!user}
                            required
                        />
                        <button
                            onClick={sendComment}
                            type="submit"
                            className="commentSection-header-sendBtn"
                            disabled={!input}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>


            {comments.length > 0 ? void 0 : (
                <div className="commentSection-blank">
                    <h2>There are currently no comments</h2>
                    <h4>Be the first to comment!</h4>
                    <img src={LogoGray} alt="" className="commentSection-blank-img" />
                </div>
            )}
            {
                comments.map(({ id, data: { name, userId, message, photoUrl, commentId, timestamp, likeCount, numReplies } }) => (
                    <Comment
                        key={id}
                        firestoreId={id}
                        name={name}
                        userId={userId}
                        message={message}
                        photoUrl={photoUrl}
                        commentId={commentId}
                        timestamp={timestamp}
                        likeCount={likeCount}
                        numReplies={numReplies}
                    />
                ))
            }
        </section >
    )
}

export default CommentSection
