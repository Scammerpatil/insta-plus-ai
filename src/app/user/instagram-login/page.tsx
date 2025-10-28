"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function SentimentPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { username, password }
      );
      localStorage.setItem("isInstaLoggedIn", "true");
      toast.success("Login successful!");
      router.push("/user/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center py-10 px-5 h-full">
      <div className="space-y-6 max-w-xl w-full bg-base-300 shadow-lg rounded-lg p-8">
        <Title
          title="Login to Instagram"
          subtitle="Access your Instagram account to analyze sentiment of comments on posts!"
        />
        <div className="flex flex-col gap-8 items-center">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Instagram Username"
            className="input input-bordered input-primary w-full px-4 py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center w-full relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Instagram Password"
              className="input input-bordered input-primary w-full px-4 py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-base-content/70 hover:text-base-content focus:outline-none"
              onClick={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {isPasswordVisible ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          <button
            className="btn btn-primary w-full py-3 px-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
