"use client";

import React from "react";
import CenteredLayout from "@/components/layouts/CenteredLayout";

const Loader: React.FC = () => {
  return (
    <CenteredLayout>
      <svg
        className="mr-3 w-10 h-10 animate-spin"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="47.12 15.71"
          strokeLinecap="round"
          className="text-[#3f53dd]"
        />
      </svg>
    </CenteredLayout>
  );
};

export default Loader;
