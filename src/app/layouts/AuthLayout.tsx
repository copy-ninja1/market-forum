import { Link, Outlet } from "react-router-dom";
import { APP_NAME } from "@/constants/app.constants";
import { MARKET_IMAGES } from "@/constants/marketing.constants";
import { ROUTES } from "@/constants/route.constants";
import { BrandMark } from "@/components/layout/BrandMark";
import { ParallaxLayer } from "@/components/marketing/ParallaxLayer";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-campus-paper lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-campus-ink lg:block">
        <ParallaxLayer className="absolute -inset-y-32 inset-x-0" speed={0.1}>
          <img
            alt=""
            className="size-full object-cover opacity-80"
            height={1200}
            src={MARKET_IMAGES.auth}
            width={900}
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-gradient-to-t from-campus-ink via-campus-ink/55 to-campus-ink/20" />
        <div className="relative flex h-full flex-col justify-between p-10 text-campus-paper">
          <Link
            to={ROUTES.home}
            className=" flex w-fit items-center gap-2.5 rounded-md"
          >
            <BrandMark className="bg-campus-paper text-campus-ink" />
            <span className="font-display text-xl">{APP_NAME}</span>
          </Link>
          <div className="max-w-md">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              For the campus
            </p>
            <p className="font-display mt-3 text-4xl leading-tight tracking-tight">
              A clearer way to pass things on.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Post a listing with a price, a photo, and the contact method you
              want people to use. Buyers reach you directly.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col justify-center px-5 py-10 md:px-12">
        <Link
          to={ROUTES.home}
          className=" mb-8 flex w-fit items-center gap-2.5 text-campus-ink lg:hidden"
        >
          <BrandMark />
          <span className="font-display text-xl">{APP_NAME}</span>
        </Link>
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
