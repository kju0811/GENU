import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ApexChart from "../components/ApexChart";
import OrderBook from "../components/OrderBook";
import OrderForm from "../components/OrderForm";


export default function OrderTab({ currentPrice }) {
  const { coin_no } = useParams();
  const { coin_price } = useOutletContext();
  const [selectedPrice, setSelectedPrice] = useState(coin_price);

  useEffect(() => {
    if (selectedPrice === undefined && coin_price !== undefined) {
      setSelectedPrice(coin_price);
    }
  }, [coin_price, selectedPrice]);

  const handleSelectPrice = price => setSelectedPrice(price);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <ApexChart coin_no={coin_no} />
      </div>
      <div className="w-full md:w-1/3">
        <OrderBook
          coin_no={coin_no}
          currentPrice={selectedPrice}
          onSelectPrice={handleSelectPrice}
        />
      </div>
      <div className="w-full md:w-1/5">
        <OrderForm
          coin_no={coin_no}
          defaultPrice={selectedPrice}
        />
      </div>
    </div>
  );
}