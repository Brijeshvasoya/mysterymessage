"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter
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
import moment from "moment";

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
    <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-200 rounded-lg border border-gray-200">
      <CardHeader className="flex justify-between items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="p-2 bg-red-500 cursor-pointer relative -top-6 left-27 hover:bg-red-700"
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
      <CardDescription className="text-gray-600 p-4 italic font-['Dancing_Script'] font-extrabold text-lg">
        {message.content}
      </CardDescription>
      <CardFooter className="pt-4">
        <p className="text-gray-500 text-sm italic font-['Dancing_Script']">
          Posted on: {moment(Number(message.createdAt)).format('DD-MM-YYYY')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
