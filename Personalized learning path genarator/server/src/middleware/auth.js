import { User } from "../models/User.js";

export function issueToken(user) {
  return Buffer.from(`${user._id}:${user.role}`).toString("base64");
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = header.replace("Bearer ", "");
    const [userId] = Buffer.from(token, "base64").toString("utf-8").split(":");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  next();
}
