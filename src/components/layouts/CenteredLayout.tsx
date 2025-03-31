"use client";

import { CenteredLayoutProps } from "@/types/layouts.types";
import React from "react";
import "./CenteredLayout.scss";

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children }) => {
  return (
    <div className="centered-layout-container flex flex-col justify-center items-center min-h-screen p-4">
      {children}
    </div>
  );
};

export default CenteredLayout;
