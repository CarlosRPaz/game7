import React from 'react'
import './styles/Footer.css';
import { Link } from "react-router-dom";
import Logo from './../../img/logo.png';

function Footer() {
    return (
        <div className="footer">
            <div className="footer-cont">
                <div className="footer-companyCol">
                    <Link to="/" className="footer-logo-cont">
                        <img className="footer-logo" src={Logo} alt="Game7 Logo" />
                        Game7
                    </Link>
                    <p>The premier college sports and recruiting digital media company.</p>
                </div>
                <div className="footer-linksColCont">
                    <div className="footer-linksCol">
                        <div className="footer-label">Resources</div>
                        <ul>
                            <li>Help Center</li>
                            <li>Partners</li>
                            <li>Suggestions</li>
                            <li>Help Center</li>
                        </ul>
                    </div>
                    <div className="footer-linksCol">
                        <div className="footer-label">Legal</div>
                        <ul>
                            <li>Help Center</li>
                            <li>Partners</li>
                            <li>Help Center</li>
                        </ul>
                    </div>
                    <div className="footer-linksCol">
                        <div className="footer-label">About Us</div>
                        <ul>
                            <li>About Game7</li>
                            <li>Contact</li>
                            <li>Community</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-newsletterCol">
                    <div className="footer-label">Subscribe to our newsletter</div>
                    <div className="footer-newsletterCont">
                        <input
                            type="email"
                            className="footer-input"
                            placeholder="Email"
                        />
                        <button
                            type="submit"
                            className="footer-subscribeBtn"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="footer-legal">All Rights Reserved 2021 - Game7</div>
        </div>
    )
}

export default Footer
