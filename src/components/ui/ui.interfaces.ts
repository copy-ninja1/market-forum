import type { ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export type LoadingStateProps = {
  message?: string;
  className?: string;
  fullScreen?: boolean;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isConfirmLoading?: boolean;
  isDestructive?: boolean;
};

export type FormErrorProps = {
  message: string;
  title?: string;
  className?: string;
};

export type SuccessMessageProps = {
  message: string;
  title?: string;
  className?: string;
};
