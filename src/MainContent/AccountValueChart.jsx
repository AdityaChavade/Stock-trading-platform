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
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AccountValueChart = ({ currentUserId }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const socketRef = useRef(null);

  const [range, setRange] = useState("1M");
  const [dataPoints, setDataPoints] = useState([]);

  // Fetch account history on load / range change
  const fetchHistory = async (selectedRange) => {
    try {
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
      console.error("Error fetching account chart data:", err);
    }
  };

  useEffect(() => {
    fetchHistory(range);
  }, [range]);

  // Initialize and Update Chart.js Instance
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, "rgba(101, 78, 255, 0.08)");
    gradient.addColorStop(1, "rgba(101, 78, 255, 0.0)");

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Account Value",
            data: dataPoints,
            borderColor: "#6C4EFF",
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#6C4EFF",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#1e293b",
            titleColor: "#f8fafc",
            bodyColor: "#f8fafc",
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) =>
                ` Value: ₹${Number(context.parsed.y).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: { unit: "day" },
            grid: {
              color: "#d1d5db",
              borderDash: [6, 4],
              drawBorder: false,
            },
            ticks: { color: "#9ca3af", font: { size: 11 } },
          },
          y: {
            grid: {
              color: "#d1d5db",
              borderDash: [6, 4],
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              callback: (value) => `₹${value.toLocaleString()}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dataPoints]);

  // WebSocket Live Subscription
  useEffect(() => {
    const socket = io("http://localhost:3000", { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (currentUserId) {
        socket.emit("joinUserRoom", currentUserId);
      }
    });

    // Auto-reconnect and refresh history
    socket.on("reconnect", () => {
      fetchHistory(range);
    });

    // Handle incoming live point
    socket.on("accountValueUpdate", (update) => {
      const chart = chartInstanceRef.current;
      if (!chart) return;

      const dataset = chart.data.datasets[0].data;
      const updateTimeMs = update.time * 1000;
      const updateSec = Math.floor(updateTimeMs / 1000);

      const lastPoint = dataset[dataset.length - 1];
      const lastSec = lastPoint ? Math.floor(lastPoint.x / 1000) : null;

      if (lastSec === updateSec) {
        // Replace point if same second
        dataset[dataset.length - 1] = { x: updateTimeMs, y: update.value };
      } else {
        // Append new point
        dataset.push({ x: updateTimeMs, y: update.value });
      }

      // Limit max 500 live points
      if (dataset.length > 500) {
        dataset.shift();
      }

      chart.update("none"); // Smooth update without animation
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, range]);

  const rangeLabels = {
    "1D": "1 Day",
    "1W": "1 Week",
    "1M": "1 Month",
    "1Y": "1 Year",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #eef0f3",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
            Account Value Trend
          </h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Real-time portfolio valuation history
          </span>
        </div>

        {/* Dropdown time-range selector */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            background: "#f1f5f9",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "7px 32px 7px 12px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            outline: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4f46e5";
            e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        >
          {Object.entries(rangeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ height: "280px", width: "100%" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default AccountValueChart;
