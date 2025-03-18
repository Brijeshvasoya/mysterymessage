export function ForgotPasswordEmail({ username, email }: { username: string, email: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Hello, ${username}</h1>
        <p style="color: #555; font-size: 16px;">You have requested to reset your password.</p>
        <p style="color: #555; font-size: 16px;">Please click the link below to reset your password:</p>
        <a href="http://localhost:3000/forgot-password/${username}" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">
          Reset Password
        </a>
      </div>
    </div>
  `;
}