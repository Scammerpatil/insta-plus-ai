"use client";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import axios from "axios";

// ---------------------
// Interfaces
// ---------------------
export interface CommentData {
  user: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  profile_pic_url?: string;
  confidence: number;
}

export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
}

export interface SentimentResponse {
  postUrl: string;
  comments: CommentData[];
  summary: SentimentSummary;
}

// ---------------------
// Component
// ---------------------
export default function SentimentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [sentimentResponse, setSentimentResponse] =
    useState<SentimentResponse | null>(null);

  const COLORS = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid Instagram post URL.");
      return;
    }

    setLoading(true);
    setSentimentResponse(null);

    try {
      const response = await axios.post(`/api/instagram/get-comments`, {
        postUrl: url.trim(),
        username: user?.instaUserName,
      });

      const data: SentimentResponse = response.data;
      setSentimentResponse(data);
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

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <Title
        title="Instagram Sentiment Analysis"
        subtitle={`Analyze sentiment of comments on any public post, ${
          user?.instaUserName || "User"
        }!`}
      />

      {/* URL Input Section */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
        <input
          value={url}
          onChange={(e) =>
            setUrl(
              e.target.value.trim().endsWith("/")
                ? e.target.value.trim().slice(0, -1)
                : e.target.value.trim()
            )
          }
          placeholder="Paste Instagram Post URL..."
          className="input input-bordered input-primary w-full md:w-1/2"
        />

        <input
          type="text"
          value={user?.instaUserName || ""}
          readOnly
          placeholder="Instagram Username"
          className="input input-bordered input-secondary w-full md:w-1/4"
        />

        <button
          className="btn btn-primary w-full md:w-auto"
          onClick={handleAnalyze}
        >
          Analyze
        </button>
      </div>

      {/* Chart Section */}
      {sentimentResponse && (
        <div className="card bg-base-200 shadow-md p-6">
          <h3 className="text-lg font-bold text-center mb-3">
            Sentiment Distribution
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    {
                      name: "Positive",
                      value: sentimentResponse.summary.positive,
                    },
                    {
                      name: "Negative",
                      value: sentimentResponse.summary.negative,
                    },
                    {
                      name: "Neutral",
                      value: sentimentResponse.summary.neutral,
                    },
                  ]}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  label
                >
                  {[
                    sentimentResponse.summary.positive,
                    sentimentResponse.summary.negative,
                    sentimentResponse.summary.neutral,
                  ].map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Comments Table */}
      {sentimentResponse && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-300">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Comment</th>
                <th>Sentiment</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {sentimentResponse.comments.map((c, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td className="flex items-center gap-3">
                    {c.profile_pic_url && (
                      <img
                        src={`/api/helper/proxy-image?url=${encodeURI(encodeURIComponent(
                          c.profile_pic_url
                        ))}`}
                        alt={c.user}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="font-semibold">{c.user}</span>
                  </td>
                  <td>{c.text}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.sentiment === "positive"
                          ? "badge-success"
                          : c.sentiment === "negative"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {c.sentiment}
                    </span>
                  </td>
                  <td>{(c.confidence * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
