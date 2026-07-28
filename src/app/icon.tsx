import { ImageResponse } from "next/og";

const ICONS = {
  "192": 192,
  "512": 512,
} as const;

export function generateImageMetadata() {
  return Object.entries(ICONS).map(([id, dimension]) => ({
    contentType: "image/png",
    id,
    size: { height: dimension, width: dimension },
  }));
}

export default async function Icon({
  id,
}: {
  id: Promise<string | number>;
}) {
  const iconId = String(await id) as keyof typeof ICONS;
  const dimension = ICONS[iconId];
  const markDimension = dimension * 0.708;

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
            borderRadius: dimension * 0.219,
            color: "#07111f",
            display: "flex",
            fontSize: dimension * 0.318,
            fontWeight: 900,
            height: markDimension,
            justifyContent: "center",
            letterSpacing: dimension * -0.031,
            paddingRight: dimension * 0.031,
            width: markDimension,
          }}
        >
          EF
        </div>
      </div>
    ),
    {
      height: dimension,
      width: dimension,
    },
  );
}
