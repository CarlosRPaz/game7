import React, {useEffect, useState} from 'react'
import './styles/ArticlePage.css';
import {useParams} from "react-router-dom";
import CommentSection from './CommentSection';

import sanityClient from '../../client.js';
import PortableText from "@sanity/block-content-to-react";
import urlBuilder from "@sanity/image-url";
import {maxWidth} from '@material-ui/system';
import moment from 'moment';

const builder = urlBuilder({projectId: 'jauwdlqi', dataset: 'production'});

function urlFor(source) {
    return builder.image(source)
}

const serializers = {
    types: {
        image: props => (
            <figure>
                <img
                    src={urlFor(props.node.asset).maxWidth(960).url()}
                    alt={props.node.alt}
                    className="articlePage-blockImage"
                />
            </figure>
        )
    }
}


function ArticlePage({article}) {
    const [currentArticle, setCurrentArticle] = useState(null);
    const {slug} = useParams();

    useEffect(() => {
        sanityClient.fetch(`*[slug.current == "${slug}"]{
            title,
            _id,
            slug,
            publishedAt,
            mainImage{
                asset->{
                    _id,
                    url
                }
            },
            body,
            "name": author->name,
            "authorImage": author->image
        }`).then((data) => setCurrentArticle(data[0]))
            .catch(console.error);
    }, [slug]);

    if(!currentArticle) return <div>Loading...</div>;

    return (
        <div className="articlePage" id="content-wrap">
            <div className="articlePage-right">
                right
            </div>
            <div className="articlePage-main">
                <article>
                    <header>
                        <img className="articlePage-img"
                            src={currentArticle.mainImage.asset.url}
                            alt={currentArticle.title}
                        />
                        <div className="articlePage-title">{currentArticle.title}</div>
                        <div className="articlePage-info">
                            <img className="articlePage-info-authorIMG"
                                src={urlFor(currentArticle.authorImage).url()}
                                alt={currentArticle.name}
                                style={{
                                    objectFit: 'cover'
                                }}
                            />
                            <div className="articlePage-info-authorDate">
                                <p className="articlePage-info-author">By {currentArticle.name}</p>
                                <p className="articlePage-info-date">{moment(currentArticle.publishedAt).format("LLL")}</p>
                            </div>
                        </div>
                    </header>
                    <div className="articlePage-block">
                        <PortableText
                            blocks={currentArticle.body}
                            className="articlePage-portableText"
                            projectId="jauwdlqi"
                            dataset="production"
                            serializers={serializers}
                        />
                    </div>
                    <CommentSection currentArticleId={currentArticle._id} />
                </article>
            </div>
        </div>
    )
}

export default ArticlePage