import React from 'react'
import './styles/RecentArticles.css';
import { Link } from "react-router-dom";
import Article from './Article.js';

function RecentArticles({ articleData }) {
    return (
        <div className="recentArticles">
            <h3>Recent Articles</h3>
            {articleData && articleData.map((article, index) => (
                <Link to={"/article/" + article.slug.current} key={article.slug.current} className="recentArticles-link" style={{ textDecoration: 'none' }}>
                    <Article article={article} />
                </Link>
            ))}
        </div>
    )
}

export default RecentArticles