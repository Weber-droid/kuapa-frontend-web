"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmittedEmail(data.email);
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-sm text-center">
        {/* Success State */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <CheckCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Check your email
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          We sent a password reset link to
        </p>
        <p className="mt-1 font-medium text-slate-900 dark:text-white">
          {submittedEmail}
        </p>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              setIsSubmitted(false);
              setSubmittedEmail("");
            }}
          >
            Try another email
          </Button>
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {/* Reset Form */}
      <div className="rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>
      </div>

      {/* Back to Sign In */}
      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
