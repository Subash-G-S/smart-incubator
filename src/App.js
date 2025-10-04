import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const latestRef = ref(db, "/incubator/latest");

    onValue(latestRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setData(val);

        // Store history (keep last 240 points = 4 mins if 1s interval)
        setHistory((prev) => {
          const now = new Date();
          const label = `${String(now.getMinutes()).padStart(2, "0")}:${String(
            now.getSeconds()
          ).padStart(2, "0")}`; // mm:ss
          const newData = [
            ...prev,
            { timestamp: label, temperature: val.temperature, humidity: val.humidity },
          ];
          return newData.slice(-240); // keep ~4 mins of data
        });
      }
    });
  }, []);

  const statusStyle = (isOn) => ({
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#fff",
    background: isOn
      ? "linear-gradient(90deg, #00ff99, #00cc66)"
      : "linear-gradient(90deg, #ff3333, #cc0000)",
    boxShadow: isOn
      ? "0 0 20px 5px rgba(0,255,150,0.6)"
      : "0 0 20px 5px rgba(255,50,50,0.6)",
    transition: "all 0.3s ease-in-out",
  });

  const cardStyle = {
    background: "rgba(25, 25, 25, 0.9)",
    borderRadius: "20px",
    padding: "25px",
    minWidth: "220px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 0 25px rgba(0,255,255,0.15)",
    backdropFilter: "blur(12px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHover = {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 0 35px rgba(0,255,255,0.6)",
  };

  // Chart Data
  const chartData = {
    labels: history.map((h) => h.timestamp),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.map((h) => h.temperature),
        borderColor: "#00ffff",
        backgroundColor: "rgba(0,255,255,0.3)",
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: history.map((h) => h.humidity),
        borderColor: "#66ffcc",
        backgroundColor: "rgba(102,255,204,0.3)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#eee" } },
      title: {
        display: true,
        text: "Live Temperature & Humidity Trends",
        color: "#eee",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          callback: function (val, index) {
            // ✅ Show one label every 10 points (10 sec if 1s interval)
            return index % 10 === 0 ? this.getLabelForValue(val) : "";
          },
        },
      },
      y: {
        ticks: { color: "#ccc" },
      },
    },
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#eee",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: "10px",
          textShadow: "0 0 15px cyan, 0 0 30px blue",
        }}
      >
        🌡️ Smart Incubator Dashboard
      </h1>
      <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "40px", fontSize: "1.2rem" }}>
        Real-time Monitoring with Firebase
      </p>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
        }}
      >
        {/* Temperature */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <h2>🌡️ Temperature</h2>
          <p style={{ fontSize: "2.5rem", color: "#00ffff", textShadow: "0 0 15px #00ffff" }}>
            {data.temperature !== undefined ? data.temperature.toFixed(1) : "--"} °C
          </p>
        </div>

        {/* Humidity */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <h2>💧 Humidity</h2>
          <p style={{ fontSize: "2.5rem", color: "#66ffcc", textShadow: "0 0 15px #66ffcc" }}>
            {data.humidity !== undefined ? data.humidity : "--"} %
          </p>
        </div>

        {/* Fan RPM */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <h2>🌀 Fan RPM</h2>
          <p style={{ fontSize: "2.5rem", color: "#ffcc00", textShadow: "0 0 15px #ffcc00" }}>
            {data.fan_rpm !== undefined ? data.fan_rpm : "--"}
          </p>
        </div>

        {/* Gas */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <h2>🧪 Gas</h2>
          <p style={{ fontSize: "2.5rem", color: "#ff6699", textShadow: "0 0 15px #ff6699" }}>
            {data.gas_percent !== undefined ? data.gas_percent.toFixed(2) : "--"} %
          </p>
        </div>

        {/* Fan Status */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <h2>🌀 Fan Status</h2>
          <span style={statusStyle(data.fan === 1)}>
            {data.fan === 1 ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ marginTop: "50px", background: "#1a1a1a", padding: "20px", borderRadius: "15px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Timestamp */}
      <p style={{ textAlign: "center", marginTop: "30px", fontSize: "1rem", opacity: 0.7 }}>
        ⏱ Last update: {data.timestamp ?? "--"}
      </p>
    </div>
  );
}

export default App;
