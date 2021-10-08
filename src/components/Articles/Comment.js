import React, { useEffect, useState, useContext } from 'react';
import './styles/Comment.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { db } from '../../firebase';
import firebase from 'firebase';
import uniqid from 'uniqid';
import moment from 'moment';
import ReplyIcon from '@material-ui/icons/Reply';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import IconButton from '@mui/material/IconButton';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Comment({ firestoreId, name, userId, message, photoUrl, commentId, timestamp, likeCount, numReplies, replyToId }) {
    const user = useSelector(selectUser);                       // Bring in logged-in user data through redux

    const [replyInput, setReplyInput] = useState(false);        // boolean: dropdown for reply input to display or not
    const [input, setInput] = useState('');                     // holds value of reply input TO this comment
    const [dropdown, setDropdown] = useState(false);            // boolean: dropdown for subcomments to display or not

    const [subComments, setSubComments] = useState([]);         // array of comments replying to this comment
    const [toggleLiked, setToggleLiked] = useState(false);      // boolean: has comment been liked? used to style the button red. Default: false... probably important
    const [currentLikes, setCurrentLikes] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // USEEFFECT ONE: runs once at load. Check if this specific comment haven been liked by the user already. if it has, set toggleLiked to true
    useEffect(() => {
        var docRef = db.collection("likes").doc(`${commentId}_${userId}`);      // Access collection "likes", with the document <commentId>_<userId>
        docRef.get().then((doc) => {                                            // get doc
            if (doc.exists) {                                                   // if doc exists
                setToggleLiked(true);                                           // set toggleLiked to TRUE
                console.log("This Like Exists");                                // print doc in console
            } else {                                                            // else
                setToggleLiked(false);
                console.log("This LIKE DNE");                                   // print "no such doc"
            }
        }).catch((error) => {                                                   // error ? print error
            console.log("Error getting document:", error);
        });
        console.log('<-- useEffect1 ran -->');
    }, []);

    /*
        // USEEFFECT TWO: runs once on load, BUT snapshot runs on every change
        useEffect(() => {
            let unsubscribe = db.collection("comments")                             // access "comments" collection
                .where("replyToId", "==", commentId)                                // that are replying to THIS comment
                .onSnapshot((snapshot) =>                                           // ON EVERY CHANGE IN COMMENTS REPLYING TO THIS COMMENT 
                    setSubComments(                                                 // set them into subComments array 
                        snapshot.docs.map((doc) => ({                               // set...
                            id: doc.id,
                            data: doc.data(),
                        }))
                    ));
            console.log('<-- useEffect2 ran -->');
            return unsubscribe;
        }, []);
    */
    useEffect(() => {
        async function loadSubComments() {
            const queriedSubCommentsRef = db.collection("comments");
            const snapshot = await queriedSubCommentsRef.where("replyToId", "==", firestoreId).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            setSubComments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        }
        loadSubComments();

        setCurrentLikes(likeCount);

        console.log('<-- useEffect2 ran -->');
    }, []);


    async function loadSubCommentsAfterSend() {
        const queriedSubCommentsRef = db.collection("comments");
        const snapshot = await queriedSubCommentsRef.where("replyToId", "==", firestoreId).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        setSubComments(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }))
        );
    }

    //reload SubComments
    useEffect(() => {
        db.collection("comments")
            .where("replyToId", "==", firestoreId)
            .onSnapshot((snapshot) =>
                setSubComments(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            )
    }, []);

    // Variables for handleToggleLiked()
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);
    const commentRef = db.collection('comments').doc(firestoreId);          // reference to this comment in firebase 

    // run this function when THIS comment is liked. idk async/await
    const handleToggleLike = () => {
        commentRef.update({ likeCount: increment });                    // increment likeCount
        db.collection('likes').doc(`${commentId}_${userId}`).set({      // create like on this comment in database
            commentId: commentId,
            userId: userId,
        });
        setCurrentLikes(currentLikes + 1);
        setToggleLiked(!toggleLiked);
        console.log('toggleLiked is now', true);
    }
    const handleToggleDislike = () => {
        commentRef.update({ likeCount: decrement });                    // decrement likeCount
        db.collection('likes').doc(`${commentId}_${userId}`).delete();  // delete this like on this comment from database
        setCurrentLikes(currentLikes - 1);
        setToggleLiked(!toggleLiked);
        console.log('toggleLiked is now ', false);
    }








    // run function on replying to this comment
    const sendComment = async (e) => {
        e.preventDefault();                                                     // don't refresh page

        let genID = uniqid();                                                   // generate random id

        await db.collection('comments').add({                                   // access "comments" collection
            name: user.displayName,                                             // add all this data as a comment
            userId: user.uid,
            commentId: genID,
            message: input,
            photoUrl: user.photoUrl || '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            replyToId: firestoreId,
            likeCount: 0,
            numReplies: 0,
        });

        // numReplies++ for the comment that it's replying to
        await db.collection('comments').doc(firestoreId).update({ numReplies: increment });

        await loadSubCommentsAfterSend();
        setDropdown(true);
        setReplyInput(!replyInput)

        setInput("");                                                           // clear input field for a new message
    }
    // run function on replying to this comment
    const deleteComment = async (e) => {
        e.preventDefault();
        handleClose();

        // numReplies-- for the comment that it's replying to
        await db.collection('comments').doc(replyToId).update({ numReplies: decrement });

        await db.collection('comments').doc(firestoreId).delete();
        await db.collection('comments').where("replyToId", "==", firestoreId).delete();
    }




    // when dropdown == true, show/run this component. Map out comments replying to this comment as comment component
    function DropdownComments() {
        return (
            <div className="dropdownComments">
                {subComments.map(({ id, data: { firestoreId, name, userId, message, photoUrl, commentId, timestamp, likeCount, numReplies, replyToId } }) => (
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
                        replyToId={replyToId}
                    />
                ))}
            </div>
        )
    }

    return (
        <article className="comment">
            <div className="comment-info">
                <img src={photoUrl} alt="" className="comment-info-photo mr06em" />
                <div className="comment-info-text">
                    <p className="comment-info-name">{name}</p>
                    <p className="comment-info-date">{timestamp ? moment(timestamp.toDate()).fromNow() : 'loading...'}</p>
                </div>
                <div className="comment-info-vertIconCont">
                    <IconButton
                        id="long-button"
                        aria-controls="demo-positioned-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        disableRipple
                    >
                        <MoreVertIcon className="comment-info-vertIconCont-icon" />
                    </IconButton>
                </div>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="long-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                >
                    <MenuItem onClick={deleteComment} disableRipple>Delete Comment</MenuItem>
                </Menu>
            </div>
            <p className="comment-message">{message}</p>
            <div className="comment-controls">
                {toggleLiked
                    ? <ThumbUpAltIcon
                        onClick={() => handleToggleDislike()}
                        className="comment-controls-icon like liked"
                    />
                    : <ThumbUpAltIcon
                        onClick={() => handleToggleLike()}
                        className='comment-controls-icon like'
                    />
                }
                {currentLikes != 0 &&
                    <p className="comment-controls-statNum">{currentLikes}</p>
                }

                <ReplyIcon
                    onClick={() => setReplyInput(!replyInput)} className="comment-controls-icon reply"
                />
                <CommentIcon
                    onClick={() => setDropdown(!dropdown)} className={`comment-controls-icon arrow ${numReplies === 0 ? 'm0' : null}`}
                />
                {numReplies != 0 &&
                    <p className="comment-controls-statNum">{numReplies}</p>
                }
            </div>
            {replyInput &&
                <form>
                    <div>
                        <div className="comment-info-photoCont">
                            <img
                                src={user ? user.photoUrl : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'}
                                alt=""
                                className="comment-info-photo"
                            />
                        </div>
                        <input
                            className="comment-info-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            type="text"
                            placeholder={!user ? "You must be logged in to comment..." : "Comment..."}
                        />
                    </div>
                    <button
                        onClick={sendComment}
                        type="submit"
                        className="comment-submitBtn"
                        disabled={!input}>Send</button>
                </form>
            }
            {dropdown && <DropdownComments />}
        </article>
    )
}

export default Comment
