// src/app/api/download/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get("file");
  const filename = url.searchParams.get("name") || "materi.pdf";

  if (!file) {
    return NextResponse.json({ error: "File URL missing" }, { status: 400 });
  }

  const res = await fetch(file);
  const buffer = Buffer.from(await res.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length.toString(),
    }
  });
}
