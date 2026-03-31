'use client'

import React, { useState, useEffect } from 'react'

const currencies = [
  { symbol: 'USD', rate: 1.0, name: 'US Dollar' },
  { symbol: 'EUR', rate: 0.92, name: 'Euro' },
  { symbol: 'GBP', rate: 0.79, name: 'British Pound' },
  { symbol: 'NGN', rate: 1550.0, name: 'Nigerian Naira' },
  { symbol: 'BTC', rate: 0.000015, name: 'Bitcoin' },
  { symbol: 'ETH', rate: 0.00032, name: 'Ethereum' },
  { symbol: 'JPY', rate: 149.50, name: 'Japanese Yen' },
  { symbol: 'CAD', rate: 1.36, name: 'Canadian Dollar' },
  { symbol: 'AUD', rate: 1.53, name: 'Australian Dollar' },
  { symbol: 'CHF', rate: 0.88, name: 'Swiss Franc' },
]

export function CurrencyTicker() {
  const [displayedCurrencies, setDisplayedCurrencies] = useState(currencies)

  useEffect(() => {
    // Duplicate currencies for seamless loop
    setDisplayedCurrencies([...currencies, ...currencies])
  }, [])

  return (
    <div className="w-full bg-primary text-white py-2 overflow-hidden">
      <div className="ticker-animation flex whitespace-nowrap">
        {displayedCurrencies.map((currency, index) => (
          <span key={index} className="inline-flex items-center mx-6">
            <span className="font-bold text-sm">{currency.symbol}</span>
            <span className="ml-2 text-sm opacity-90">
              {currency.symbol === 'BTC' || currency.symbol === 'ETH'
                ? `$${currency.rate.toFixed(6)}`
                : `$${currency.rate.toFixed(2)}`}
            </span>
            <span className="ml-1 text-xs opacity-70">({currency.name})</span>
          </span>
        ))}
      </div>
    </div>
  )
}
