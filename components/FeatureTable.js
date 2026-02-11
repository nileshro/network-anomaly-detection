export default function FeatureTable({ features }) {
  if (!features) return null;

  return (
    <div style={cardStyle}>
      <h3>Live Features</h3>
      <ul>
        {Object.entries(features).map(([key, value]) => (
          <li key={key}>
            {key}: <b>{value}</b>
          </li>
        ))}
      </ul>
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
