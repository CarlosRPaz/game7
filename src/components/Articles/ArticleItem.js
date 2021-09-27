import React from 'react';
import './styles/ArticleItem.css';
import moment from 'moment';

function ArticleItem({ article }) {

    function truncate(string, n) {
        return string ?.length > n ? string.substr(0, n - 1) + '...' : string;
    }

    return (
        <div className="articleItem">
            <img className="articleItem-img"
                src={article.mainImage.asset.url}
                alt={article.name}
                style={{
                    objectFit: 'cover'
                }}
            />
            <div className="articleItem-infoCont">
                <h4 className="articleItem-infoCont-title">{article.title}</h4>
                <p className="articleItem-infoCont-summary">{article.summary}</p>
                <p className="articleItem-infoCont-authorDate">{article.author.name} | {moment(article.publishedAt).fromNow()}</p>
            </div>
        </div>
    )
}

export default ArticleItem
