"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifySchema } from "@/schemas/verifySchema";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
  });

  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post(`/api/verify-code`, {
        username: params.username,
        verifyCode: data.code,
      });
      toast.success("Account verified successfully",{
        style:{
          backgroundColor: 'green',
          color: 'white'
        }
      });
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as any;
      const message = axiosError.response?.data;
      toast.error(message,{
        style:{
          backgroundColor: 'red',
          color: 'white'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-indigo-200 to-purple-300 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>

        <div className="relative w-full bg-white/90 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 space-y-6 transform hover:scale-[1.01] transition-all duration-300">
          <div className="text-center space-y-2">
            <div className="relative inline-block">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Verify Account
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-indigo-600/50 to-purple-600/0"></div>
            </div>
            <p className="text-gray-600 text-lg">
              Verify your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="group">
                    <FormLabel className="text-gray-700 font-medium pl-1">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your verification code"
                        {...field}
                        className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-4 pr-4 py-2 group-hover:shadow-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className="h-10 w-auto px-6 cursor-pointer text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100 relative group overflow-hidden shadow-lg ml-auto flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl transform group-hover:translate-x-full transition-transform duration-300"></div>
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Please Wait...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Verify</span>
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
