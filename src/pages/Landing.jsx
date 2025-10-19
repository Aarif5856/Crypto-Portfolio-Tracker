import React from "react";
import { ArrowRight, Wallet, LineChart, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing({ onNavigateToDashboard }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen text-gray-100 font-inter">
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
      <section className="text-center py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Track & Grow Your <span className="text-teal-400">Crypto Portfolio</span>
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
            🚀 Live Demo <ArrowRight size={18} />
          </button>
          <a
            href="#pricing"
            className="border border-teal-400 hover:bg-teal-400/10 text-teal-300 px-6 py-3 rounded-xl font-semibold transition"
          >
            💳 Upgrade to Pro
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900/40 backdrop-blur-lg">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose CryptoPro</h3>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Wallet size={36} />,
              title: "Multi-Wallet Sync",
              desc: "Connect MetaMask or any wallet and track all your assets in one view.",
            },
            {
              icon: <LineChart size={36} />,
              title: "Live Market Data",
              desc: "Real-time prices via CoinGecko API with smart refresh and caching.",
            },
            {
              icon: <Zap size={36} />,
              title: "Lightning Fast UI",
              desc: "Built with React + Vite + Tailwind for instant response and modern look.",
            },
            {
              icon: <Shield size={36} />,
              title: "Secure & Private",
              desc: "View-only wallet connections — we never store private keys or data.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 p-6 rounded-2xl shadow-md hover:shadow-teal-400/20 transition"
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              className={`rounded-2xl border ${plan.color} p-8 shadow-md transition`}
            >
              <h4 className="text-xl font-semibold mb-2">{plan.title}</h4>
              <p className="text-4xl font-bold text-teal-400 mb-4">{plan.price}</p>
              <ul className="text-gray-400 mb-6 space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx}>✅ {f}</li>
                ))}
              </ul>
              <button className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-2 rounded-xl font-semibold transition">
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
              Absolutely. CryptoPro uses read-only wallet access — your private keys never leave your wallet.
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

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm bg-gray-950/60 border-t border-gray-800">
        © {new Date().getFullYear()} CryptoPro — Built with ❤️ by Aarif Mohamed
      </footer>
    </div>
  );
}
