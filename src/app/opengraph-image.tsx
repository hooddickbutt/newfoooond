import { ImageResponse } from "next/og";

export const alt = "NOBRAIN — The World's Least Intelligent AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070708",
          color: "#f4f1ea",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#a3a095" }}>
          SYS // EMPTY LABORATORY
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9 }}>
            NOBRAIN
          </div>
          <div style={{ marginTop: 24, fontSize: 28, letterSpacing: 4 }}>
            {"THE WORLD'S LEAST INTELLIGENT AI"}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#e4ff3a", letterSpacing: 3 }}>
          BRAIN NOT FOUND
        </div>
      </div>
    ),
    { ...size },
  );
}
