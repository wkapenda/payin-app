import React from "react";
import "./LabelledValue.scss";
import { LabelledValueProps } from "@/types/LabelledValues.types";

const LabelledValue: React.FC<LabelledValueProps> = ({
  description,
  value,
  isQuoteGenerated,
}) => {
  return (
    <div className="labelled-value">
      <span className="labelled-value__description value-label">
        {description}
      </span>
      <span className="labelled-value__value font-medium">
        {isQuoteGenerated && value ? (
          value
        ) : (
          // Tailwind spinner loading component
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </span>
    </div>
  );
};

export default LabelledValue;
