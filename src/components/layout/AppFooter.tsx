import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";

const CURRENT_YEAR = new Date().getFullYear();

export function AppFooter() {

  return (
    <footer className="mt-auto border-t border-campus-mist/80 bg-campus-paper/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-campus-ink/70 md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          © {CURRENT_YEAR} {APP_NAME}. Buy and sell safely on campus.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          <Link to={ROUTES.browse} className="focus-ring rounded-sm hover:text-campus-leaf">
            Browse listings
          </Link>
          <Link to={ROUTES.createListing} className="focus-ring rounded-sm hover:text-campus-leaf">
            Post an item
          </Link>
          <Link to={ROUTES.signIn} className="focus-ring rounded-sm hover:text-campus-leaf">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
