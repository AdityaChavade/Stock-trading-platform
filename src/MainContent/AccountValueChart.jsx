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

    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(79, 70, 229, 0.25)");
    gradient.addColorStop(1, "rgba(79, 70, 229, 0.0)");

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Account Value",
            data: dataPoints,
            borderColor: "#4f46e5",
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#4f46e5",
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
            grid: { color: "#f1f5f9" },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
          y: {
            grid: { color: "#f1f5f9" },
            ticks: {
              color: "#64748b",
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

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #eef0f3",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justify: "space-between",
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
        <div style={{ display: "flex", gap: "6px" }}>
          {["1D", "1W", "1M", "1Y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                background: range === r ? "#4f46e5" : "#f1f5f9",
                color: range === r ? "#ffffff" : "#64748b",
                border: "none",
                borderRadius: "6px",
                padding: "5px 12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "12px",
                transition: "all 0.2s ease",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: "280px", width: "100%" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default AccountValueChart;
