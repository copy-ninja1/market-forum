import { NavLink } from "react-router-dom";
import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav.constants";

type MainNavigationProps = {
  readonly tone?: "ink" | "light";
};

export function MainNavigation({ tone = "ink" }: MainNavigationProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ",
      tone === "light"
        ? isActive
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
        : isActive
          ? "bg-campus-ink text-campus-paper"
          : "text-campus-ink/75 hover:bg-white hover:text-campus-ink",
    ].join(" ");

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navLinkClass}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
