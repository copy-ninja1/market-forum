import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants/route.constants";

export function NotFoundPage() {
  return (
    <EmptyState
      action={
        <Link to={ROUTES.home}>
          <Button variant="primary">Back to home</Button>
        </Link>
      }
      description="The page you requested does not exist or may have moved."
      title="Page not found"
    />
  );
}
