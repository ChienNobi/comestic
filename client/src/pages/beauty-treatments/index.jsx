import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import SectionTitle from "@/components/blog/blog-grid/section-title";
import BeautyTreatment from "@/components/beauty-treatment/list";

const BlogListPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Liệu trình làm đẹp" />
      <HeaderTwo style_2={true} />
      <SectionTitle/>
      <BeautyTreatment list_area={true} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogListPage;
