import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";
import { BrandMark } from "@/components/layout/BrandMark";

const CURRENT_YEAR = new Date().getFullYear();

export function AppFooter() {
  return (
    <footer className="mt-auto bg-campus-ink text-campus-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <BrandMark className="bg-campus-paper text-campus-ink" />
            <p className="font-display text-xl">{APP_NAME}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-campus-paper/75">
            A structured board for campus listings. Browse what is available,
            post what you are finished with, and contact sellers directly.
          </p>
        </div>

        <nav aria-label="Explore" className="space-y-3 text-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-paper/50">
            Explore
          </p>
          <ul className="space-y-2">
            <li>
              <Link className=" rounded-sm hover:text-white" to={ROUTES.browse}>
                Browse listings
              </Link>
            </li>
            <li>
              <Link
                className=" rounded-sm hover:text-white"
                to={ROUTES.createListing}
              >
                Post an item
              </Link>
            </li>
            <li>
              <Link className=" rounded-sm hover:text-white" to={ROUTES.signIn}>
                Sign in
              </Link>
            </li>
            <li>
              <Link className=" rounded-sm hover:text-white" to={ROUTES.signUp}>
                Create an account
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3 text-sm text-campus-paper/75">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-paper/50">
            Before you meet
          </p>
          <p className="leading-relaxed">
            Listings are posted by community members. They are not
            identity-verified and this marketplace does not handle payment or
            delivery.
          </p>
          <p>
            Meet in a public campus place and keep the conversation on the
            contact method shown.
          </p>
        </div>
      </div>
      <div className="bg-white/5">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-campus-paper/55 md:px-6">
          © {CURRENT_YEAR} {APP_NAME}. Editorial photography on the marketing
          pages is used for atmosphere, not as live inventory.
        </p>
      </div>
    </footer>
  );
}
