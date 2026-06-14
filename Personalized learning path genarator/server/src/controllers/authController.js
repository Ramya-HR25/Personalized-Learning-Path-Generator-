import { issueToken } from "../middleware/auth.js";
import { User } from "../models/User.js";

function safeUser(user) {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, ...rest } = userObj;
  return rest;
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const createdUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user",
      preferences: null,
      path: null,
      activity: []
    });

    return res.status(201).json({
      token: issueToken(createdUser),
      user: safeUser(createdUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const matchedUser = await User.findOne({
      email: email.toLowerCase(),
      password
    });

    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid email or password.", email });
    }

    return res.json({
      token: issueToken(matchedUser),
      user: safeUser(matchedUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if user exists in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    // Generate a reset token
    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Store the reset token in MongoDB
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real application, you would send an email here with the reset link
    // For now, we'll simulate it by logging the token
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link would be: http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`);

    return res.json({
      message: "Password reset instructions have been sent to your email.",
      resetToken: resetToken,
      email: email
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ message: "Failed to process password reset request." });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Email, token, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Find user with matching email and reset token in MongoDB
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetToken: token
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Check if token is expired
    if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
}
