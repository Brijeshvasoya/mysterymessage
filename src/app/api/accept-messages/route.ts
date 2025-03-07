import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session?.user || !session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = user._id;
  const { acceptingMessages } = await request.json();
  try {
    const user = await UserModel.findByIdAndUpdate(userId,
      {isAcceptingMessages: acceptingMessages},
      {new: true}
    );
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return Response.json({success:true,message:"Messages accept status updated successfully",user}, { status: 200 });
  } catch (error) {
    console.log(error, "Error accepting messages");
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session?.user || !session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = user?._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return Response.json({success:true,isAcceptingMessages:user.isAcceptingMessages}, { status: 200 });
  } catch (error) {
    console.log(error, "Error accepting messages");
    return new Response("Internal Server Error", { status: 500 });
  }
}

