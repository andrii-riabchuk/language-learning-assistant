import React from "react";

import "./CrossButton.css";

export interface CrossButtonProps {
  onClick: () => void;
}

export default function CrossButton({ onClick }: CrossButtonProps) {
  return (
    <span className="close" onClick={onClick}>
      &times;
    </span>
  );
}
