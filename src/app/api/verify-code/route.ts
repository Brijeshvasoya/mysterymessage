import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
      isVerified: true,
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    if (user.verifyCode !== verifyCode) {
      return new Response("Invalid verify code", { status: 400 });
    }

    if (new Date(user.verifyCodeExpired) < new Date()) {
      return new Response("Verify code expired please signup again", { status: 400 });
    }
    user.isVerified = true;
    await user.save();
    return new Response("User verified successfully", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
