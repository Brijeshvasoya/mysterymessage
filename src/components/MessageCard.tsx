"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DELETE_MESSAGE } from "@/app/(app)/dashboard/mutation";
import { useMutation } from "@apollo/client";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  fetchMessages: (shouldRefetch?: boolean) => void;
  username: string;
};

const MessageCard = ({ message, onMessageDelete, username, fetchMessages }: MessageCardProps) => {

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    refetchQueries: ["GET_MESSAGES"],
  });

  const handleDeleteConfirm = async () => {
      await deleteMessage({
        variables: { input: { username, messageId: message.id } }
      }).then(() => {
        toast.success("Message deleted successfully", {
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        onMessageDelete(message.id);
        fetchMessages();
      }).catch ((error) => {
      console.error(error);
      const axiosError = error as any;
      toast.error(axiosError.response?.data || "Failed to delete message",{
        style:{
          backgroundColor: 'red',
          color: 'white'
        }
      });
    });
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg border border-gray-200">
      <CardHeader className="flex justify-between items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="p-2 cursor-pointer relative -top-6 left-27"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClickCapture={handleDeleteConfirm}
                className="bg-red-600 cursor-pointer hover:bg-red-700 transition duration-200"
              >
                Delete Message
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardDescription className="text-gray-600 p-4">
        {message.content}
      </CardDescription>
      <CardContent className="p-4">
        <p className="text-gray-500 text-sm">
          Posted on: {new Date(message.createAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
