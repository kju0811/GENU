import React from 'react';

const orderData = {
  "1511": 2,
  "1521": 1,
  "1531": 1,
  "1541": 1,
  "1551": 1,
  "1561": 1,
  "1571": 1,
  "1581": 1,
  "1591": 1,
  "1601": 1,
  "1611": 0,
  "1621": 1,
  "1631": 1,
  "1641": 1,
  "1651": 1,
  "1661": 1,
  "1671": 1,
  "1681": 1,
  "1691": 1,
  "1701": 1,
  "1711": 1
};

const CURRENT_PRICE = 1611;

const OrderBook = () => {
  const containerStyle = {
    width: '260px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    background: '#f9f9f9',
    margin: '20px auto'
  };

  const rowStyle = (price) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: price === CURRENT_PRICE ? '#e0f7fa' : 'white',
    fontWeight: price === CURRENT_PRICE ? 'bold' : 'normal',
    borderBottom: '1px solid #eee'
  });

  const priceStyle = {
    color: '#333'
  };

  const amountStyle = {
    color: '#00796b'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: 'center' }}>📈 호가창</h3>
      <div>
        {Object.entries(orderData).map(([price, amount]) => (
          <div key={price} style={rowStyle(parseInt(price))}>
            <span style={priceStyle}>{price}</span>
            <span style={amountStyle}>{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
