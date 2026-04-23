/**
 * Dashboard — Main logged-in view with stats, revision tabs, and quick actions
 * Shows spaced repetition buckets (yesterday / 7d / 30d)
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRevisionSolves } from "../services/api";
import type { Solve } from "../services/api";
import { FilterButton, QuestionsTable } from "../components/dashcomp";
import StatsBar from "../components/StatsBar";
import "../styles/dashboard.css";

type TimeFilter = "yesterday" | "sevenDaysAgo" | "thirtyDaysAgo";

type DashboardData = {
  yesterday: Solve[];
  sevenDaysAgo: Solve[];
  thirtyDaysAgo: Solve[];
};

export default function Dashboard() {
  const [filter, setFilter] = useState<TimeFilter>("yesterday");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSolves = async () => {
      try {
        const res = await getRevisionSolves();
        setData({
          yesterday: res.previousDay,
          sevenDaysAgo: res.previousWeek,
          thirtyDaysAgo: res.previousMonth,
        });
      } catch (e) {
        console.error(e);
        setError(
          "Failed to load solves. Are you logged in? If yes, enter your handle in the profile section."
        );
      } finally {
        setLoading(false);
      }
    };
    loadSolves();
  }, []);

  const solves = data?.[filter] ?? [];

  const title =
    filter === "sevenDaysAgo"
      ? "7 Days Ago"
      : filter === "thirtyDaysAgo"
      ? "30 Days Ago"
      : "Yesterday";

  return (
    <div className="dashboard-root" id="dashboard-page">
      <main className="dashboard-container">
        {/* Page header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Your spaced repetition revision hub</p>
        </div>

        {/* Stats bar: total solves, hours, streak */}
        <StatsBar />

        {/* Filter tabs */}
        <div className="filter-tabs">
          <FilterButton
            label="Yesterday"
            active={filter === "yesterday"}
            onClick={() => setFilter("yesterday")}
          />
          <FilterButton
            label="7 Days Ago"
            active={filter === "sevenDaysAgo"}
            onClick={() => setFilter("sevenDaysAgo")}
          />
          <FilterButton
            label="30 Days Ago"
            active={filter === "thirtyDaysAgo"}
            onClick={() => setFilter("thirtyDaysAgo")}
          />
        </div>

        {/* Problems card */}
        <div className="questions-card">
          <h2 className="questions-title">{title}</h2>

          {loading && <p className="status-text">Loading solves...</p>}
          {error && <p className="status-text error">{error}</p>}

          {!loading && !error && solves.length === 0 && (
            <p className="empty-text">
              No problems solved in this period.
            </p>
          )}

          {!loading && !error && solves.length > 0 && (
            <QuestionsTable solves={solves} title="" />
          )}
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          <Link to="/discuss" className="quick-action-link">
            <div className="quick-action-icon">💬</div>
            <div className="quick-action-label">Discussion Hub</div>
            <div className="quick-action-desc">
              Share insights & learn from peers
            </div>
          </Link>
          <Link to="/profile" className="quick-action-link">
            <div className="quick-action-icon">📊</div>
            <div className="quick-action-label">Your Profile</div>
            <div className="quick-action-desc">
              View stats & link your handle
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
