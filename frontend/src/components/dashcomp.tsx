/**
 * Dashboard Components — Filter buttons and problem list
 * Updated for new schema: Solve has .problem.title/.problem.url
 */
import type { Solve } from "../services/api";

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

/** Gradient-style filter tab button */
export const FilterButton = ({ label, active, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`filter-button ${active ? "active" : ""}`}
  >
    {label}
  </button>
);

type QuestionsTableProps = {
  solves: Solve[];
  title: string;
};

/** Problem list displayed as styled cards */
export const QuestionsTable = ({ solves, title }: QuestionsTableProps) => {
  if (solves.length === 0) {
    return (
      <p className="empty-text">
        No problems solved in this period. Keep grinding! 💪
      </p>
    );
  }

  return (
    <div>
      {title && <h2 className="questions-title">{title}</h2>}
      <ul className="questions-list">
        {solves.map((s) => (
          <li key={s.id} className="question-item">
            <a
              href={s.problem.url}
              target="_blank"
              rel="noreferrer"
              className="question-link"
            >
              <div className="question-code">{s.problem.title}</div>
              <div className="question-time">
                {s.problem.externalId} • {s.problem.platform.name}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
