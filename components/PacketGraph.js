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

// ✅ REGISTER SCALES HERE
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PacketGraph({ history }) {
  const data = {
    labels: history.map(h => h.time),
    datasets: [{
      label: "Packet Rate",
      data: history.map(h => h.packetRate),
      borderWidth: 2,
      tension: 0.4
    }]
  };

  return (
    <div style={cardStyle}>
      <h3>Packet Rate</h3>
      <Line data={data} />
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
};
