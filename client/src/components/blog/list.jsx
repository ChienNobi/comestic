import React from 'react';
import ListItem from './list-item';
import {useGetActiveBlogQuery} from "@/redux/features/blogApi";

const List = () => {
    const {data} = useGetActiveBlogQuery();

    return (
        <>
            <section className="tp-blog-grid-area pb-120">
                <div className="container">
                    <div className="tp-blog-grid-wrapper">
                        <div className="tp-blog-list-item-wrapper">
                            {data?.data?.map((blog, i) => (
                                <ListItem key={i} blog={blog}/>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default List;
