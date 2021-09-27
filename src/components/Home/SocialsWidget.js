import React, { useState, useEffect } from 'react'
import './styles/SocialsWidget.css'

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import PinterestIcon from '@material-ui/icons/Pinterest';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

import sanityClient from '../../client.js';

function SocialsWidget() {

    const [socialsData, setSocialsData] = useState(null);

    // ***********************************************************************************
    // *** Main-Featured All Articles ****************************************************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "socials"]{
                title,
                showFacebook,
                showInstagram,
                showLinkedIn,
                showPinterest,
                showTwitter,
                showYoutube,
                facebookLink,
                instagramLink,
                linkedInLink,
                twitterLink,
                youtubeLink,
            }`)
            .then((data) => setSocialsData(data[0]))
            .catch(console.error);
    }, []);

    if (!socialsData) {
        return 'Loading...'
    }

    return (
        <div className="socialsWidget">
            <p>{socialsData.title}</p>
            <div className="socialsWidget-body">
                {socialsData.showFacebook ? (
                    <div className="socialsWidget-link">
                        <FacebookIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.facebookLink} className='socialsWidget-link-textLink'>Facebook</a>
                    </div>
                ) : void 0}
                {socialsData.showInstagram ? (
                    <div className="socialsWidget-link">
                        <InstagramIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.instagramLink} className='socialsWidget-link-textLink'>Instagram</a>
                    </div>
                ) : void 0}
                {socialsData.showLinkedIn ? (
                    <div className="socialsWidget-link">
                        <LinkedInIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.linkedInLink} className='socialsWidget-link-textLink'>LinkedIn</a>
                    </div>
                ) : void 0}
                {socialsData.showPinterest ? (
                    <div className="socialsWidget-link">
                        <PinterestIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.pinterestLink} className='socialsWidget-link-textLink'>Pinterest</a>
                    </div>
                ) : void 0}
                {socialsData.showTwitter ? (
                    <div className="socialsWidget-link">
                        <TwitterIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.twitterLink} className='socialsWidget-link-textLink'>Twitter</a>
                    </div>
                ) : void 0}
                {socialsData.showYouTube ? (
                    <div className="socialsWidget-link">
                        <YouTubeIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.youtubeLink} className='socialsWidget-link-textLink'>YouTube</a>
                    </div>
                ) : void 0}
            </div>
        </div>
    )
}

export default SocialsWidget
