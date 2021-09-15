import React, { useState, useEffect } from 'react';
import './styles/CommentSection.css';
import Comment from './Comment';

import { db } from '../../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import uniqid from 'uniqid';
import { Input, TextField, Button } from '@material-ui/core';

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
        });

        setInput("");
    }

    return (
        <section className='commentSection'>
            <div className="commentSection-header">
                <h3>Comment Section</h3>
                <div>
                    <img src={user.photoUrl} alt="" className="commentSection-header-img" />
                    <form noValidate autoComplete="off" className="commentSection-header-form">
                        <TextField
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            id="filled-secondary"
                            label="Write your comment..."
                            variant="filled"
                            color="primary"
                            className="commentSection-header-textfield"
                        />
                        <button
                            onClick={sendComment}
                            type="submit"
                            className="commentSection-header-sendBtn"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {comments.map(({ id, data: { name, userId, message, photoUrl, commentId, timestamp, likeCount } }) => (
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
                />
            ))}
        </section>
    )
}

export default CommentSection
