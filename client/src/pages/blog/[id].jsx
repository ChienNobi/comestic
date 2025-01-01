import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import {useGetBlogByIdQuery} from "@/redux/features/blogApi";
const BeautyTreatmentDetail = ({query}) => {
    const {data} = useGetBlogByIdQuery(query.id);
    return (
        <Wrapper>
            <SEO pageTitle={data?.data.title}/>
            <HeaderTwo style_2={true}/>
            <section className="tp-postbox-details-area pb-120 pt-95">
                <div className="container">
                    {/* <h3>{data?.data.title}</h3>
                    <img src={data?.data.img} alt="blog-big-img" style={{ maxWidth: '100%', marginBottom: '16px' }}/> */}
                    <div dangerouslySetInnerHTML={{__html: data?.data?.description}}/>
                </div>
            </section>
            <Footer primary_style={true}/>
        </Wrapper>
    );
};

export default BeautyTreatmentDetail;

export const getServerSideProps = async (context) => {
    const { query } = context;

    return {
        props: {
            query,
        },
    };
};

