import nodemailer from 'nodemailer';
import { VerificationEmail } from '../../emails/VerificationEmail';
import { ForgotPasswordEmail } from '../../emails/forgotPasswordEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'brijeshvasoya3@gmail.com',
                pass: 'elud qerg jqrv zuho',
            },
        });

        const emailContent = VerificationEmail({ username, otp });

        const mailOptions = {
            from: 'brijeshvasoya3@gmail.com',
            to: email,
            subject: 'Mystery Message | Verification Code',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Verification Email sent successfully',
        };
    } catch (error) {
        console.log(error, 'Error sending verification email');
        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}

export async function sendForgotPasswordEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'brijeshvasoya3@gmail.com',
                pass: 'elud qerg jqrv zuho',
            },
        });

        const emailContent = ForgotPasswordEmail({ username, email });

        const mailOptions = {
            from: 'brijeshvasoya3@gmail.com',
            to: email,
            subject: 'Mystery Message | Forgot Password',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Forgot Password Email sent successfully',
        };
    } catch (error) {
        console.log(error, 'Error sending forgot password email');
        return {
            success: false,
            message: 'Failed to send forgot password email',
        };
    }
}
