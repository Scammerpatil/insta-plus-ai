import { NextRequest, NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { promisify } from "util";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export interface CommentData {
  user: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  profile_pic_url?: string;
  confidence: number;
}

const INSTAGRAM_ACCOUNT_CACHE_DIR = "tmp/instagram_account_cache";

export async function POST(req: NextRequest) {
  try {
    const { userName } = await req.json();
    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json(
        { message: "Missing Apify API token" },
        { status: 400 }
      );
    }

    const postFilePath = path.join(
      INSTAGRAM_ACCOUNT_CACHE_DIR,
      `${userName}_post.json`
    );
    const profileFilePath = path.join(
      INSTAGRAM_ACCOUNT_CACHE_DIR,
      `${userName}_profile.json`
    );
    const processedFilePath = path.join(
      INSTAGRAM_ACCOUNT_CACHE_DIR,
      `${userName}_processed.json`
    );

    // Validate request
    if (!userName) {
      return NextResponse.json(
        { message: "Instagram username is required" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(INSTAGRAM_ACCOUNT_CACHE_DIR)) {
      fs.mkdirSync(INSTAGRAM_ACCOUNT_CACHE_DIR, { recursive: true });
    }
    if (fs.existsSync(processedFilePath)) {
      const cachedData = fs.readFileSync(processedFilePath, "utf-8");
      return NextResponse.json(JSON.parse(cachedData));
    } else if (fs.existsSync(postFilePath) && fs.existsSync(profileFilePath)) {
      await execPromise(
        `py -3.12 python/profile_and_post_analysis.py "${profileFilePath}" "${postFilePath}" "${processedFilePath}"`
      );
      const cachedData = fs.readFileSync(processedFilePath, "utf-8");
      return NextResponse.json(JSON.parse(cachedData));
    } else {
      const client = new ApifyClient({
        token: process.env.APIFY_API_TOKEN,
      });

      const input = {
        directUrls: [`https://www.instagram.com/${userName}/`],
        resultsType: "posts",
        resultsLimit: 200,
      };
      const run = await client.actor("apify/instagram-scraper").call(input);

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      //   Entered The data into the cache files
      fs.writeFileSync(postFilePath, JSON.stringify(items || {}, null, 2));
      const profileInput = {
        usernames: [userName],
      };
      const profileRun = await client
        .actor("apify/instagram-profile-scraper")
        .call(profileInput);
      const { items: profileItems } = await client
        .dataset(profileRun.defaultDatasetId)
        .listItems();
      fs.writeFileSync(
        profileFilePath,
        JSON.stringify(profileItems[0] || {}, null, 2)
      );

      await execPromise(
        `py -3.12 python/profile_and_post_analysis.py "${profileFilePath}" "${postFilePath}" "${processedFilePath}"`
      );

      const responseData = JSON.parse(
        fs.readFileSync(processedFilePath, "utf-8")
      );
      return NextResponse.json(responseData);
    }
  } catch (error) {
    console.error("Error in account-analysis route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
