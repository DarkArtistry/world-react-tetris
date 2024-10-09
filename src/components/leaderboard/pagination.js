import React, { Component } from "react";
import Button from "../button";
import * as style from "./index.less";

class Pagination extends Component {
  handlePageChange = (pageNumber) => {
    this.props.onPageChange(pageNumber);
  };

  renderPageNumbers = () => {
    const { totalPages, currentPage } = this.props;
    const MAX_VISIBLE_PAGES = 3;
    const pages = [];

    // Determine the start and end of the visible page range
    const startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Adjust startPage if endPage reaches the totalPages limit
    const adjustedStartPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);

    // Add the first page if it's not in the visible range
    if (adjustedStartPage > 1) {
      pages.push(
        <Button key={1} onClick={() => this.handlePageChange(1)}>
          1
        </Button>
      );
      if (adjustedStartPage > 2) {
        pages.push(<span key="start-ellipsis">...</span>);
      }
    }

    // Add visible page numbers
    for (let i = adjustedStartPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          isActive={currentPage === i}
          onClick={() => this.handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add the last page if it's not in the visible range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => this.handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  handlePrevious = () => {
    const { currentPage } = this.props;
    if (currentPage > 1) {
      this.handlePageChange(currentPage - 1);
    }
  };

  handleNext = () => {
    const { totalPages, currentPage } = this.props;
    if (currentPage < totalPages) {
      this.handlePageChange(currentPage + 1);
    }
  };

  render() {
    const { totalPages, currentPage } = this.props;

    return (
      <div className={style.pagination}>
        <Button disabled={currentPage === 1} onClick={this.handlePrevious}>
          {"<"}
        </Button>

        {this.renderPageNumbers()}

        <Button disabled={currentPage === totalPages} onClick={this.handleNext}>
          {">"}
        </Button>
      </div>
    );
  }
}

export default Pagination;
