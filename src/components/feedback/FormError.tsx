import { Alert } from "@heroui/react";
import type { FormErrorProps } from "@/components/ui/ui.interfaces";

export function FormError({ message, title = "Could not complete that action", className }: FormErrorProps) {
  return (
    <Alert className={className} status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
