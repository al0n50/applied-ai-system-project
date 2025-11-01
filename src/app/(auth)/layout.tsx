import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px]">{children}</div>
    </div>
  );
};

export default AuthLayout;
