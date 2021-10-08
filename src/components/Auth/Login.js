import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { login } from '../../features/userSlice';
import { auth, db } from '../../firebase';
import './styles/Login.css';
import Logo from '../../img/logo.png';

function Login({ hideModal }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [loginBool, setLoginBool] = useState(true);
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

        hideModal();
    };
    const demoLogin = (e) => {
        e.preventDefault();

        auth
            .signInWithEmailAndPassword('crpaz@asu.edu', 'oakley44')
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

        hideModal();
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
            <img
                src={Logo}
                alt=""
            />

            {loginBool ? (
                <>
                    <form>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} placeholder='Email'
                            type="email"
                            required
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} placeholder='Password'
                            type="password"
                            required
                        />

                        <button type='submit' onClick={loginToApp}>Sign In</button>
                        <button type='submit' onClick={demoLogin} className="demoBtn">Demo Login</button>
                    </form>
                    <p>Not a member?{' '}
                        <span className='login__register' onClick={() => setLoginBool(!loginBool)}>Register</span>
                    </p>
                </>
            ) : (
                    <>
                        <form>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Username'
                                type="text"
                                required
                            />
                            <input
                                value={profilePic}
                                onChange={(e) => setProfilePic(e.target.value)} placeholder='Profile Pic URL (Opt)'
                                type="text"
                            />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} placeholder='Email'
                                type="email"
                                required
                            />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} placeholder='Password'
                                type="password"
                                required
                            />

                            <button type='submit' onClick={register}>Register</button>
                        </form>
                        <p>Already have an account?{' '}
                            <span className='login__register' onClick={() => setLoginBool(!loginBool)}>Sign In</span>
                        </p>
                    </>
                )
            }
        </div>
    )
}

export default Login
