import React from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Portfolio Value ($)",
      data: [3200, 3600, 4200, 4000, 4500, 4700, 5200],
      borderColor: "#14b8a6",
      backgroundColor: "rgba(20, 184, 166, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#e2e8f0',
      bodyColor: '#e2e8f0',
      borderColor: '#14b8a6',
      borderWidth: 1,
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#94a3b8' }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#94a3b8' }
    }
  }
};

export const PortfolioChart = () => (
  <div className="max-w-2xl mx-auto mt-10 bg-gray-900/70 rounded-2xl p-6 shadow-lg border border-gray-700/50">
    <div className="text-center mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">Live Portfolio Performance</h3>
      <p className="text-sm text-gray-400">Real-time tracking across all your wallets</p>
    </div>
    <div className="h-64">
      <Line data={chartData} options={chartOptions} />
    </div>
  </div>
);
