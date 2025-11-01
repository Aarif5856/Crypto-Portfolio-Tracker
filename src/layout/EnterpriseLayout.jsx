import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EnterpriseLayout = ({ route, onNavigate, children, onAssetSelect }) => {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Sidebar route={route} onNavigate={onNavigate} />
      <Navbar onAssetSelect={onAssetSelect} />

      <main className="pt-20 pl-[76px] lg:pl-[260px] pr-4 pb-6">
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        <Footer />
      </main>
    </div>
  );
};

export default EnterpriseLayout;
