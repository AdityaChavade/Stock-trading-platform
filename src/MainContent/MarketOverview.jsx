import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./marketoverview.css";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketOverview = () => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const socketRef = useRef(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [range, setRange] = useState("1M");
  const [loading, setLoading] = useState(true);

  // Fetch account value history
  const fetchHistory = async (selectedRange) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/accountvalue?range=${selectedRange}`,
        { withCredentials: true }
      );
      const formatted = res.data.map((item) => ({
        x: item.time * 1000,
        y: item.value,
      }));
      setDataPoints(formatted);
    } catch (err) {
      console.error("Error fetching account value data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(range);
  }, [range]);

  // Build / rebuild the chart
  useEffect(() => {
    if (!canvasRef.current || !dataPoints.length) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const lineColor = "#4285F4";

    // Subtle gradient fill beneath the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, "rgba(66, 133, 244, 0.05)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Account Value",
            data: dataPoints,
            borderColor: lineColor,
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: lineColor,
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "start",
            labels: {
              usePointStyle: true,
              pointStyle: "rectRounded",
              boxWidth: 10,
              boxHeight: 10,
              color: "#5f6368",
              font: { size: 12, weight: "500", family: "'Inter', 'Segoe UI', sans-serif" },
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: "rgba(32, 33, 36, 0.95)",
            titleColor: "#e8eaed",
            bodyColor: "#e8eaed",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { size: 11, weight: "400", family: "'Inter', 'Segoe UI', sans-serif" },
            bodyFont: { size: 13, weight: "600", family: "'Inter', 'Segoe UI', sans-serif" },
            callbacks: {
              title: (items) => {
                if (!items.length) return "";
                const date = new Date(items[0].parsed.x);
                return date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
              },
              label: (context) =>
                ` ₹${Number(context.parsed.y).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: range === "1D" ? "hour" : range === "1W" ? "day" : "month",
              displayFormats: {
                hour: "HH:mm",
                day: "MMM dd",
                month: "MMM yy",
              },
            },
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: "#9aa0a6",
              font: { size: 11, family: "'Inter', 'Segoe UI', sans-serif" },
              maxTicksLimit: 6,
              padding: 8,
            },
          },
          y: {
            display: false,
            grid: { display: false },
          },
        },
        layout: {
          padding: { left: 4, right: 12, top: 8, bottom: 4 },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dataPoints, range]);

  // WebSocket for live updates
  useEffect(() => {
    const socket = io("http://localhost:3000", { withCredentials: true });
    socketRef.current = socket;

    socket.on("reconnect", () => {
      fetchHistory(range);
    });

    socket.on("accountValueUpdate", (update) => {
      const chart = chartInstanceRef.current;
      if (!chart) return;

      const dataset = chart.data.datasets[0].data;
      const updateTimeMs = update.time * 1000;
      const updateSec = Math.floor(updateTimeMs / 1000);

      const lastPoint = dataset[dataset.length - 1];
      const lastSec = lastPoint ? Math.floor(lastPoint.x / 1000) : null;

      if (lastSec === updateSec) {
        dataset[dataset.length - 1] = { x: updateTimeMs, y: update.value };
      } else {
        dataset.push({ x: updateTimeMs, y: update.value });
      }

      if (dataset.length > 500) {
        dataset.shift();
      }

      chart.update("none");
    });

    return () => {
      socket.disconnect();
    };
  }, [range]);

  const rangeOptions = [
    { value: "1D", label: "1D" },
    { value: "1W", label: "1W" },
    { value: "1M", label: "1M" },
    { value: "1Y", label: "1Y" },
  ];

  return (
    <div className="market-overview-card">

      <div className="market-overview-header">
        <div className="market-overview-title-section">
          <div className="market-overview-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3 className="market-overview-title">Market overview</h3>
        </div>

        <div className="market-overview-range-selector">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`range-btn ${range === opt.value ? "range-btn-active" : ""}`}
              onClick={() => setRange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="market-overview-chart-container">
        {loading ? (
          <div className="market-overview-loading">
            <div className="loading-pulse" />
            <span>Loading data...</span>
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
};

export default MarketOverview;
