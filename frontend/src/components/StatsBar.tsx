/**
 * StatsBar — Displays key user metrics at the top of the dashboard
 * Shows: Total Problems Solved, Today's Solves, Current Streak
 */
import { useEffect, useState } from "react";
import { getStatsSummary } from "../services/api";
import "../styles/statsbar.css";

type Stats = {
  totalSolves: number;
  todayHours: number; // actually today's solves count
  streak: number;
};

const StatsBar = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatsSummary();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-bar" id="stats-bar">
      {/* Total Solved */}
      <div className="stat-card">
        <div className="stat-icon stat-icon-purple">🏆</div>
        <div className="stat-info">
          <div className="stat-value">
            {stats ? stats.totalSolves : <div className="skeleton stat-value-skeleton" />}
          </div>
          <div className="stat-label">Problems Solved</div>
        </div>
      </div>

      {/* Today's Solves */}
      <div className="stat-card">
        <div className="stat-icon stat-icon-cyan">⚡</div>
        <div className="stat-info">
          <div className="stat-value">
            {stats ? stats.todayHours : <div className="skeleton stat-value-skeleton" />}
          </div>
          <div className="stat-label">Solved Today</div>
        </div>
      </div>

      {/* Streak */}
      <div className="stat-card">
        <div className="stat-icon stat-icon-green">🔥</div>
        <div className="stat-info">
          <div className="stat-value">
            {stats ? stats.streak : <div className="skeleton stat-value-skeleton" />}
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
