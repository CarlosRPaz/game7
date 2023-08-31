import React, {useState, useEffect} from "react";
import "./styles/Home.css";
import HeaderArticle from "../Articles/HeaderArticle";
import FeaturedArticlesCont from "../Articles/FeaturedArticlesCont";
import RecentArticles from "../Articles/RecentArticles";
import {Link} from "react-router-dom";

import sanityClient from '../../client.js';
import PollWidget from "./PollWidget";
import SocialsWidget from "./SocialsWidget";
//import Pagination from "./Pagination";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function Home() {

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

    // ***********************************************************************************
    // *** Main-Featured All Articles ****************************************************
    useEffect(() => {
        sanityClient
            .fetch(`*[_type == "article" && mainfeaturedhome == true] {
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
            .fetch(`*[_type == "article" && subfeaturedhome == true] | order(publishedAt desc){
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
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = recentArticleData.slice(indexOfFirstPost, indexOfLastPost);
    const totalCount = Math.ceil(recentArticleData.length / postsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="home" id="content-wrap">
            <div className="home-cont">
                <div className="home-left">
                    <SocialsWidget />
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
                    <Stack spacing={1}>
                        <RecentArticles articleData={currentPosts} loading={loading} />
                        <Pagination
                            className="home-pagination"
                            count={totalCount}
                            shape="rounded"
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </div>
                <div className="home-right">
                    <PollWidget />
                </div>
            </div>
        </div>
    );
}

export default Home;