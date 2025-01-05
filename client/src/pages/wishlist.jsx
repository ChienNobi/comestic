import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import WishlistArea from '@/components/cart-wishlist/wishlist-area';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';

const WishlistPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Danh sách yêu thích" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Danh sách yêu thích" subtitle="Danh sách yêu thích" />
      <WishlistArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default WishlistPage;