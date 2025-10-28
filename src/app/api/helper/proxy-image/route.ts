import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");
    const response = await axios.get(decodeURIComponent(url!), {
      responseType: "arraybuffer",
    });
    return new NextResponse(response.data, {
      headers: {
        "Content-Type": response.headers["content-type"] || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error proxying image" },
      { status: 500 }
    );
  }
}
