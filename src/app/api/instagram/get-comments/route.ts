import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const execPromise = promisify(exec);

const COMMENTS_CACHE_DIR = path.join(process.cwd(), "tmp", "comments_cache");
const SENTIMENT_CACHE_DIR = path.join(process.cwd(), "tmp", "sentiment_cache");

if (!fs.existsSync(COMMENTS_CACHE_DIR)) {
  fs.mkdirSync(COMMENTS_CACHE_DIR, { recursive: true });
}
if (!fs.existsSync(SENTIMENT_CACHE_DIR)) {
  fs.mkdirSync(SENTIMENT_CACHE_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const { postUrl } = await req.json();
    const shortCode = postUrl.split("/p/")[1].split("/")[0];
    const commentsFilePath = path.join(COMMENTS_CACHE_DIR, `${shortCode}.json`);
    const sentimentFilePath = path.join(
      SENTIMENT_CACHE_DIR,
      `${shortCode}.json`
    );

    // 1️⃣ Check Sentiment Cache
    if (fs.existsSync(sentimentFilePath)) {
      console.log("Using cached sentiment analysis...");
      const cachedData = JSON.parse(
        fs.readFileSync(sentimentFilePath, "utf-8")
      );
      const summary = {
        positive: cachedData.filter((c: any) => c.sentiment === "positive")
          .length,
        negative: cachedData.filter((c: any) => c.sentiment === "negative")
          .length,
        neutral: cachedData.filter((c: any) => c.sentiment === "neutral")
          .length,
      };
      return NextResponse.json({ postUrl, comments: cachedData, summary });
    }

    // 2️⃣ Fetch comments if not cached
    if (!fs.existsSync(commentsFilePath)) {
      console.log("Fetching comments for the first time...");
      const url = `https://instagram-data1.p.rapidapi.com/comments?post=${encodeURIComponent(
        postUrl
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.INSTAGRAM_RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "instagram-data1.p.rapidapi.com",
        },
      });
      const data = await response.json();
      if (!data.collector) {
        console.log(data);
        return NextResponse.json(
          { error: "Failed to fetch comments." },
          { status: 500 }
        );
      }

      fs.writeFileSync(
        commentsFilePath,
        JSON.stringify(data.collector, null, 2)
      );
    }

    // 3️⃣ Run Sentiment Analysis
    await execPromise(
      `py -3.12 python/sentiment_analysis.py "${commentsFilePath}" "${sentimentFilePath}"`
    );

    const data = JSON.parse(fs.readFileSync(sentimentFilePath, "utf-8"));
    const summary = {
      positive: data.filter((c: any) => c.sentiment === "positive").length,
      negative: data.filter((c: any) => c.sentiment === "negative").length,
      neutral: data.filter((c: any) => c.sentiment === "neutral").length,
    };

    return NextResponse.json({ postUrl, comments: data, summary });
  } catch (error) {
    console.error("Error in POST /api/instagram/get-comments:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
