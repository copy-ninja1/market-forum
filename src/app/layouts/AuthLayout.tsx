import { Link, Outlet } from "react-router-dom";
import { Card } from "@heroui/react";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/route.constants";

export function AuthLayout() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
      <Link
        to={ROUTES.home}
        className="focus-ring font-display mb-8 flex items-center gap-2 text-2xl text-campus-leaf"
      >
        <img src="/favicon.svg" alt="" className="size-9" width={36} height={36} />
        {APP_NAME}
      </Link>
      <Card className="w-full max-w-md border border-campus-mist/80 bg-campus-paper/95 shadow-sm">
        <Card.Content className="p-6 md:p-8">
          <Outlet />
        </Card.Content>
      </Card>
    </div>
  );
}
