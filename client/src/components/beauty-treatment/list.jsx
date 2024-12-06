import React, {useState} from 'react';
import {GridTab, ListTab} from '@/svg';
import GridItem from './grid-item';
import ListItem from './list-item';
import blogData from '@/data/blog-data';
import {useGetActiveBeautyTreatmentsQuery} from "@/redux/features/beautyTreatmentApi";

const List = ({list_area = false}) => {
    const {data} = useGetActiveBeautyTreatmentsQuery();

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
