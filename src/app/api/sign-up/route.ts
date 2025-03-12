import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingEmail) {
      if (existingEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists",
          },
          {
            status: 400,
          }
        );
      }else{
        const hashPassword = await bcrypt.hash(password, 10);
        existingEmail.password = hashPassword;
        existingEmail.verifyCode = verifyCode;
        existingEmail.verifyCodeExpired = new Date(Date.now() + 600000);
        await existingEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpired: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered Successfully Please Verify Your Email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
