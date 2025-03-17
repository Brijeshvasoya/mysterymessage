"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    }).then(() => {
      router.push("/");
      toast.success("Logged out successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
    });
  };
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center ">
        <a className="text-3xl font-bold font-['Dancing_Script'] mb-4 md:mb-0 bg-gradient-to-r italic from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Mystery Message
        </a>
        {session ? (
          <>
            <span className="mr-4 text-3xl font-bold font-['Dancing_Script'] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
              Welcome, {user?.name || user?.username || "Guest"}
            </span>
            <Button
              className="w-full md:w-auto cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
