import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {login} from '../../features/userSlice';
import {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from '../../firebase';
import './styles/Login.css';
import Logo from '../../img/logo.png';
import {useHistory} from 'react-router-dom';

function Login({toggleSwitch}) {

    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const loginToApp = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
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
        history.replace("/");
    };
    const demoLogin = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, 'crpaz@asu.edu', 'testPassword')
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
        history.replace("/");
    };

    const sendResetPasswordEmail = () => {
        if(!email) {
            return alert('Please enter your email address!');
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert(`Password-reset email sent to ${email}`)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(error);
                console.log(errorCode);
                console.log(errorMessage);
            });
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

                    <button type='submit' value="Submit" onClick={loginToApp}>Sign In</button>
                    {/*<button onClick={demoLogin} className="demoBtn">Demo Login</button>*/}
                    <p>
                        <span className='login__register' onClick={sendResetPasswordEmail}>Forgot Password</span>
                    </p>
                </form>
                <p>Not a member?{' '}
                    <span className='login__register' onClick={toggleSwitch}>Register</span>
                </p>
            </>
        </div>
    )
}

export default Login
