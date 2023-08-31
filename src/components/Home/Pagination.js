import React from 'react'
import './styles/Pagination.css'

function Pagination({postsPerPage, totalPosts, paginate}) {

    const pageNumbers = [];

    for(let i = 1;i <= Math.ceil(totalPosts / postsPerPage);i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="pagination-item">
                        <a
                            onClick={() => paginate(number)}
                            href="#!"
                            className="pagination-link"
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination