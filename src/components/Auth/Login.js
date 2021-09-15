import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { login } from '../../features/userSlice';
import { auth, db } from '../../firebase';
import './styles/Login.css'

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const dispatch = useDispatch();

    const loginToApp = (e) => {
        e.preventDefault();

        auth
            .signInWithEmailAndPassword(email, password)
            .then((userAuth) => {
                dispatch(
                    login({
                        email: userAuth.user.email,
                        uid: userAuth.user.uid,
                        displayName: userAuth.user.displayName,
                        profileUrl: userAuth.user.photoURL,
                    })
                );
            })
            .catch((error) => alert(error));
    };

    const register = () => {
        if (!name) {
            return alert('Please enter your full name!');
        }

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((userAuth) => { // if successful, then do:
                return db.collection('users').doc(userAuth.user.uid).set({
                    userId: `${userAuth.user.uid}`,
                    userName: `${userAuth.user.displayName}`,
                    email: `${userAuth.user.email}`,
                    photoUrl: `${userAuth.user.photoUrl}`,
                    /*bio: 'Bio has not been set yet.',*/
                    role: 'Rookie',
                    comments: 0,
                    likes: 0,
                    rep: 0,
                });
                userAuth.user
                    .updateProfile({
                        displayName: name,
                        photoURL: profilePic,
                    })
                    .then(() => {
                        dispatch(
                            login({
                                email: userAuth.user.email,
                                uid: userAuth.user.uid,
                                displayName: name,
                                photoUrl: profilePic,
                            })
                        );
                    })
            })
            .catch((error) => alert(error));
    };

    return (
        <div className="login">
            <form>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Full name (required if registering)'
                    type="text"
                />

                <input
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)} placeholder='Profile pic URL (optional)'
                    type="text"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder='Email'
                    type="email"
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder='Password'
                    type="password"
                />

                <button type='submit' onClick={loginToApp}>Sign In</button>
            </form>

            <p>Not a member?{' '}
                <span className='login__register' onClick={register}>Register Now</span>
            </p>
        </div>
    )
}

export default Login
