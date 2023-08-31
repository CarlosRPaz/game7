import React from "react";
import "./styles/HeaderArticle.css";

function HeaderArticle({ headerArticleData }) {
    if (!headerArticleData) {
        return 'Loading...'
    }

    return (
        <div className="headerArticle">
            <img src={headerArticleData.mainImage.asset.url} alt="" className="headerArticle-img" />
            <div className="headerArticle-info">
                <div className="headerArticle-info-tags">{headerArticleData.categories[0].title}</div>
                <div className="headerArticle-info-title">{headerArticleData.title}</div>
                <div className="headerArticle-info-summary">{headerArticleData.hook}</div>
            </div>
        </div>
    );
}

export default HeaderArticle;