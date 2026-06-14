import { Feedback } from "../models/Feedback.js";

export async function submitFeedback(req, res, next) {
  try {
  const { resourceTitle, rating, comment } = req.body;

  if (!resourceTitle || !rating) {
    return res.status(400).json({ message: "Resource and rating are required." });
  }

  const createdFeedback = await Feedback.create({
    userId: req.user._id,
    userName: req.user.name,
    resourceTitle,
    rating,
    comment: comment || ""
  });

  return res.status(201).json(createdFeedback);
  } catch (error) {
    next(error);
  }
}

export async function getMyFeedback(req, res, next) {
  try {
    const feedback = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(feedback);
  } catch (error) {
    next(error);
  }
}
