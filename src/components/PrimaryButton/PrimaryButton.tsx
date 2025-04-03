"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import "./PrimaryButton.scss";
import { PrimaryButtonProps } from "@/types/PrimaryButton.types";

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label = "Confirm",
  loading = false,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      className="primary-button"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="primary-button__icon animate-spin" />}
      <span className="primary-button__text">{label}</span>
    </Button>
  );
};

export default PrimaryButton;
