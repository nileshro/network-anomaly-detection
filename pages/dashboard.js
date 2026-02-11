"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FeatureTable from "../components/FeatureTable";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PacketGraph from "../components/PacketGraph";
import ScoreGraph from "../components/ScoreGraph";
import StatusCard from "../components/StatusCard";
import TrafficGraph from "../components/TrafficGraph";

export default function Dashboard() {
  const router = useRouter();

  const [result, setResult] = useState("");
  const [score, setScore] = useState(null);
  const [features, setFeatures] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("https://network-anomaly-detection-r6p9.onrender.com", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      setResult(data.result);
      setScore(data.anomaly_score);
      setFeatures(data.features);

      if (data.features) {
        setHistory(prev => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            traffic: data.features.traffic_total || 0,
            packetRate: data.features.packet_rate || 0,
            score: data.anomaly_score
          }
        ]);
      }

      setLoading(false);

    } catch (error) {
      console.error("Fetch error:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetchLiveData();
      const interval = setInterval(fetchLiveData, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const containerStyle = {
    padding: "40px",
    fontFamily: "Segoe UI",
    background: "#f4f6f8",
    minHeight: "100vh"
  };

  const headerStyle = {
    marginBottom: "30px"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  };

  const statsBar = {
    display: "flex",
    gap: "20px",
    marginBottom: "30px"
  };

  const statCard = {
    flex: 1,
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  };

  return (
    <>
      <Navbar />

      <div style={containerStyle}>
        {/* DASHBOARD HEADER */}
        <div style={headerStyle}>
          <h1>Network Security Dashboard</h1>
          <p>Real-time AI-driven anomaly monitoring system</p>
        </div>

        {/* QUICK STATS */}
        <div style={statsBar}>
          <div style={statCard}>
            <h3>Status</h3>
            <p>{loading ? "Loading..." : result}</p>
          </div>

          <div style={statCard}>
            <h3>Anomaly Score</h3>
            <p>{score !== null ? score : "Loading..."}</p>
          </div>

          <div style={statCard}>
            <h3>Traffic Samples</h3>
            <p>{history.length}</p>
          </div>
        </div>

        {/* STATUS CARD */}
        <StatusCard result={result} score={score} loading={loading} />

        {/* TRAFFIC GRAPHS */}
        <div style={gridStyle}>
          <TrafficGraph history={history} />
          <PacketGraph history={history} />
        </div>

        {/* SCORE GRAPH */}
        <ScoreGraph history={history} />

        {/* FEATURE TABLE */}
        <FeatureTable features={features} />
      </div>

      <Footer />
    </>
  );
}
