import React from "react";
import './styles/FeaturedArticlesCont.css';
import FeaturedArticle from './FeaturedArticle';
import { Link } from "react-router-dom";


function FeaturedArticlesCont({ featuredArticlesData }) {

    if (!featuredArticlesData) {
        return 'Loading...'
    }

    return (
        <div className="featuredArticlesCont">
            <h3>Featured Articles</h3>
            <div className="featuredArticlesCont-cont">
                {featuredArticlesData && featuredArticlesData.map((featArticle, index) => (
                    <Link to={"/article/" + featArticle.slug.current} key={featArticle.slug.current} className="featuredArticlesCont-contLink" style={{ textDecoration: 'none' }}>
                        <FeaturedArticle featArticle={featArticle} key={featArticle.slug.current} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default FeaturedArticlesCont
