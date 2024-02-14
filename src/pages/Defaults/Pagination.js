import React from "react";
import { Button } from "primereact/button";
const Pagination = ({ totalPosts, postsPerPage, paginate, currentPage }) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }
    return (
        <div className="pagination">
            <button type="button" className="p-paginator-first p-paginator-element p-link p-disabled" disabled="">
                <span className="p-paginator-icon pi pi-angle-double-left"></span>
            </button>
            <button type="button" className="p-paginator-prev p-paginator-element p-link p-disabled" disabled="">
                <span className="p-paginator-icon pi pi-angle-left"></span>
            </button>
            {pages.map((page) => (
                <div key={page}>
                    <Button label={page} onClick={() => paginate(page)} className={page == currentPage ? "active" : ""} />
                </div>
            ))}
            <button type="button" className="p-paginator-prev p-paginator-element p-link p-disabled" disabled="">
                <span className="p-paginator-icon pi pi-angle-right"></span>
            </button>
            <button type="button" className="p-paginator-first p-paginator-element p-link p-disabled" disabled="">
                <span className="p-paginator-icon pi pi-angle-double-right"></span>
            </button>

            <span className="p-paginator-current" style={{ color: "#6c757d" }}>
                Showing {currentPage + postsPerPage * (currentPage - 1) - currentPage + 1} to {totalPosts - currentPage * postsPerPage > 0 ? currentPage * postsPerPage : totalPosts} of {totalPosts} results
            </span>
        </div>
    );
};
export default React.memo(Pagination);
