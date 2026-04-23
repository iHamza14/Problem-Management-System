/**
 * Profile Page — User profile with CF rating and solve histogram
 * Updated for new schema: handle/rating from API, no study hours widget
 */
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "../axios";
import "../styles/profile.css";

type User = {
  handle?: string | null;
  rating?: number | null;
  email?: string;
};

type HistogramResponse = {
  data: number[];
};

/* CF rank color mapping */
function getCfRank(rating?: number | null) {
  if (rating == null) return { title: "Unrated", color: "#6b6b80" };
  if (rating >= 2900) return { title: "Legendary Grandmaster", color: "#ff0000" };
  if (rating >= 2600) return { title: "International Grandmaster", color: "#ff0000" };
  if (rating >= 2400) return { title: "Grandmaster", color: "#ff0000" };
  if (rating >= 2300) return { title: "International Master", color: "#ff8c00" };
  if (rating >= 2200) return { title: "Master", color: "#ff8c00" };
  if (rating >= 1900) return { title: "Candidate Master", color: "#a0a" };
  if (rating >= 1600) return { title: "Expert", color: "#0000ff" };
  if (rating >= 1400) return { title: "Specialist", color: "#03a89e" };
  if (rating >= 1200) return { title: "Pupil", color: "#008000" };
  return { title: "Newbie", color: "#808080" };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [histogram, setHistogram] = useState<number[]>([]);

  /* Fetch user info */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/api/auth/me");
        setUser(res.data);
        setHandle(res.data.handle ?? "");
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  /* Fetch histogram when handle exists */
  useEffect(() => {
    if (!user?.handle) return;
    const fetchHistogram = async () => {
      try {
        const res = await api.get<HistogramResponse>("/api/stats/histogram", {
          withCredentials: true,
        });
        setHistogram(res.data.data);
      } catch (err) {
        console.error("Histogram fetch failed", err);
      }
    };
    fetchHistogram();
  }, [user?.handle]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "64px" }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "64px" }}>
            Not authenticated. Please sign in.
          </p>
        </div>
      </div>
    );
  }

  const rankInfo = getCfRank(user.rating);

  const histogramData = histogram.map((count, index) => ({
    day: `${30 - index}d`,
    solved: count,
  }));

  /* Submit handle */
  const handleSubmit = async () => {
    try {
      await api.post("/api/handle", { handle });
      const res = await api.get<User>("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Handle submit failed", err);
    }
  };

  /* Refresh — re-sync solves */
  const refreshProfile = async () => {
    try {
      const res = await api.get<{ rating: number }>("/api/refresh/user");
      setUser((prev) =>
        prev ? { ...prev, rating: res.data.rating } : prev
      );
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  return (
    <div className="profile-page" id="profile-page">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-info">
            {user.handle ? (
              <div className="handle-row">
                <div>
                  <h1 className="handle">
                    <a
                      href={`https://codeforces.com/profile/${user.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: rankInfo.color }}
                    >
                      {rankInfo.title === "Legendary Grandmaster" ? (
                        <>
                          <span style={{ color: "red" }}>{user.handle![0]}</span>
                          {user.handle!.slice(1)}
                        </>
                      ) : (
                        user.handle
                      )}
                    </a>
                  </h1>
                  <p className="rank" style={{ color: rankInfo.color }}>
                    {rankInfo.title}
                  </p>
                </div>
                <button className="refresh-btn" onClick={refreshProfile}>
                  ↻ Refresh
                </button>
              </div>
            ) : (
              <div className="handle-row">
                <input
                  type="text"
                  className="handle-input"
                  placeholder="Enter your Codeforces handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!handle.trim()}
                >
                  Submit
                </button>
              </div>
            )}

            <div className="stats">
              <div className="stat">
                <p className="label">Rating</p>
                <p className="value">{user.rating ?? "—"}</p>
              </div>
              <div className="stat">
                <p className="label">Email</p>
                <p className="value email">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Histogram */}
        <div className="graph-card">
          <h2 className="graph-title">Problems Solved (Last 30 Days)</h2>
          <div className="graph-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={histogramData}>
                <XAxis dataKey="day" hide />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#6b6b80", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#f0f0f5",
                  }}
                />
                <Bar
                  dataKey="solved"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
