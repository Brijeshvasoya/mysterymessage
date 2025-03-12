export function VerificationEmail({ username, otp }: { username: string, otp: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Hello, ${username}</h1>
        <p style="color: #555; font-size: 16px;">Your verification code is:</p>
        <h2 style="color: #007BFF; font-size: 24px; margin: 10px 0; font-weight: bold;">${otp}</h2>
        <p style="color: #555; font-size: 16px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
        <p style="font-size: 14px; color: #777;">Thank you for joining Mystery Message!</p>
        
        <a href="http://localhost:3000/verify/${username}" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">
          Verify Your Email
        </a>
      </div>
    </div>
  `;
}