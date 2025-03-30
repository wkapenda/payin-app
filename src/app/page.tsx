import Image from "next/image";
import AcceptQuoteCard from "@/components/AcceptQuoteCard/AcceptQuoteCard";
import PayQuoteCard from "@/components/PayQuoteCard/PayQuoteCard";
import ExpiryCard from "@/components/ExpiryCard/ExpiryCard";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import Loader from "@/components/Loader/Loader";

export default function Home() {
  return (
    <div>
      <AcceptQuoteCard />
      <br />
      <br />
      <PayQuoteCard />
      <br />
      <br />
      <ExpiryCard />
      <Loader />
    </div>
  );
}
