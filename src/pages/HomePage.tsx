import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { ParallaxLayer } from "@/components/marketing/ParallaxLayer";
import { APP_NAME } from "@/constants/app.constants";
import {
  MARKET_IMAGES,
  MARKET_LANES,
  POPULAR_SEARCHES,
} from "@/constants/marketing.constants";
import { ROUTES } from "@/constants/route.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DocumentHead, homePageSeo, useSiteSeoConfig } from "@/seo";

const STEPS = [
  {
    index: "01",
    title: "Search the board",
    copy: "Filter by category, availability, and price. Every public listing shows the details in the same place.",
  },
  {
    index: "02",
    title: "Contact the seller",
    copy: "Use the email, phone, or note the seller chose to publish. There is no in-app checkout.",
  },
  {
    index: "03",
    title: "Close it on campus",
    copy: "Meet in a public spot, then the owner can mark the listing sold or take it down.",
  },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { appName, siteUrl } = useSiteSeoConfig();
  const [query, setQuery] = useState("");
  const postTarget = isAuthenticated ? ROUTES.createListing : ROUTES.signIn;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `${ROUTES.browse}?q=${encodeURIComponent(term)}` : ROUTES.browse);
  };

  return (
    <div>
      <DocumentHead seo={homePageSeo(siteUrl, appName)} />
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-campus-ink text-campus-paper">
        <ParallaxLayer className="absolute -inset-y-40 inset-x-0" speed={0.16}>
          <img
            alt=""
            className="size-full object-cover"
            height={1400}
            src={MARKET_IMAGES.hero}
            width={2000}
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-gradient-to-r from-campus-ink via-campus-ink/78 to-campus-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-campus-ink/80 via-transparent to-campus-ink/30" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-36 md:px-6 md:pb-20">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/75">
            {APP_NAME}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[0.95] tracking-tight md:text-7xl">
            Sell what you are done with. Find what you need next.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            A campus board for textbooks, gear, and dorm essentials — with a
            price, a condition, and a way to reach the person who posted it.
          </p>

          <form className="mt-8 max-w-2xl" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="home-search">
              Search listings
            </label>
            <div className="flex flex-col gap-2 rounded-full bg-white p-2 shadow-2xl sm:flex-row sm:items-center">
              <input
                className="h-12 w-full rounded-full bg-transparent px-5 text-base text-campus-ink outline-none placeholder:text-campus-ink/40"
                id="home-search"
                placeholder="Search textbooks, bikes, desks…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className=" h-12 shrink-0 rounded-full bg-campus-ink px-6 text-sm font-semibold text-campus-paper"
                type="submit"
              >
                Search listings
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">Popular</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  className=" rounded-full bg-white/10 px-3 py-1 text-white/90 hover:bg-white/15"
                  to={`${ROUTES.browse}?q=${encodeURIComponent(term)}`}
                >
                  {term}
                </Link>
              ))}
            </div>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ROUTES.browse}>
              <Button
                className="bg-white text-campus-ink"
                size="lg"
                variant="secondary"
              >
                Browse the board
              </Button>
            </Link>
            <Link
              to={postTarget}
              state={
                isAuthenticated ? undefined : { from: ROUTES.createListing }
              }
            >
              <Button
                className="bg-white/10 text-white"
                size="lg"
                variant="tertiary"
              >
                {isAuthenticated ? "Post a listing" : "Sign in to post"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3 md:px-6 md:py-10">
        {[
          [
            "Direct contact",
            "No checkout, fees, or delivery promises. You talk to the seller.",
          ],
          [
            "Same details every time",
            "Price, condition, location, and photos sit in one listing.",
          ],
          [
            "Moderated reports",
            "Suspicious posts can be flagged for an administrator to review.",
          ],
        ].map(([title, copy]) => (
          <article key={title} className="px-2 py-2 md:px-0">
            <h2 className="font-display text-2xl tracking-tight text-campus-ink">
              {title}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-campus-ink/70">
              {copy}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-campus-leaf">
              Start here
            </p>
            <h2 className="font-display mt-2 text-4xl tracking-tight text-campus-ink md:text-5xl">
              What students trade most
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-campus-ink/70">
            These lanes open a search. Live results depend on what members have
            posted.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKET_LANES.map((lane, index) => (
            <li key={lane.title}>
              <Link
                className=" group block overflow-hidden rounded-3xl bg-campus-ink"
                to={`${ROUTES.browse}?q=${encodeURIComponent(lane.query)}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <ParallaxLayer
                    className="absolute -inset-y-16 inset-x-0"
                    speed={0.05 + index * 0.02}
                  >
                    <img
                      alt=""
                      className="size-full scale-110 object-cover transition duration-500 group-hover:scale-125"
                      height={900}
                      src={lane.image}
                      width={700}
                    />
                  </ParallaxLayer>
                  <div className="absolute inset-0 bg-gradient-to-t from-campus-ink via-campus-ink/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-campus-paper">
                    <h3 className="font-display text-3xl tracking-tight">
                      {lane.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">{lane.caption}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <ParallaxLayer
              className="absolute -inset-y-16 inset-x-0"
              speed={0.08}
            >
              <img
                alt="Students gathered around a table on campus"
                className="size-full object-cover"
                height={1000}
                src={MARKET_IMAGES.students}
                width={1400}
              />
            </ParallaxLayer>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-campus-leaf">
              How it works
            </p>
            <h2 className="font-display mt-2 text-4xl tracking-tight text-campus-ink md:text-5xl">
              Three steps. No extra product around them.
            </h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((step) => (
                <li
                  key={step.index}
                  className="grid grid-cols-[auto_1fr] gap-4"
                >
                  <span className="font-display text-2xl text-campus-copper">
                    {step.index}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-campus-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-campus-ink/70">
                      {step.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-campus-ink text-campus-paper">
        <ParallaxLayer className="absolute -inset-y-40 inset-x-0" speed={0.12}>
          <img
            alt=""
            className="size-full object-cover opacity-50"
            height={1100}
            src={MARKET_IMAGES.quad}
            width={1800}
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-campus-ink/65" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-28">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              For sellers
            </p>
            <h2 className="font-display mt-3 max-w-xl text-4xl tracking-tight md:text-6xl">
              Clear the room before the next move-out.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
              A listing takes a title, price, category, condition, location, and
              the contact method you are comfortable sharing.
            </p>
            <div className="mt-8">
              <Link
                to={postTarget}
                state={
                  isAuthenticated ? undefined : { from: ROUTES.createListing }
                }
              >
                <Button
                  className="bg-white text-campus-ink"
                  size="lg"
                  variant="secondary"
                >
                  {isAuthenticated
                    ? "Post a listing"
                    : "Create an account to post"}
                </Button>
              </Link>
            </div>
          </div>
          <ul className="grid content-end gap-3 text-sm">
            {[
              [
                MARKET_IMAGES.headphones,
                "Show the item",
                "Up to five photos, checked for type and size.",
              ],
              [
                MARKET_IMAGES.desk,
                "Name the campus spot",
                "A location label helps buyers know where to meet.",
              ],
              [
                MARKET_IMAGES.sneakers,
                "Update the status",
                "Mark it sold or unavailable when it is gone.",
              ],
            ].map(([image, title, copy]) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm"
              >
                <img
                  alt=""
                  className="size-16 rounded-xl object-cover"
                  height={64}
                  src={image}
                  width={64}
                />
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-white/75">{copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
