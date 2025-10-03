import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "./firebase";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function StatusCard({ label, value, isOn, icon }) {
  return (
    <div className="status-card">
      <div className="icon">{icon}</div>
      <div className="info">
        <span className="label">{label}</span>
        {value && <span className="value">{value}</span>}
        <span className={`badge ${isOn ? "on" : "off"}`}>
          {isOn ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const latestRef = ref(db, "/incubator/latest");
    onValue(latestRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setHistory((prev) => [...prev.slice(-29), val]); // keep 30 points
      }
    });
  }, []);

  const chartData = {
    labels: history.map((d) => d.timestamp || ""),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.map((d) => d.temperature),
        borderColor: "#ff4d6d",
        backgroundColor: "rgba(255,77,109,0.2)",
        tension: 0.4,
      },
      {
        label: "Humidity (%)",
        data: history.map((d) => d.humidity),
        borderColor: "#4dabf7",
        backgroundColor: "rgba(77,171,247,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard">
      <header>
        <h1>🌡️ Smart Incubator</h1>
        <p>Real-time Monitoring & Control</p>
      </header>

      <div className="card-grid">
        <StatusCard label="Temperature" value={`${data.temperature} °C`} isOn icon="🌡️" />
        <StatusCard label="Humidity" value={`${data.humidity} %`} isOn icon="💧" />
        <StatusCard label="Heater" isOn={!!data.heater} icon="🔥" />
        <StatusCard label="Fan" isOn={!!data.fan} icon="🌀" />
        <StatusCard label="Dehumidifier" isOn={!!data.dehumidifier} icon="💨" />
      </div>

      <div className="chart-section">
        <h2>📊 Environment Trends</h2>
        <Line data={chartData} />
      </div>

      <footer>
        <p>Incubator IoT Dashboard • Powered by Firebase + ESP32</p>
      </footer>
    </div>
  );
}

export default App;
