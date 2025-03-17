import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document{
    content: string,
    createAt: Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    // createAt:{
    //     type:Date,
    //     required:true,
    //     default:Date.now
    // }
},{
    timestamps:true
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpired: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
  }
  

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpired: {
    type: Date,
    required: [true, "Verify code expired is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
},{
    timestamps:true
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
