import React from "react";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
const AcceptQuoteCard = () => {
  return (
    <Card>
      <h3>Merchant Display Name</h3>
      <h2>200 EURO</h2>
      <p>For the reference number: 1234567890</p>
      <Dropdown />
    </Card>
  );
};

export default AcceptQuoteCard;
