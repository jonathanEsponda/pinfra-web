import React from "react";
import Navbar from "../components/Navbar";

const Mainlayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Mainlayout;
