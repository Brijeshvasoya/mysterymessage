import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const qeryParam={
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(qeryParam)
        if (!result.success) {
            return new Response("Invalid username Format", {status: 400});
        }
        const username = result.data.username;
        const user = await UserModel.findOne({username:username,isVerified:true});
        if (user) {
            return new Response("Username already exists", {status: 409});
        }
        return new Response("Username is available", {status: 200});
    } catch (error) {
        return new Response("Internal Server Error", {status: 500});
    }
}
