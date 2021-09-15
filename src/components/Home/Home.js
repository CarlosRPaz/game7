import React, { useState, useEffect } from "react";
import "./styles/Home.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";
import { Link } from "react-router-dom";

import sanityClient from '../../client.js';
import ProfileWidget from "./ProfileWidget";
import PollWidget from "./PollWidget";

function Home() {

    const [featuredArticlesData, setFeaturedArticlesData] = useState(null);
    const [headerArticleData, setHeaderArticleData] = useState(null);
    const [recentArticleData, setRecentArticleData] = useState(null);

    // ***********************************************************************************
    // *** Main-Featured All Articles ****************************************************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedhome == true]{
                title,
                slug,
                author,
                categories,
                hook,
                categories[]->{ title },
                mainImage{
                    asset->{
                        _id,
                        url
                    },
                    alt
                }
            }`)
            .then((data) => setHeaderArticleData(data[0]))
            .catch(console.error);
    }, []);

    // ***********************************************************************************
    // *** Sub-Featured All Articles *****************************************************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && subfeaturedhome == true]{
                title,
                slug,
                author->{name},
                hook,
                categories[]->{ title },
                mainImage{
                    asset->{
                        _id,
                        url
                    },
                    alt
                }
            }`)
            .then((data) => setFeaturedArticlesData(data))
            .catch(console.error);
    }, []);

    console.log('[]->{ title }', featuredArticlesData);

    // ***********************************************************************************
    // *** Recent All Articles minus mainfeaturedhome && subfeaturedhome *****************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedhome == false && subfeaturedhome == false] | order(publishedAt desc) {
                title,
                slug,
                author->{name},
                publishedAt,
                mainImage{
                    asset->{
                        _id,
                        url
                    },
                    alt
                }
            }`)
            .then((data) => setRecentArticleData(data))
            .catch(console.error);
    }, []);

    return (
        <div className="home">
            <div className="home-cont">
                <div className="home-left">
                    <ProfileWidget />
                </div>
                <div className="home-middle">
                    <HeaderArticle headerArticleData={headerArticleData} />

                    <FeaturedArticlesCont featuredArticlesData={featuredArticlesData} />

                    <RecentArticles articleData={recentArticleData} />
                </div>
                <div className="home-right">
                    <PollWidget />
                    Schedule?
                </div>
            </div>
        </div>
    );
}

export default Home;