import React, {useState, useEffect} from 'react'
import './styles/SocialsWidget.css'

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

import {SvgIcon} from '@mui/material';


import {ReactComponent as DiscordSvg} from '../../img/discord-icon-svgrepo-com.svg';
import {ReactComponent as XSvg} from '../../img/X_logo_2023_original.svg';

import sanityClient from '../../client.js';

function SocialsWidget() {

    const [socialsData, setSocialsData] = useState(null);

    // ***********************************************************************************
    // *** Main-Featured All Articles ****************************************************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "socials"]{
                title,
                showInstagram,
                showX,
                showDiscord,
                showYoutube,
                instagramLink,
                xLink,
                discordLink,
                youtubeLink,
            }`)
            .then((data) => setSocialsData(data[0]))
            .catch(console.error);
    }, []);

    if(!socialsData) {
        return 'Loading...'
    }

    return (
        <div className="socialsWidget">
            <p>{socialsData.title}</p>
            <div className="socialsWidget-body">
                {socialsData.showInstagram ? (
                    <div className="socialsWidget-link">
                        <InstagramIcon className="socialsWidget-link-icon" />
                        <a href={socialsData.instagramLink} className='socialsWidget-link-textLink'>Instagram</a>
                    </div>
                ) : void 0}
                {socialsData.showX ? (
                    <div className="socialsWidget-link">
                        <SvgIcon component={XSvg} viewBox="0 0 280 340" className="socialsWidget-link-iconX" />
                        {/*<XSvg className="socialsWidget-link-iconX" height={26} width={26} viewBox="0 0 384 512" />*/}
                        {/*<TwitterIcon className="socialsWidget-link-icon" />*/}
                        <a href={socialsData.xLink} className='socialsWidget-link-textLink'>X</a>
                    </div>
                ) : void 0}
                {socialsData.showDiscord ? (
                    <div className="socialsWidget-link">
                        <DiscordSvg className="socialsWidget-link-iconDiscord" />
                        <a href={socialsData.discordLink} className='socialsWidget-link-textLink'>Discord</a>
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
