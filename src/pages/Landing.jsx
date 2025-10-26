import React from "react";
import { ArrowRight, Wallet, LineChart, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { trackPricingClick } from "../utils/analytics";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

export default function Landing({ onNavigateToDashboard }) {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Portfolio Value ($)",
        data: [3200, 3600, 4200, 4000, 4500, 4700, 5200],
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#14b8a6",
      },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] via-[#151528] to-[#1a1a2e] min-h-screen text-gray-100 font-inter">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-white">CryptoPro</h1>
        <nav className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-teal-400 transition">Features</a>
          <a href="#pricing" className="hover:text-teal-400 transition">Pricing</a>
          <a href="#faq" className="hover:text-teal-400 transition">FAQ</a>
        </nav>
        <button
          onClick={onNavigateToDashboard}
          className="bg-teal-500 hover:bg-teal-400 text-black px-5 py-2 rounded-xl font-semibold shadow-md transition"
        >
          Launch App
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-32 md:py-48 px-4 md:px-12">
        <motion.h2 data-testid="landing-hero-heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Track & Grow Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 animate-pulse">
            Crypto Portfolio
          </span>
        </motion.h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          Monitor all your wallets, tokens, and assets in real-time.
          Secure, customizable, and ready for white-label resale.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onNavigateToDashboard}
            className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-3 rounded-xl font-semibold shadow-md flex items-center gap-2 transition"
          >
            Live Demo <ArrowRight size={18} />
          </button>
          <a
            href="#pricing"
            className="border border-teal-400 hover:bg-teal-400/10 text-teal-300 px-6 py-3 rounded-xl font-semibold transition"
          >
            Upgrade to Pro
          </a>
        </div>

        {/* Chart */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center mb-2 text-white">
            Live Portfolio Performance
          </h3>
          <p className="text-gray-400 text-center mb-6">
            Real-time tracking across all your wallets
          </p>
          <div className="max-w-3xl mx-auto bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-teal-400/20">
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900/40 backdrop-blur-lg">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose CryptoPro</h3>
        {/* Normalized marketing copy to remove corrupted glyphs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 md:px-10">
          {[
            {
              icon: <Wallet size={36} />,
              title: "Multi-Wallet Sync",
              desc: "Connect MetaMask or any supported wallet and track every asset from a single dashboard.",
            },
            {
              icon: <LineChart size={36} />,
              title: "Live Market Data",
              desc: "Real-time prices via CoinGecko with smart refresh intervals and caching.",
            },
            {
              icon: <Zap size={36} />,
              title: "Lightning Fast UI",
              desc: "React, Vite, and Tailwind power snappy interactions and modern visuals.",
            },
            {
              icon: <Shield size={36} />,
              title: "Secure & Private",
              desc: "View-only wallet connections - we never store private keys or personal data.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-gray-900/60 border border-transparent hover:border-teal-400/40 p-6 rounded-2xl shadow-md hover:shadow-teal-400/20 transition-all duration-300"
            >
              <div className="text-teal-400 mb-4">{item.icon}</div>
              <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 text-center bg-gradient-to-b from-gray-900 via-purple-800 to-indigo-900">
        <h3 className="text-3xl font-bold mb-12">Simple, Transparent Pricing</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 md:px-10">
          {[
            {
              title: "Free Plan",
              price: "$0",
              features: ["1 Wallet", "Basic Dashboard", "Limited Updates"],
              button: "Start Free",
              color: "border-gray-500 hover:border-teal-400",
            },
            {
              title: "Pro Plan",
              price: "$19/mo",
              features: ["Unlimited Wallets", "Live Charts", "Export Reports"],
              button: "Go Pro",
              color: "border-teal-500 hover:border-teal-400 bg-gray-900/60",
            },
            {
              title: "White-Label",
              price: "$199",
              features: ["Custom Branding", "Dedicated Support", "Source Code Access"],
              button: "Buy License",
              color: "border-purple-500 hover:border-teal-400",
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className={`relative bg-gray-900/60 border border-gray-700 hover:border-teal-400 shadow-xl hover:shadow-teal-400/30 rounded-2xl p-8 transition-all duration-300 ${plan.color}`}
            >
              {plan.title === "Pro Plan" && (
                <div className="absolute top-0 right-0 bg-teal-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl animate-pulse">
                  Most Popular
                </div>
              )}
              <h4 className="text-xl font-semibold mb-2">{plan.title}</h4>
              <p className="text-4xl font-bold text-teal-400 mb-4">{plan.price}</p>
              <ul className="text-gray-400 mb-6 space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" aria-hidden="true"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-2 rounded-xl font-semibold transition"
                onClick={() => {
                  trackPricingClick(plan.title, 'landing-pricing');
                  if (plan.title === "Free Plan") {
                    onNavigateToDashboard();
                    return;
                  }
                  if (plan.title === "Pro Plan") {
                    window.dispatchEvent(new CustomEvent('open-upgrade-modal'));
                    const upgradeSection = document.getElementById('upgrade-section');
                    if (upgradeSection) {
                      upgradeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                  }
                  window.location.href = "mailto:sales@coinvision.app?subject=CryptoPro%20White-label%20Request";
                }}
              >
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-gray-900/50 backdrop-blur-lg">
        <h3 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <details className="bg-gray-800/50 p-5 rounded-xl">
            <summary className="cursor-pointer font-semibold text-teal-400">Is my wallet data safe?</summary>
            <p className="text-gray-400 mt-2">
              Absolutely. CryptoPro uses read-only wallet access - your private keys never leave your wallet.
            </p>
          </details>
          <details className="bg-gray-800/50 p-5 rounded-xl">
            <summary className="cursor-pointer font-semibold text-teal-400">Can I rebrand this app?</summary>
            <p className="text-gray-400 mt-2">
              Yes! The white-label plan allows you to customize logos, colors, and even deploy under your domain.
            </p>
          </details>
          <details className="bg-gray-800/50 p-5 rounded-xl">
            <summary className="cursor-pointer font-semibold text-teal-400">Which networks are supported?</summary>
            <p className="text-gray-400 mt-2">
              Ethereum mainnet and testnets. Additional chains like BSC and Polygon are coming soon.
            </p>
          </details>
        </div>
      </section>

      <footer className="text-center py-10 bg-gray-950/80 border-t border-gray-800 text-gray-400">
        {/* Clean footer copy after removing corrupted characters */}
        <span>&copy; {new Date().getFullYear()} CryptoPro - All Rights Reserved -</span>
        <a href="https://github.com/Aarif5856" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline ml-1">
          Built by Aarif
        </a>
      </footer>
    </div>
  );
}
