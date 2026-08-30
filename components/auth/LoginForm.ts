"use client";

import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Reusable credentials-login handler.
 *
 * Usage:
 *   const handleLogin = useLoginHandler();
 *   <form onSubmit={(e) => handleLogin(e, email, password)}>
 */
export const useLoginHandler = () => {
  const router = useRouter();

  const handleLogin = async (
    e: FormEvent,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.error === "ACCOUNT_DEACTIVATED") {
          toast.error(
            "Your account has been deactivated. Please contact support.",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  return handleLogin;
};

export default useLoginHandler;
