import { NavLink } from "react-router-dom";
import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav.constants";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-ring",
    isActive
      ? "bg-campus-leaf/15 text-campus-leaf"
      : "text-campus-ink/80 hover:bg-campus-mist/60 hover:text-campus-ink",
  ].join(" ");

export function MainNavigation() {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
