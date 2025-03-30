import React from "react";
import "./LabelledValue.scss";
import { LabelledValueProps } from "@/types/LabelledValues.types";

const LabelledValue: React.FC<LabelledValueProps> = ({
  description,
  value,
}) => {
  return (
    <div className="labelled-value">
      <span className="labelled-value__description value-label">
        {description}
      </span>
      <span className="labelled-value__value font-medium">{value}</span>
    </div>
  );
};

export default LabelledValue;
