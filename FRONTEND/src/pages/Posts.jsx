import React from "react";

import ProfileInfScroll from "../components/ProfileInfScroll";

const Posts = () => {
  return (
    <ProfileInfScroll
      backendRoute={"landlordHouses"}
      queryName={"landlordPosts"}
      showPosts={true}
    />
  );
};

export default Posts;
