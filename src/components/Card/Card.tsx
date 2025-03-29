import React from "react";
import "./Card.scss";
import { CardProps } from "../../types/Card.types";

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="card">{children}</div>;
};

export default Card;
