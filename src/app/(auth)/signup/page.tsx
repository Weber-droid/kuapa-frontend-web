"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Phone, MapPin, Tractor, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/auth-store";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { type CropType } from "@/types";
import { cn } from "@/lib/utils/cn";

const cropOptions: { value: CropType; label: string }[] = [
  { value: "cocoa", label: "Cocoa" },
  { value: "cassava", label: "Cassava" },
  { value: "maize", label: "Maize" },
  { value: "plantain", label: "Plantain" },
  { value: "rice", label: "Rice" },
  { value: "tomato", label: "Tomato" },
  { value: "pepper", label: "Pepper" },
  { value: "other", label: "Other" },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      farmName: "",
      location: "",
      cropTypes: [],
      agreeToTerms: false,
    },
  });

  const cropTypes = watch("cropTypes");
  const agreeToTerms = watch("agreeToTerms");

  const toggleCropType = (crop: CropType) => {
    const current = cropTypes || [];
    if (current.includes(crop)) {
      setValue(
        "cropTypes",
        current.filter((c) => c !== crop),
        { shouldValidate: true }
      );
    } else {
      setValue("cropTypes", [...current, crop], { shouldValidate: true });
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? (["name", "email", "password", "confirmPassword"] as const)
        : (["cropTypes"] as const);

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    clearError();
    const success = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      farmName: data.farmName,
      location: data.location,
      cropTypes: data.cropTypes,
    });
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Account
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Join Kuapa to protect your crops
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-2 w-8 rounded-full transition-colors",
              s <= step ? "bg-primary-500" : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
      </div>

      {/* Signup Form */}
      <div className="rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger-600 dark:bg-danger-900/20 dark:text-danger-400">
              {error}
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                leftIcon={<User className="h-5 w-5" />}
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                hint="At least 8 characters with uppercase, lowercase, and number"
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handleNextStep}
              >
                Continue
              </Button>
            </>
          )}

          {/* Step 2: Farm Details */}
          {step === 2 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  What crops do you grow? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map((crop) => (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() => toggleCropType(crop.value)}
                      className={cn(
                        "flex items-center justify-center rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors",
                        cropTypes?.includes(crop.value)
                          ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500"
                      )}
                    >
                      {crop.label}
                    </button>
                  ))}
                </div>
                {errors.cropTypes && (
                  <p className="mt-1.5 text-sm text-danger-500">
                    {errors.cropTypes.message}
                  </p>
                )}
              </div>

              <Input
                label="Farm Name (Optional)"
                placeholder="Enter your farm name"
                leftIcon={<Tractor className="h-5 w-5" />}
                {...register("farmName")}
              />

              <Input
                label="Location (Optional)"
                placeholder="e.g., Ashanti Region, Ghana"
                leftIcon={<MapPin className="h-5 w-5" />}
                {...register("location")}
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+233 XX XXX XXXX"
                leftIcon={<Phone className="h-5 w-5" />}
                {...register("phone")}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  size="lg"
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Terms & Submit */}
          {step === 3 && (
            <>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                <h3 className="mb-2 font-medium text-slate-900 dark:text-white">
                  Almost done!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please review and accept our terms to complete your
                  registration.
                </p>
              </div>

              <div className="space-y-3">
                <Checkbox
                  checked={!!agreeToTerms}
                  onChange={(checked) =>
                    setValue("agreeToTerms", checked as true, {
                      shouldValidate: true,
                    })
                  }
                  label={
                    <span>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
                  error={errors.agreeToTerms?.message}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
