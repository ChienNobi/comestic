import React from "react";
import Link from "next/link";
import { ArrowRightLong, Date } from "@/svg";
import { formatFullDateTime } from "@/utils/formatter";

const ListItem = ({ blog }) => {
  const { _id, img, createdAt, title, description } = blog;
  return (
    <div className="tp-blog-list-item d-md-flex d-lg-block d-xl-flex">
      <div className="tp-blog-list-thumb">
        <Link href={`/blog-details/${_id}`}>
          <img src={img} alt={title} />
        </Link>
      </div>
      <div className="tp-blog-list-content">
        <div className="tp-blog-grid-content">
          <div className="tp-blog-grid-meta">
            <span>
              <span>
                <Date /> {formatFullDateTime(createdAt)}
              </span>
            </span>
          </div>
          <h3 className="tp-blog-grid-title">
            <Link href={`/blog-details/${_id}`}>{title}</Link>
          </h3>

          <div className="tp-blog-grid-btn">
            <Link href={`/blog-details/${_id}`} className="tp-link-btn-3">
              Đọc thêm <ArrowRightLong />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
