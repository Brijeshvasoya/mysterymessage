"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { SEND_MESSAGE } from "./mutation";
import { useMutation } from "@apollo/client";

const Page = () => {
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const params = useParams<{ username: string|undefined }>();
  const [message, setMessage] = useState("");

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setMessage("");
  };

  const handleSendMsg = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await sendMessage({
        variables: {
          input: {
            username: params.username,
            content: message,
          },
        },
      });
      toast.success(response.data?.message || "Message sent successfully",{
        style:{
          backgroundColor: 'green',
          color: 'white'
        }
      });
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message",{
        style:{
          backgroundColor: 'red',
          color: 'white'
        }
      });
    } finally {
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-screen bg-gradient-to-br from-black via-gray-400 to-gray-50">
      <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-450  rounded-2xl shadow-2xl shadow-purple-300 p-6 w-full max-w-md hover:shadow-4xl">
        <h1 className="text-center text-4xl  font-extrabold font-['Dancing_Script'] italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          Public Profile of {params.username}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-6 italic mt-4">
          Send an Anonymous Message
        </p>
        <form action="" className="flex flex-col space-y-4">
          <textarea
            placeholder="Enter your message"
            className="border h-56 border-gray-400 rounded font-['Dancing_Script'] italic p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:shadow-2xl"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex space-x-2 justify-end">
            <button
              type="submit"
              onClick={handleClear}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 hover:scale-105"
            >
              Clear
            </button>
            <button
              type="submit"
              onClick={handleSendMsg}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 hover:scale-105"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
