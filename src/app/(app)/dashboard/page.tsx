"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  ACCEPT_MESSAGES_STATUS,
  GET_MESSAGES,
} from "@/app/(app)/dashboard/query";
import { ACCEPT_MESSAGES } from "@/app/(app)/dashboard/mutation";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState("");
  const [isClient, setIsClient] = useState(false);

  const username = session?.user?.username;

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const [AcceptingMessages] = useMutation(ACCEPT_MESSAGES);

  const [getAcceptingMessages] = useLazyQuery(ACCEPT_MESSAGES_STATUS, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  const [getMessages, data] = useLazyQuery(GET_MESSAGES, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await getAcceptingMessages();
      setValue("acceptMessages", response.data.acceptMessages);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch messages", {
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
        const response = await getMessages();
        setMessages(response?.data?.getMessages || []);
        if (refresh) {
          toast.success("Messages fetched successfully", {
            style: {
              backgroundColor: "green",
              color: "white",
            },
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch messages", {
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
    if (!session || !session.user) {
      return;
    }
    if (typeof window !== "undefined" && session.user.username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${session.user.username}`);
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [router, session, setValue, fetchMessages, fetchAcceptMessage]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleSwtchChange = async () => {
    AcceptingMessages({
      variables: { input: { username, accept: !acceptMessages } },
    })
      .then(() => {
        setValue("acceptMessages", !acceptMessages);
        toast.success("Messages accept status updated successfully", {
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
      })
      .catch((error) => {
        toast.error(
          error.message || "Failed to update messages accept status",
          {
            style: {
              backgroundColor: "red",
              color: "white",
            },
          }
        );
      });
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
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded-2xl bg-gradient-to-b from-gray-100 via-gray-200 to-gray-450 w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            onClick={copyToClipboard}
            readOnly
            title="Click to copy the profile URL"
            className="input input-bordered w-full cursor-pointer p-2 mr-2 focus:outline-none"
          />
          <Button
            onClick={copyToClipboard}
            className="btn btn-primary cursor-pointer"
          >
            Copy
          </Button>
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
              key={index}
              message={message}
              username={username}
              fetchMessages={fetchMessages}
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
