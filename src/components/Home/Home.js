import React, { useState, useEffect } from "react";
import "./styles/Home.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";
import { Link } from "react-router-dom";

import sanityClient from '../../client.js';
import ProfileWidget from "./ProfileWidget";
import PollWidget from "./PollWidget";
import Article from "../Articles/Article";
import SocialsWidget from "./SocialsWidget";
import Pagination from "./Pagination";

function Home() {

    const [featuredArticlesData, setFeaturedArticlesData] = useState(null);
    const [headerArticleData, setHeaderArticleData] = useState(null);
    const [recentArticleData, setRecentArticleData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

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

    // ***********************************************************************************
    // *** Recent All Articles minus mainfeaturedhome && subfeaturedhome *****************
    useEffect(() => {
        setLoading(true);
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedhome == false && subfeaturedhome == false] | order(publishedAt desc) {
                title,
                slug,
                author->{name},
                publishedAt,
                summary,
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
        setLoading(false);
    }, []);

    // Get current articles
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = recentArticleData.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="home">
            <div className="home-cont">
                <div className="home-left">
                    {/*<ProfileWidget />*/}
                    <SocialsWidget />
                    {/* Advertisements */}
                </div>
                <div className="home-middle">
                    {headerArticleData &&
                        <Link to={"/article/" + headerArticleData.slug.current} key={headerArticleData.slug.current}>
                            <HeaderArticle headerArticleData={headerArticleData} />
                        </Link>
                    }

                    <FeaturedArticlesCont
                        featuredArticlesData={featuredArticlesData}
                        className="featuredArticlesCont"
                    />

                    <RecentArticles articleData={currentPosts} loading={loading} />
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={recentArticleData.length}
                        paginate={paginate}
                    />
                </div>
                <div className="home-right">
                    <PollWidget />
                    {/* Schedule */}
                </div>
            </div>
        </div>
    );
}

export default Home;