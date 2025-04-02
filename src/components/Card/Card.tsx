import "./Card.scss";
import { CardProps } from "../../types/Card.types";

const Card: React.FC<CardProps> = ({ children, padding }) => {
  return (
    <div className="card" style={{ padding: padding || "25px" }}>
      {children}
    </div>
  );
};

export default Card;
