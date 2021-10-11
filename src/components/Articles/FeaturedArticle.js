import React from 'react'
import './styles/FeaturedArticle.css';
import { Link } from "react-router-dom";

// If only showing 2 articles, hide last and make sure the NEW last doesnt have margin-right

function FeaturedArticle({ featArticle }) {
    return (
        <div className="featuredArticle" /*style={{
            backgroundSize: "cover",
            backgroundImage: `url(${featArticle.mainImage.asset.url})`,
            backgroundPosition: "center center"
        }}*/>
            <img src={featArticle.mainImage.asset.url} alt=""
            //style={{ backgroundSize: "cover", backgroundPosition: "center center" }}
            />
            <div className={`featuredArticle-tag 
                ${featArticle.categories[0].title === 'NFL' ? 'featuredArticle-tag-NFL' : null}
                ${featArticle.categories[0].title === 'NBA' ? 'featuredArticle-tag-NBA' : null} 
                ${featArticle.categories[0].title === 'MLR' ? 'featuredArticle-tag-MLR' : null}
            `}>
                {featArticle.categories[0].title}
            </div>
            <div className="featuredArticle-title">{featArticle.title}</div>
            <div className="featuredArticle-author">{featArticle.author.name}</div>
        </div >
    )
}

export default FeaturedArticle