import React, { useState, useEffect } from "react";
import "./styles/MLBHome.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";
import { Link } from "react-router-dom";

import sanityClient from '../../client.js';
import SocialsWidget from "../Home/SocialsWidget";
import PollWidget from "../Home/PollWidget";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function MLBHome() {

    const [featuredArticlesData, setFeaturedArticlesData] = useState(null);
    const [headerArticleData, setHeaderArticleData] = useState(null);
    const [recentArticleData, setRecentArticleData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);

    const [page, setPage] = useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

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
    }, []);

    // Get current articles
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = recentArticleData.slice(indexOfFirstPost, indexOfLastPost);
    const totalCount = Math.ceil(recentArticleData.length / postsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="mlbHome" id="content-wrap">
            <div className="mlbHome-cont">
                <div className="mlbHome-left">
                    <SocialsWidget />
                </div>
                <div className="mlbHome-middle">
                    {headerArticleData &&
                        <Link to={"/article/" + headerArticleData.slug.current} key={headerArticleData.slug.current}>
                            <HeaderArticle headerArticleData={headerArticleData} />
                        </Link>
                    }

                    <FeaturedArticlesCont featuredArticlesData={featuredArticlesData} className="featuredArticlesCont" />

                    <Stack spacing={1}>
                        <RecentArticles articleData={currentPosts} loading={loading} />
                        <Pagination
                            className="mlbHome-pagination"
                            count={totalCount}
                            shape="rounded"
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </div>
                <div className="mlbHome-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default MLBHome;