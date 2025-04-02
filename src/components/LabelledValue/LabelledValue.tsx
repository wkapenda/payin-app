import React, { useState } from "react";
import "./LabelledValue.scss";
import { LabelledValueProps } from "@/types/LabelledValues.types";
import { shortenValue } from "@/utils/helpers";

const LabelledValue: React.FC<LabelledValueProps> = ({
  description,
  value,
  isQuoteGenerated,
  isCopy,
}) => {
  const [copied, setCopied] = useState(false);

  // Generalized helper: if the value contains a space, return the first word.
  const getCopyValue = (): string => {
    return value.includes(" ") ? value.split(" ")[0] : value;
  };

  // Copy the processed value to clipboard with temporary feedback.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyValue());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  // Display either the shortened value or a spinner if the quote is not generated yet.
  const displayValue =
    isQuoteGenerated && value ? (
      shortenValue(value)
    ) : (
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="labelled-value">
      <span className="labelled-value__description value-label">
        {description}
      </span>
      <span className="labelled-value__value font-medium flex items-center">
        {displayValue}
        {isCopy && isQuoteGenerated && value && (
          <button onClick={handleCopy} className="ml-2 flex items-center">
            <span className="text-xs ml-1 copy-text">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        )}
      </span>
    </div>
  );
};

export default LabelledValue;
