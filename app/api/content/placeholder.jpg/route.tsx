import { NextResponse } from "next/server";

export async function GET() {
  // Return a simple SVG placeholder
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect width="600" height="400" fill="#f5f5f5"/>
      <text x="50%" y="50%" font-size="20" fill="#999" text-anchor="middle" dominant-baseline="middle" font-family="Arial">
        Image Not Available
      </text>
    </svg>
  `;

  return new NextResponse(svgContent, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      "Access-Control-Allow-Origin": "*",
    },
  });
}
