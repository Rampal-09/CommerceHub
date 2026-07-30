import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Reusable Breadcrumb Component for Account Subpages
 */
export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
      <Link to="/dashboard" className="hover:underline">
        Home
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          {item.path ? (
            <Link to={item.path} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-300 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
