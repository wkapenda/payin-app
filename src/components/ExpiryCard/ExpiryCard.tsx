"use client";

import React from "react";
import Card from "../Card/Card";
import Image from "next/image";

const ExpiryCard = () => {
  return (
    <Card padding="62px 77px 62px 66px">
      <div className="icon-container">
        <Image
          src="/circle-alert-major.svg" // Place your SVG file in the public/icons folder
          alt="Exclamation Icon"
          width={48}
          height={48}
        />
      </div>
      <h3 className="heading font-medium my-[20px]">Payment details expired</h3>
      <p className="text-p text-center m-[0px]">
        The payment details for your transaction have expired.
      </p>
    </Card>
  );
};

export default ExpiryCard;
