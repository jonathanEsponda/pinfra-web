import React from "react";

const Authlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="grid place-items-center min-h-screen">{children}</div>;
};

export default Authlayout;
