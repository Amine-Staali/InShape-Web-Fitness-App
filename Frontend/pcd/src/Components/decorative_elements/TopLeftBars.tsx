import "../../style/css/decoration.css";
function TopLeftBars() {
  return (
    <>
      <div
        className="Barre hide-barre"
        style={{
          top: "0",
          left: "8px",
          borderRadius: "0 0 25px 25px",
        }}
      ></div>
      <div
        className="Barre hide-barre"
        style={{
          top: "0",
          left: "24px",
          borderRadius: "0 0 25px 25px",
        }}
      ></div>
      <div
        className="Barre hide-barre"
        style={{
          top: "0",
          left: "40px",
          borderRadius: "0 0 25px 25px",
        }}
      ></div>
      <div
        className="Barre hide-barre"
        style={{
          top: "0",
          left: "56px",
          borderRadius: "0 0 25px 25px",
        }}
      ></div>
    </>
  );
}

export default TopLeftBars;
