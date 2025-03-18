import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} from "@/helpers/sendVerificationEmail";
import { Message } from "@/model/User";
import mongoose from "mongoose";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find(),
    getMessages: async (_: any, { username }: { username: string }) => {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        return user.messages;
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    acceptMessages: async (_: any, { username }: { username: string }) => {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        return user.isAcceptingMessages;
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      {
        input,
      }: { input: { username: string; email: string; password: string } }
    ) => {
      try {
        const { username, email, password } = await input;
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters long");
        }
        const existingUser = await UserModel.findOne({
          username,
          isVerified: true,
        });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const existingEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        if (existingEmail) {
          if (existingEmail.isVerified) {
            throw new Error("Email already exists");
          } else {
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
          return newUser;
        }
      } catch (error: any) {
        console.error("Error Registering User", error);
        throw new Error(error.message || "Error Registering User");
      }
    },
    verifyUser: async (
      _: any,
      { input }: { input: { username: string; verifyCode: string } }
    ) => {
      try {
        const { username, verifyCode } = await input;
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
          username: decodedUsername,
          isVerified: false,
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (user.verifyCode !== verifyCode) {
          throw new Error("Invalid verify code");
        }
        console.log(new Date(user.verifyCodeExpired) < new Date());
        if (new Date(user.verifyCodeExpired) < new Date()) {
          throw new Error("Verify code expired please resend again");
        }
        user.isVerified = true;
        await user.save();
        return user;
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    checkUserName: async (
      _: any,
      { input }: { input: { username: string } }
    ) => {
      try {
        const { username } = await input;
        if (username.length < 3) {
          throw new Error("Username must be at least 3 characters long");
        }
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (user) {
          throw new Error("Username already exists");
        }
        return "Username available";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    sendMessage: async (
      _: any,
      { input }: { input: { username: string; content: string } }
    ) => {
      const { username, content } = await input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        if (!user.isAcceptingMessages) {
          throw new Error("User is not accepting messages");
        }
        if (!user.isVerified) {
          throw new Error("User is not verified");
        }
        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
        return newMessage;
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    acceptingMessages: async (
      _: any,
      { input }: { input: { username: string; accept: boolean } }
    ) => {
      const { username, accept } = await input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        user.isAcceptingMessages = accept;
        await user.save();
        return "Message accept status updated successfully";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },

    deleteMessage: async (
      _: any,
      { input }: { input: { username: string; messageId: string } }
    ) => {
      const { username, messageId } = input;

      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new Error("Invalid messageId format");
      }

      const objectMessageId = new mongoose.Types.ObjectId(messageId);

      try {
        const user = await UserModel.findOneAndUpdate(
          { username: username },
          { $pull: { messages: { _id: objectMessageId } } },
          { new: true }
        );

        if (!user) {
          throw new Error("User not found or message not found");
        }

        return "Message deleted successfully";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resendVerifyCode: async (
      _: any,
      { input }: { input: { username: string } }
    ) => {
      const { username } = input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        const verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        user.verifyCode = verifyCode;
        user.verifyCodeExpired = new Date(Date.now() + 600000);
        await UserModel.findOneAndUpdate(
          { username },
          { verifyCode, verifyCodeExpired: user.verifyCodeExpired },
          { new: true }
        );
        const emailResponse = await sendVerificationEmail(
          user.email,
          user.username,
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
        return "Verification code resent";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    resetPassword: async (
      _: any,
      {
        input,
      }: { input: { username: string; password: string; newPassword: string } }
    ) => {
      const { username, password, newPassword } = await input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid Password");
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findOneAndUpdate(
          { username },
          { password: hashPassword },
          { new: true }
        );
        return "Password reset successfully";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    forgotPassword: async (
      _: any,
      { input }: { input: { username: string } }
    ) => {
      const { username } = await input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        const emailResponse = await sendForgotPasswordEmail(
          user.email,
          user.username,
          user.verifyCode
        );
        if (!emailResponse.success) {
          throw new Error(emailResponse.message);
        }
        return "Password reset email sent successfully";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    },
    updatePassword:async(_:any,{input}:{input:{username:string,password:string}})=>{
      const {username,password}=await input;
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("User not found");
        }
        const newPassword = await bcrypt.hash(password, 10);
        await UserModel.findOneAndUpdate(
          { username },
          { password: newPassword },
          { new: true }
        );
        return "Password updated successfully";
      } catch (error: any) {
        throw new Error(error.message || "Internal Server Error");
      }
    }
  },
};
