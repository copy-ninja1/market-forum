import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants/route.constants";

export function ForbiddenPage() {
  return (
    <EmptyState
      action={
        <Link to={ROUTES.home}>
          <Button variant="primary">Back to home</Button>
        </Link>
      }
      description="You do not have permission to view this area. Admin tools require an administrator account."
      title="Access denied"
    />
  );
}
