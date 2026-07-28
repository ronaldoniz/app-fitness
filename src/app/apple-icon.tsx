import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07111f",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#34d399",
            borderRadius: 40,
            color: "#07111f",
            display: "flex",
            fontSize: 58,
            fontWeight: 900,
            height: 132,
            justifyContent: "center",
            letterSpacing: -6,
            paddingRight: 6,
            width: 132,
          }}
        >
          EF
        </div>
      </div>
    ),
    size,
  );
}
