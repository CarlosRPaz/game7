import React, {useState, useEffect} from 'react';
import './styles/ProfilePage.css';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/userSlice';
import {
    db,
    onSnapshot,
    query,
    collection,
    where,
    doc,
    updateDoc,
    storage,
    getDoc,
    getDocs,
} from '../../firebase';
import {ref, uploadBytes, getDownloadURL, getStorage, getMetadata} from "firebase/storage";
import {useParams} from "react-router-dom";

import moment from 'moment';
import {v4 as uuidv4} from 'uuid';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';



function ProfilePage() {
    const user = useSelector(selectUser);

    const [currentProfile, setCurrentProfile] = useState(null);
    //const [userProfileRef, setUserProfileRef] = useState();
    const {id} = useParams();
    const [open, setOpen] = useState(false);

    const [profileComments, setProfileComments] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [page, setPage] = useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [imgRef, setImgRef] = useState(null);

    // Get current comments
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentComments = profileComments.slice(indexOfFirstPost, indexOfLastPost);
    const totalCount = Math.ceil(profileComments.length / postsPerPage);

    // State console logging
    //if(!user) {<h1>Loading...</h1>}
    //if(user) {console.log("user", user);}
    //if(currentProfile) {console.log("currentProfile", currentProfile);}
    //console.log("EditProfileModal open? >>>>>", open);

    // Checking Re-render
    console.log('Re-render ProfilePage');

    // Load user's data from database
    useEffect(() => {
        const getUserProfileData = async () => {
            // get query ref for a user with a certain id
            const q = query(collection(db, "users"), where("userId", "==", id));

            /* new code
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots 
                console.log(doc.id, " => ", doc.data());
                setCurrentProfile(doc.data());

                console.log("getUserProfileData ran")
            });
            */

            // old snapshot code
            // get snapshot of user profile and set to currentProfile
            onSnapshot(q, (snapshot) => {
                setCurrentProfile(
                    snapshot.docs.at(0).data()
                );
            },
                (error) => {
                    console.log("onSnapshot error: ", error);
                });


        }

        // id maybe loading slow?
        getUserProfileData();
        // ERROR HERE? userProfileRef undefined when onSubmit runs
        // docRef = doc(db, "users", id);
        //setUserProfileRef(docRef);

        console.log("PP useEffect ran: load user's data");
    }, [id]);

    // Load all of the user's comments
    useEffect(() => {
        onSnapshot(query(collection(db, "comments"),
            where("userId", "==", id)), (snapshot) => {
                setProfileComments(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            });

        console.log("PP useEffect ran: load user's comments");
    }, [id]);

    useEffect(() => {
        if(currentProfile) {
            console.log("currentProfile.url: ", currentProfile.url);
            console.log('imgRef >> ', imgRef);

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if(imgRef) {
                // Get metadata properties
                getMetadata(imgRef)
                    .then((metadata) => {
                        // Metadata now contains the metadata for 'ref(storage, currentProfile.url)'
                        //setImageUpload(metadata.name);
                        console.log('metadata in getMetadata:', metadata);
                    })
                    .catch((error) => {
                        // Uh-oh, an error occurred!
                        console.log('getMetaData error:', error);
                    });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }

        console.log("PP useEffect ran: currentProfile updated if this loads more than once");
    }, [currentProfile, imgRef])

    useEffect(() => {
        if(currentProfile) {
            console.log("currentProfile", currentProfile);
            console.log("currentProfile.url", currentProfile.url);
            currentProfile && setImgRef(ref(storage, currentProfile.url));
        }

        console.log("PP useEffect ran: setImgRef, means currentProfile updated (1<)");
    }, [currentProfile])

    // Profile comment component
    function ProfileComment({message, likeCount, timestamp}) {
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

    // Edit Profile Modal
    function EditProfileModal(imgRef) {
        const [username, setUsername] = useState(`${currentProfile?.userName}`);
        const [bio, setBio] = useState(`${currentProfile?.bio}`);
        const [imageUpload, setImageUpload] = useState();

        //const [userProfileRef, setUserProfileRef] = useState();

        // Checking Re-render
        console.log('Re-render EditProfileModal');
        //console.log("userProfileRef", userProfileRef);

        useEffect(() => {
            if(imgRef) {
                setImageUpload(imgRef.path);
            }
        }, [imgRef]);

        const uploadFile = async (docRef) => {
            if(!imageUpload) return;
            console.log("imageUpload in UF:", imageUpload);

            // Use uuid for img naming
            const path = `images/${uuidv4()}.jpg`;         // TODO: MAYBE MOVE THIS STATE UP A LEVEL TO USE IN retrieveImg func
            const imageRef = ref(storage, path);         /* (storage, `images/${uuidv4().jpg}`); */


            const metadata = {
                name: `${imageUpload.name}`
            }

            await uploadBytes(imageRef, imageUpload, metadata).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                console.log("imageUpload metadata >>>", metadata);


                // Save a reference to the file in Firestore DB
                updateDoc(docRef, {
                    url: path
                });

            });

            retrieveImg(docRef);

            // TODO: Delete old img in storage

            console.log("uploadFile fxn ran");

        }

        const retrieveImg = async (docRef) => {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const userSnap = docSnap.data();
                getDownloadURL(ref(storage, userSnap.url))
                    .then((url) => {
                        // `url` is the download URL for 'images/img1.jpg'
                        console.log('userSnap >>>>>>>', userSnap)
                        //TEST
                        updateDoc(docRef, {
                            url: url
                        });
                    })
                    .catch((error) => {
                        // Handle any errors
                        console.log(error);
                    });
            } else {
                console.log("No such document!");
            }

            console.log("retrieveImg fxn ran");
        }

        // Profile Edit onSubmit
        async function onSubmit(e) {
            e.preventDefault();
            console.log("id:", id);
            //console.log("userProfileRef:", userProfileRef);
            //console.log("userProfileRef path:", userProfileRef.path);

            const docRef = doc(db, "users", id);
            console.log("docRef", docRef);
            //setUserProfileRef(docRef);
            await updateDoc(docRef, {
                userName: username,
                bio: bio,
            });
            uploadFile(docRef);
            handleClose();
        }


        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update your profile information, make changes to the correct field and click the Update button to apply changes.
                    </DialogContentText>
                    <div className="form-container">
                        <form onSubmit={onSubmit} >
                            <label htmlFor="userProfileImg">Profile Picture</label>
                            <input type="file" onChange={(e) => {setImageUpload(e.target.files[0])}} />
                            <img id="myimg" src="" alt="" />
                            <label htmlFor="username">Username</label>
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Username"
                                type="name"
                                id="username"
                            />
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="Bio"
                                type="textarea"
                                id="bio"
                            />

                            <div className="form-container-btnContainer">
                                {/* type="button" should keep the Cancel button from submitting */}
                                <button type="button" className="form-container-btnContainer-cancelBtn" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="form-container-btnContainer-submitBtn">Submit</button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div className="profilePage">
            <div className="profilePage-header">
                <div className="profilePage-header-info">
                    <img src={currentProfile ? currentProfile.url : 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'}
                        alt=""
                        className="profilePage-header-img" />
                    <div className="profilePage-header-infoText">
                        <p className="profilePage-header-name">{currentProfile ? currentProfile.userName : 'Test Name'}</p>
                        {/*<p className="profilePage-header-email">{currentProfile ? currentProfile.email : 'Test Email'}</p>*/}
                        <p className="profilePage-header-email">{currentProfile ? currentProfile.role : 'Test Role'}</p>
                    </div>
                </div>

                <div className="profilePage-header-statsCont">
                    <h3>Profile Stats</h3>
                    <div className="profilePage-header-stats">
                        <div>
                            <span>{currentProfile ? currentProfile.comments : '##'}</span>
                            <label>Comments</label>
                        </div>
                        <div>
                            <span>{currentProfile ? currentProfile.likes : '##'}</span>
                            <label>Likes</label>
                        </div>
                        <div>
                            <span>{currentProfile ? currentProfile.rep : '##'}</span>
                            <label>Reputation</label>
                        </div>
                    </div>
                </div>
                <div className="profilePage-header-bio">{currentProfile && currentProfile.bio}</div>
                {user?.uid === id &&
                    <button onClick={handleClickOpen} className="profilePage-header-editProfileBtn">Edit Profile</button>
                }
            </div>


            <Stack spacing={2} className="profilePage-stack">
                <div className="profilePage-comments">
                    <div className="profilePage-comments-panel">
                        filter by recent, popular
                    </div>

                    {currentComments ? (
                        currentComments.map(({id, data: {message, likeCount, timestamp}}) => (
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
            <EditProfileModal imgRef={imgRef} /*userProfileRef={userProfileRef}*/ />
        </div>
    )
}

export default ProfilePage
