"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const username = session?.user?.username
  const baseUrl=`${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as any;
      toast.error(axiosError.response?.data || "Failed to fetch messages", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Messages fetched successfully", {
            style: {
              backgroundColor: "green",
              color: "white",
            },
          });
        }
      } catch (error) {
        const axiosError = error as any;
        toast.error(axiosError.response?.data || "Failed to fetch messages", {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user){
      return;
    };
    fetchMessages();
    fetchAcceptMessage();
  }, [router, session, setValue, fetchMessages, fetchAcceptMessage]);

  const handleSwtchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptingMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Messages accept status updated successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
    } catch (error) {
      const axiosError = error as any;
      toast.error(
        axiosError.response?.data || "Failed to update messages accept status",
        {
          style: {
            backgroundColor: "red",
            color: "white",
          },
        }
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard", {
      style: {
        backgroundColor: "green",
        color: "white",
      },
    });
  };
  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-100 rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full cursor-pointer p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className="btn btn-primary cursor-pointer">Copy</Button>
        </div>
      </div>
      <div className="mb-4 cursor-pointer">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwtchChange}
          disabled={isSwitchLoading}
        />
        <span
          className={`ml-2 ${acceptMessages ? "text-green-500" : "text-red-500"}`}
        >
          Accept Messages{acceptMessages ? " (On)" : " (Off)"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="text-center">No messages found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
