"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

const SubmitButton = ({
  label,
  ...btnProps
}: { label: string } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { pending } = useFormStatus();
  return (
    <button {...btnProps} type="submit" disabled={pending}>
      {label}
    </button>
  );
};

export default SubmitButton;
