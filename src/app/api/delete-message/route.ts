import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request:Request){
    const session = await getServerSession(authOptions);
    await dbConnect();
    const{messageid} = await request.json();
    try{
        const user = await UserModel.findByIdAndUpdate(session?.user?._id,
            { $pull: { messages: { _id: messageid } } },
            {new: true}
        )
        if (!user) {
            return new Response("Message not found", {status: 404});
        }
        return new Response("Message deleted successfully", {status: 200});
    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", {status: 500});
    }
}
