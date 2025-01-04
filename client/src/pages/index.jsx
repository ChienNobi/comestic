import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import Header from "@/layout/headers/header";
import BeautyBanner from "@/components/banner/beauty-banner";
import BeautyCategory from "@/components/categories/beauty-category";
import ProductArea from "@/components/products/beauty/product-area";
import ProductAreaTwo from "@/components/products/beauty/product-area-2";
import TrendingSpecialPrd from "@/components/products/beauty/trending-special-prd";
import Footer from "@/layout/footers/footer";

export default function Home() {
  return (
    <Wrapper>
      <SEO pageTitle="Home" />
      <Header />
      <BeautyBanner />
      <BeautyCategory />
      <ProductArea />
      <ProductAreaTwo />
      <TrendingSpecialPrd />
      <Footer style_3={true} />
    </Wrapper>
  );
}
