import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { HomeThreePrdTwoLoader } from "@/components/loader";

// tabs
const tabs = ["All Collection", "Trending", "Beauty", "Cosmetics"];

const ProductAreaTwo = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {
    data: products,
    isError,
    isLoading,
  } = useGetProductTypeQuery({ type: "beauty", query: "new=true" });
  const activeRef = useRef(null);
  const marker = useRef(null);

  // handleActive
  const handleActive = (e, tab) => {
    setActiveTab(tab);
    if (e.target.classList.contains("active")) {
      marker.current.style.left = e.target.offsetLeft + "px";
      marker.current.style.width = e.target.offsetWidth + "px";
    }
  };

  useEffect(() => {
    if (
      activeTab &&
      activeRef.current &&
      activeRef.current.classList.contains("active")
    ) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab, products]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeThreePrdTwoLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="Không tìm thấy sản phẩm!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;

    content = (
      <>
        <div className="row align-items-end">
          <div className="col-xl-6 col-lg-6">
            <div className="tp-section-title-wrapper-3 mb-45 text-center text-lg-start">
              <span className="tp-section-title-pre-3">
                Bán chạy nhất trong tuần
              </span>
              <h3 className="tp-section-title-3">Sản phẩm bán chạy</h3>
            </div>
          </div>
        </div>

        <div className="row">
          {product_items.map((prd) => (
            <div key={prd.id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductItem product={prd} />
            </div>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <section className="tp-best-area pb-60 pt-130">
        <div className="container">{content}</div>
      </section>
    </>
  );
};

export default ProductAreaTwo;
