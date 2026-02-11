"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ScoreGraph({ history }) {
  if (!history || history.length === 0) return null;

  const threshold = -0.1;

  const data = {
    labels: history.map(h => h.time),
    datasets: [
      {
        label: "Anomaly Score",
        data: history.map(h => h.score),
        borderColor: "orange",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: history.map(h =>
          h.score < threshold ? "red" : "orange"
        ),
        pointRadius: history.map(h =>
          h.score < threshold ? 6 : 3
        )
      },
      {
        label: "Threshold",
        data: history.map(() => threshold),
        borderColor: "red",
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0
      }
    ]
  };

  return (
    <div style={cardStyle}>
      <h3>Anomaly Score Trend</h3>
      <Line data={data} />
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
};
