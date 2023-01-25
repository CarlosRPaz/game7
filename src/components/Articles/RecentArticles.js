import React from 'react'
import './styles/RecentArticles.css';
import {Link} from "react-router-dom";
import ArticleItem from './ArticleItem';

function RecentArticles({articleData, loading}) {

    if(loading) {
        return 'Loading...';
    }

    console.log(articleData);

    return (
        <div className="recentArticles">
            <h3>Recent Articles</h3>
            <div className="recentArticles-linksCont">
                {articleData && articleData.map((article, index) => (
                    <Link to={"/article/" + article.slug.current} key={article.slug.current} className="recentArticles-link" style={{textDecoration: 'none'}}>
                        <ArticleItem article={article} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default RecentArticles