"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ResetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "./mutation";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      username: "",
      newPassword: "",
      password: "",
      cpassword: "",
    },
  });

  const [resetPassword] = useMutation(RESET_PASSWORD);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const onSubmit = async (submitData: z.infer<typeof ResetPasswordSchema>) => {
    if (submitData.newPassword !== submitData.cpassword) {
      setPasswordError("Passwords do not match");
      setIsSubmitting(false);
      document.getElementById("cpassword")?.focus();
      return;
    }
    delete submitData.cpassword;
    setIsSubmitting(true);
    try {
      const response = await resetPassword({
        variables: { input: submitData },
      });
      toast.success(response?.data?.resetPassword || "Password reset successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error?.message || "Failed to reset password", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
    form.reset({
      username: "",
      newPassword: "",
      password: "",
      cpassword: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-indigo-200 to-purple-300 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>

        <div className="relative w-full bg-white/90 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 space-y-6 transform hover:scale-[1.01] transition-all duration-300">
          <div className="text-center space-y-2">
            <div className="relative inline-block">
              <h1 className="text-xl mb-2 px-20 font-extrabold tracking-tight lg:text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Reset Password
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-indigo-600/50 to-purple-600/0"></div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className="text-gray-700 font-medium pl-1">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-4 pr-4 py-2 group-hover:shadow-md"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-indigo-500/5 to-purple-500/0 group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className="text-gray-700 font-medium pl-1">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your old password"
                          {...field}
                          className="rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-4 pr-4 py-2 group-hover:shadow-md"
                        />
                        <div
                          className="absolute right-4 top-2 text-blue-600  flex items-center cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className="text-gray-700 font-medium pl-1">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          {...field}
                          className="rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-4 pr-4 py-2 group-hover:shadow-md"
                        />
                        <div
                          className="absolute right-4 top-2 text-blue-600  flex items-center cursor-pointer"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                name="cpassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className="text-gray-700 font-medium pl-1">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showcPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                          className="rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-4 pr-4 py-2 group-hover:shadow-md"
                        />
                        <div
                          className="absolute right-4 top-2 text-blue-600  flex items-center cursor-pointer"
                          onClick={() => setShowcPassword(!showcPassword)}
                        >
                          {showcPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm ml-1" />
                    {passwordError && (
                      <p className="text-red-500 text-sm ml-1">
                        {passwordError}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-auto px-6 cursor-pointer text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100 relative group overflow-hidden shadow-lg ml-auto flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl transform group-hover:translate-x-full transition-transform duration-300"></div>
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Please Wait...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Reset Password</span>
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
