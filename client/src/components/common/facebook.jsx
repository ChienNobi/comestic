import BackToTop from "@/lib/back-to-top";
import React, { useEffect } from "react";

function BackToTopCom({ cls }) {
  useEffect(() => {
    BackToTop(".back-to-top-wrapper");
  },[]);
  return (
      <div className="cta-facebook">
        <a target="_blank" href="https://m.me/118692061613524" className="--link">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
      </div>
  );
}

export default BackToTopCom;
