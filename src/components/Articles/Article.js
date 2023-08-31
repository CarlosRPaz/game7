import React from 'react';
import './styles/Article.css';
import moment from 'moment';

function Article({ article }) {

    function truncate(string, n) {
        return string.length > n ? string.substr(0, n - 1) + '...' : string;
    }

    return (
        <div className="article">
            <img className="article-img"
                src={article.mainImage.asset.url}
                alt={article.name}
                style={{
                    objectFit: 'cover'
                }}
            />
            <div className="article-infoCont">
                <h4 className="article-infoCont-title">{truncate(article.title, 50)}</h4>
                <p className="article-infoCont-authorDate">{article.author.name} | {moment(article.publishedAt).fromNow()}</p>
            </div>
        </div>
    )
}

export default Article
