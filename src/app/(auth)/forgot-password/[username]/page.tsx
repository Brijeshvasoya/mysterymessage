"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_PASSWORD } from "../mutation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const page = () => {
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string | undefined }>();
  const username = params.username;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleSendForgotPasswordEmail = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await updatePassword({
        variables: { input: { username, password } },
      });
      toast.success(
        response?.data?.updatePassword || "Password updated successfully",
        {
          style: {
            backgroundColor: "green",
            color: "white",
          },
        }
      );
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update password", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    } finally {
      setIsSubmitting(false);
      setPassword("");
      setCpassword("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-screen bg-gradient-to-br from-black via-gray-400 to-gray-50">
      <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-450  rounded-2xl shadow-2xl shadow-purple-300 p-6 w-full max-w-md">
        <h1 className="text-center text-2xl font-extrabold font-['Dancing_Script'] italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          Enter New Password
        </h1>
        <form action="" className="flex flex-col space-y-4">
          <Label className="text-gray-700 font-medium pl-1">Password:</Label>
          <div className="relative">
            <Input
              placeholder="Enter your password"
              className="border border-gray-400 rounded font-['Dancing_Script'] italic p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:shadow-2xl pr-10"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-3 top-1 text-blue-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          <Label className="text-gray-700 font-medium pl-1">Confirm Password:</Label>
          <div className="relative">
            <Input
              placeholder="Enter Confirm Password"
              className="border border-gray-400 rounded font-['Dancing_Script'] italic p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:shadow-2xl pr-10"
              type={showcPassword ? "text" : "password"}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            <div
              className="absolute right-3 top-1 text-blue-600 cursor-pointer"
              onClick={() => setShowcPassword(!showcPassword)}
            >
              {showcPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          <div className="flex space-x-2 justify-end">
            <button
              type="reset"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 hover:scale-105"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSendForgotPasswordEmail}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Please Wait...</span>
                </div>
              ) : (
                <span className="relative z-10">Reset Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
