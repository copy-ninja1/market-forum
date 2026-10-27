import { Alert } from "@heroui/react";
import type { SuccessMessageProps } from "@/components/ui/ui.interfaces";

export function SuccessMessage({
  message,
  title = "Success",
  className,
}: SuccessMessageProps) {
  return (
    <Alert className={className} status="success">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
