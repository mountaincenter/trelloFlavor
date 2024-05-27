import React from "react";
import Header from "./Header";
import Wrapper from "./Wrapper";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default Layout;
