import React from "react";
import Loader from "../loader";

function SingleLoader({ loading }) {
  return (
    <div
      className="col-xl-3 col-lg-3 col-sm-6 d-flex align-items-center"
      style={{ height: "300px" }}
    >
      <Loader loading={loading} color="BD844C"  />
    </div>
  );
}

const HomeThreePrdTwoLoader = ({loading}) => {
  return (
    <div className="row">
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
      <SingleLoader loading={loading} />
    </div>
  );
};

export default HomeThreePrdTwoLoader;
