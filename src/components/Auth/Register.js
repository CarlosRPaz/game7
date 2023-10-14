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
import {useNavigate} from 'react-router-dom';

function Register({toggleSwitch}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const dispatch = useDispatch();

    const register = (e) => {
        e.preventDefault();

        if(!username) {
            return alert('Please enter your a username!');
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userAuth) => { // if successful, then do:
                updateProfile(userAuth.user, {
                    displayName: username,
                }).then(() => {
                    dispatch(
                        login({
                            email: userAuth.user.email,
                            uid: userAuth.user.uid,
                            displayName: username,
                        })
                    );
                });
                setDoc(doc(db, 'users', userAuth.user.uid), {
                    userId: `${userAuth.user.uid}`,
                    userName: username,
                    email: `${userAuth.user.email}`,
                    bio: 'Bio has not been set yet.',
                    role: 'Rookie',
                    comments: 0,
                    likes: 0,
                    rep: 0,
                });
            })
            .catch((error) => alert(error));
        navigate("/");
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        type="text"
                        name="username"
                        required
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
