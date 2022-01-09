import React, {useState, useEffect} from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

import "./styles/Landing.css";

function Landing() {

    const [toggle, setToggle] = useState(true);

    const toggleSwitch = () => {
        setToggle(toggle => !toggle);
    }

    return (
        <div className="landing" id="content-wrap">
            {toggle ? <Login toggleSwitch={toggleSwitch} /> : <Register toggleSwitch={toggleSwitch} />}
        </div>
    );
}

export default Landing;