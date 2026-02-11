"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={heroStyle}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Secure Your Network with AI Intelligence
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "30px", opacity: 0.9 }}>
          Real-time anomaly detection. Smart threat monitoring.
          Advanced network security powered by Machine Learning.
        </p>

        <div>
          <button style={primaryBtn} onClick={() => router.push("/register")}>
            Get Started
          </button>

          <button style={secondaryBtn} onClick={() => router.push("/login")}>
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={featureSection}>
        <h2 style={{ marginBottom: "40px" }}>Why Choose NetSecure AI?</h2>

        <div style={cardGrid}>
          <FeatureCard
            title="Real-Time Monitoring"
            text="Continuously analyze live network traffic and detect unusual behavior instantly."
          />
          <FeatureCard
            title="AI-Powered Detection"
            text="Machine learning algorithms identify unknown threats beyond rule-based systems."
          />
          <FeatureCard
            title="Interactive Dashboard"
            text="Visual traffic graphs, anomaly scores, and detailed network insights."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* STYLES */

const heroStyle = {
  textAlign: "center",
  padding: "100px 20px",
  background: "linear-gradient(to right, #0f172a, #1e3a8a)",
  color: "white"
};

const featureSection = {
  padding: "80px 40px",
  textAlign: "center",
  background: "#f4f6f8"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
};

const primaryBtn = {
  padding: "12px 25px",
  background: "#2563eb",
  border: "none",
  color: "white",
  borderRadius: "6px",
  marginRight: "15px",
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "12px 25px",
  background: "white",
  border: "2px solid #2563eb",
  color: "#2563eb",
  borderRadius: "6px",
  cursor: "pointer"
};
