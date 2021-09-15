import React, { useState, useEffect } from "react";
import "./styles/NFLHome.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";

import sanityClient from '../../client.js';

function NFLHome() {

    const [featuredArticlesData, setFeaturedArticlesData] = useState(null);
    const [headerArticleData, setHeaderArticleData] = useState(null);
    const [recentArticleData, setRecentArticleData] = useState(null);

    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && subfeaturedcategory == true && 'NFL' in categories[]->title] | order(publishedAt desc) {
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
            .fetch(`*[_type == "article" && mainfeaturedcategory == true && 'NFL' in categories[]->title]{
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
    // *** Recent NFL Articles minus mainfeaturedcategory && subfeaturedcategory *****************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedcategory == false && subfeaturedcategory == false && 'NFL' in categories[]->title]{
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
        <div className="nflHome">
            <div className="nflHome-cont">
                <div className="nflHome-left">left</div>
                <div className="nflHome-middle">
                    <HeaderArticle headerArticleData={headerArticleData} />

                    <FeaturedArticlesCont featuredArticlesData={featuredArticlesData} />

                    <RecentArticles articleData={recentArticleData} />
                </div>
                <div className="nflHome-right">right</div>
            </div>
        </div>
    );
}

export default NFLHome;