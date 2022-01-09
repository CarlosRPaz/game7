import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {login} from '../../features/userSlice';
import './styles/Login.css';

import Logo from '../../img/logo.png';


import {
    auth,
    db,
    createUserWithEmailAndPassword,
    setDoc,
    doc,
    updateProfile,
} from '../../firebase';
import {useHistory} from 'react-router-dom';

function Register({toggleSwitch}) {
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");

    const dispatch = useDispatch();

    const register = (e) => {
        e.preventDefault();

        if(!name) {
            return alert('Please enter your full name!');
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userAuth) => { // if successful, then do:
                updateProfile(userAuth.user, {
                    displayName: name,
                    photoURL: profilePic,
                }).then(() => {
                    dispatch(
                        login({
                            email: userAuth.user.email,
                            uid: userAuth.user.uid,
                            displayName: name,
                            photoUrl: profilePic,
                        })
                    );
                });
                setDoc(doc(db, 'users', userAuth.user.uid), {
                    userId: `${userAuth.user.uid}`,
                    userName: `${userAuth.user.displayName}`,
                    email: `${userAuth.user.email}`,
                    photoUrl: `${userAuth.user.photoUrl}`,
                    bio: 'Bio has not been set yet.',
                    role: 'Rookie',
                    comments: 0,
                    likes: 0,
                    rep: 0,
                });
            })
            .catch((error) => alert(error));
        history.replace("/");
    };

    return (
        <div className="login">
            <img
                src={Logo}
                alt=""
            />

            <>
                <form>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Username'
                        type="text"
                        name="name"
                        required
                    />
                    <input
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)} placeholder='Profile Pic URL (Opt)'
                        type="text"
                        name="profilePic"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} placeholder='Email'
                        type="email"
                        name="email"
                        required
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} placeholder='Password'
                        type="password"
                        name="password"
                        required
                    />

                    <button type='submit' value="Submit" onClick={register}>Register</button>
                </form>
                <p>Already have an account?{' '}
                    <span className='login__register' onClick={toggleSwitch}>Sign In</span>
                </p>
            </>
        </div>
    )
}

export default Register
