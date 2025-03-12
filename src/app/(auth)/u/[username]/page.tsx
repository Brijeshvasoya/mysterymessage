"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const Page = () => {
  const params = useParams<{ username: string }>();
  const [message, setMessage] = useState("");

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setMessage("");
  };

  const handleSendMsg = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/send-message`, {
        username: params.username,
        content: message,
      });
      toast.success(response.data?.message || "Message sent successfully",{
        style:{
          backgroundColor: 'green',
          color: 'white'
        }
      });
      setMessage("");
    } catch (error) {
      const axiosError = error as any;
      toast.error(axiosError.response?.data || "Failed to send message",{
        style:{
          backgroundColor: 'red',
          color: 'white'
        }
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-screen bg-gradient-to-r from-blue-300 to-purple-500 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-center text-4xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          Public Profile of {params.username}
        </h1>
        <p className="text-center text-lg text-gray-600 mb-6">
          Send an Anonymous Message
        </p>
        <form action="" className="flex flex-col space-y-4">
          <textarea
            placeholder="Enter your message"
            className="border h-56 border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex space-x-2 justify-end">
            <button
              type="submit"
              onClick={handleClear}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Clear
            </button>
            <button
              type="submit"
              onClick={handleSendMsg}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
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
