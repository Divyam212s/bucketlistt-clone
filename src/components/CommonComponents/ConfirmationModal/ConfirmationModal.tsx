"use client";

import { Modal, Button } from "antd";
import "./ConfirmationModal.css";

export interface ConfirmationModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** "danger" for red confirm (e.g. delete), "primary" for brand color */
  variant?: "primary" | "danger";
  width?: number;
  centered?: boolean;
}

export default function ConfirmationModal({
  open,
  onCancel,
  onConfirm,
  title = "Confirm",
  content,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  width = 400,
  centered = true,
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      centered={centered}
      width={width}
      maskClosable
      destroyOnClose
      footer={
        <div className="ConfirmationModalFooter">
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button
            type="primary"
            danger={variant === "danger"}
            onClick={onConfirm}
            className={variant === "primary" ? "ConfirmationModalConfirmPrimary" : undefined}
          >
            {confirmText}
          </Button>
        </div>
      }
      className="ConfirmationModal"
      styles={{ body: { paddingTop: 12 } }}
    >
      <div className="ConfirmationModalContent">{content}</div>
    </Modal>
  );
}
