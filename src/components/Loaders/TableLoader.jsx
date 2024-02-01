import React from "react";
import ContentLoader from "react-content-loader";

const TableLoader = ({ width = 1420, height = 400 }) => {
  return (
    <ContentLoader viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="0" rx="12" ry="12" width={width} height={height} />
    </ContentLoader>
  );
};

export default TableLoader;
