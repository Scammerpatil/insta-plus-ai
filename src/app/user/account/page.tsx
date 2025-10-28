"use client";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { use, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";
import toast from "react-hot-toast";
import axios from "axios";
import {
  IconAt,
  IconBubble,
  IconThumbUp,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export interface CommentData {
  user: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  profile_pic_url?: string;
  confidence: number;
}

interface AccountAnalysisResponse {
  fullName: string;
  username: string;
  biography: string;
  isBot: boolean;
  botConfidenceScore: number;
  biographySentiment: {
    sentiment: "positive" | "negative" | "neutral";
    score: number;
  };
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  totalLikes: number;
  totalComments: number;
  latestPosts: Array<{
    id: string;
    shortcode: string;
    displayUrl: string;
    alt: string;
    captionSentiment: "positive" | "negative" | "neutral";
    hashtags?: string[];
    caption: string;
    likeCount: number;
    commentCount: number;
    takenAtTimestamp: number;
  }>;
  sentimentResponse: {
    postUrl: string;
    comments: CommentData[];
    summary: {
      positive: number;
      negative: number;
      neutral: number;
    };
  }[];
}

// ---------------------
// Component
// ---------------------
export default function SentimentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [accountAnalysisResponse, setAccountAnalysisResponse] =
    useState<AccountAnalysisResponse | null>(null);

  const COLORS = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
  ];

  const PIE_COLORS = ["var(--color-success)", "var(--color-error)"];

  const handleAnalyze = async () => {
    if (!userName.trim()) {
      toast.error("Please enter a valid Instagram username.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/instagram/account-analysis`, {
        userName,
      });
      setAccountAnalysisResponse(response.data);
      toast.success("Sentiment analysis complete!");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to analyze sentiment."
      );
    } finally {
      setLoading(false);
    }
  };
  const engagementData = accountAnalysisResponse?.latestPosts.map((post) => {
    const engagementRatio =
      ((post.likeCount + post.commentCount) /
        accountAnalysisResponse.followersCount) *
      100;

    return {
      name: post.caption.slice(0, 30),
      engagementRatio: engagementRatio.toFixed(2),
      likes: post.likeCount,
      comments: post.commentCount,
    };
  });

  const pieData = [
    {
      name: `Confidence ${accountAnalysisResponse?.isBot ? "Bot" : "Human"}`,
      value: accountAnalysisResponse?.botConfidenceScore,
    },
    {
      name: `Confidence ${accountAnalysisResponse?.isBot ? "Human" : "Bot"}`,
      value: 100 - accountAnalysisResponse?.botConfidenceScore!,
    },
  ];

  if (loading) return <Loading />;
  return (
    <>
      <div className="space-y-8">
        <Title
          title="Public Instagram Account Analysis"
          subtitle={`Analyze public Instagram accounts, ${
            user?.instaUserName || "User"
          }!`}
        />

        {/* URL Input Section */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <fieldset className="input input-bordered input-primary w-full">
            <IconAt size={24} />
            <input
              value={userName}
              onChange={(e) =>
                setUserName(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-_.]/g, "")
                )
              }
              placeholder="Instagram Username..."
              className="grow"
            />
          </fieldset>
          <button
            className="btn btn-primary w-full md:w-auto"
            onClick={handleAnalyze}
          >
            Analyze
          </button>
        </div>
      </div>
      {accountAnalysisResponse && (
        <div className="space-y-10 mt-10 animate-fade-in">
          {/* ---------- Profile Overview ---------- */}
          <div className="bg-base-200 shadow-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={`/api/helper/proxy-image?url=${encodeURI(
                    encodeURIComponent(accountAnalysisResponse.profilePicUrl)
                  )}`}
                  alt={accountAnalysisResponse.fullName}
                  className="mask mask-circle w-32 h-32 border-4 border-primary shadow-md"
                />
                <div className="flex-1 space-y-2">
                  <h2 className="text-3xl font-bold text-primary">
                    @{accountAnalysisResponse.username}
                  </h2>
                  <p className="text-lg font-semibold">
                    {accountAnalysisResponse.fullName}
                  </p>
                  <p className="text-sm opacity-80">
                    {accountAnalysisResponse.biography
                      .split("\n")
                      .map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                  </p>

                  {/* Bio Sentiment */}
                  <div className="mt-2">
                    <div className="badge badge-outline badge-lg">
                      Bio Sentiment:{" "}
                      <span
                        className={`ml-2 font-bold ${
                          accountAnalysisResponse.biographySentiment
                            .sentiment === "positive"
                            ? "text-success"
                            : accountAnalysisResponse.biographySentiment
                                .sentiment === "negative"
                            ? "text-error"
                            : "text-warning"
                        }`}
                      >
                        {accountAnalysisResponse.biographySentiment.sentiment.toUpperCase()}{" "}
                        (
                        {(
                          accountAnalysisResponse.biographySentiment.score * 100
                        ).toFixed(2)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-primary mb-4">
                  Profile Sentiment Analysis
                </h1>
                <p className="text-lg text-center text-secondary mb-2">
                  Is this account a bot? Check out the analysis below!
                </p>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={80}
                        outerRadius={120}
                        startAngle={180}
                        endAngle={0}
                        cx={"50%"}
                        cy={"50%"}
                        animationDuration={500}
                        className="-mb-20"
                      >
                        {PIE_COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="-mt-28">
                  <span
                    className={`${
                      accountAnalysisResponse.isBot
                        ? "text-error"
                        : "text-success"
                    } font-bold text-lg mt-3`}
                  >
                    {accountAnalysisResponse.isBot
                      ? `Bot Confidence: ${accountAnalysisResponse.botConfidenceScore}%`
                      : "No Bot Detected"}
                  </span>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="stats stats-vertical md:stats-horizontal shadow mt-3 bg-base-100 w-full overflow-y-auto">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <IconUsers size={32} />
                </div>
                <div className="stat-title">Followers</div>
                <div className="stat-value text-primary">
                  {accountAnalysisResponse.followersCount}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <IconUsersGroup size={32} />
                </div>
                <div className="stat-title">Following</div>
                <div className="stat-value text-secondary">
                  {accountAnalysisResponse.followsCount}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-accent">
                  <IconThumbUp size={32} />
                </div>
                <div className="stat-title">Total Likes</div>
                <div className="stat-value text-accent">
                  {accountAnalysisResponse.totalLikes}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-info">
                  <IconBubble size={32} />
                </div>
                <div className="stat-title">Total Comments</div>
                <div className="stat-value text-info">
                  {accountAnalysisResponse.totalComments}
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <div className="avatar avatar-online">
                    <div className="w-16 rounded-full">
                      <img src={user?.profileImage} alt={user?.name} />
                    </div>
                  </div>
                </div>
                <div className="stat-value text-warning">
                  {(
                    ((accountAnalysisResponse.totalComments +
                      accountAnalysisResponse.totalLikes) /
                      (accountAnalysisResponse.followersCount +
                        accountAnalysisResponse.latestPosts.length)) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                <div className="stat-title">Engagement Ratio</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-base-200 shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center uppercase">
                Overall Comment Sentiment
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Positive",
                        value: accountAnalysisResponse.sentimentResponse.reduce(
                          (a, b) => a + b.summary.positive,
                          0
                        ),
                      },
                      {
                        name: "Negative",
                        value: accountAnalysisResponse.sentimentResponse.reduce(
                          (a, b) => a + b.summary.negative,
                          0
                        ),
                      },
                      {
                        name: "Neutral",
                        value: accountAnalysisResponse.sentimentResponse.reduce(
                          (a, b) => a + b.summary.neutral,
                          0
                        ),
                      },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-base-200 shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center uppercase">
                Engagement Ratio per Post
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagementRatio" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------- Latest Posts ---------- */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Latest Posts</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {accountAnalysisResponse.latestPosts.map((post, index) => (
                <div
                  key={post.id || index}
                  className="card bg-base-200 shadow-md overflow-hidden"
                >
                  <figure>
                    <img
                      src={`/api/helper/proxy-image?url=${encodeURI(
                        encodeURIComponent(post.displayUrl)
                      )}`}
                      alt={post.alt || "Post image"}
                      className="w-full h-64 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h4 className="card-title truncate">
                      {post.caption.slice(0, 80)}...
                    </h4>
                    <p className="text-sm opacity-70">
                      Likes: <b>{post.likeCount}</b> | Comments:{" "}
                      <b>{post.commentCount}</b>
                    </p>
                    <div
                      className={`badge ${
                        post.captionSentiment === "positive"
                          ? "badge-success"
                          : post.captionSentiment === "negative"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {post.captionSentiment.toUpperCase()}
                    </div>
                    <a
                      href={`https://www.instagram.com/p/${post.shortcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm mt-3"
                    >
                      View on Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Post Comment Breakdown ---------- */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Comment Sentiment Breakdown</h3>
            {accountAnalysisResponse.sentimentResponse.map((post, idx) => (
              <div
                key={idx}
                className="collapse collapse-arrow bg-base-200 shadow"
              >
                <input type="checkbox" />
                <div className="collapse-title text-lg font-semibold flex justify-between">
                  <span>Post {idx + 1}</span>
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    View Post
                  </a>
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="stat">
                      <div className="stat-title">Positive</div>
                      <div className="stat-value text-success">
                        {post.summary.positive}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Negative</div>
                      <div className="stat-value text-error">
                        {post.summary.negative}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Neutral</div>
                      <div className="stat-value text-warning">
                        {post.summary.neutral}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-72 space-y-3">
                    {post.comments.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-base-100 rounded-lg shadow-sm"
                      >
                        <img
                          src={`/api/helper/proxy-image?url=${encodeURI(
                            encodeURIComponent(c.profile_pic_url!)
                          )}`}
                          alt={c.user}
                          className="mask mask-circle w-10 h-10"
                        />
                        <div>
                          <p className="font-semibold">@{c.user}</p>
                          <p className="text-sm">{c.text}</p>
                          <div
                            className={`badge mt-1 ${
                              c.sentiment === "positive"
                                ? "badge-success"
                                : c.sentiment === "negative"
                                ? "badge-error"
                                : "badge-warning"
                            }`}
                          >
                            {c.sentiment.toUpperCase()} ({c.confidence})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
