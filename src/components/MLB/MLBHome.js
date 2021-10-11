import React, { useState, useEffect } from "react";
import "./styles/MLBHome.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";

import sanityClient from '../../client.js';

function MLBHome() {

    const [featuredArticlesData, setFeaturedArticlesData] = useState(null);
    const [headerArticleData, setHeaderArticleData] = useState(null);
    const [recentArticleData, setRecentArticleData] = useState(null);

    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && subfeaturedcategory == true && 'MLB' in categories[]->title] | order(publishedAt desc) {
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

    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedcategory == true && 'MLB' in categories[]->title]{
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
    // *** Recent MLB Articles minus mainfeaturedcategory && subfeaturedcategory *****************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedcategory == false && subfeaturedcategory == false && 'MLB' in categories[]->title]{
                title,
                slug,
                author,
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
        <div className="mlbHome" id="content-wrap">
            <div className="mlbHome-cont">
                <div className="mlbHome-left">left</div>
                <div className="mlbHome-middle">
                    <HeaderArticle headerArticleData={headerArticleData} />

                    <FeaturedArticlesCont featuredArticlesData={featuredArticlesData} />

                    <RecentArticles articleData={recentArticleData} />
                </div>
                <div className="mlbHome-right">right</div>
            </div>
        </div>
    );
}

export default MLBHome;