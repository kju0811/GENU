import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ApexChart from "../components/ApexChart";
import OrderBook from "../components/OrderBook";
import OrderForm from "../components/OrderForm";


export default function OrderTab() {
    const { coin_no } = useParams();
    const [selectedPrice, setSelectedPrice] = useState(null);
  
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
  