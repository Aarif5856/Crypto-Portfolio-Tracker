import React, { createContext, useContext, useEffect, useState } from 'react';

const BillingContext = createContext();

export const useBilling = () => {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error('useBilling must be used within BillingProvider');
  return ctx;
};

export const BillingProvider = ({ children }) => {
  const [cycle, setCycle] = useState('monthly');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('billing-cycle');
      if (saved === 'monthly' || saved === 'yearly') setCycle(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('billing-cycle', cycle);
    } catch {}
  }, [cycle]);

  return (
    <BillingContext.Provider value={{ cycle, setCycle }}>
      {children}
    </BillingContext.Provider>
  );
};

