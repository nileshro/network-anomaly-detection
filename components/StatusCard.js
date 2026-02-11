export default function StatusCard({ result, score, loading }) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <h2>Loading network data...</h2>
      </div>
    );
  }


  return (
    <div style={{
      ...cardStyle,
      borderLeft: result === "Anomaly"
        ? "6px solid red"
        : "6px solid green"
    }}>
      <h2>
        Status:
        <span style={{
          marginLeft: "10px",
          color: result === "Anomaly" ? "red" : "green"
        }}>
          {result}
        </span>
      </h2>

      <p>Anomaly Score: <b>{score}</b></p>

      {score < -0.1 &&
        <div style={alertStyle}>
          ⚠ Suspicious network behavior detected!
        </div>
      }
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

const alertStyle = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#ffe6e6",
  color: "red",
  borderRadius: "5px"
};
