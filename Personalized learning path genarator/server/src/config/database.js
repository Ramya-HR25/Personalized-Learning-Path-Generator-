import mongoose from "mongoose";
import { adminSeed, learningCatalog } from "../seed/catalog.js";
import { Catalog } from "../models/Catalog.js";
import { User } from "../models/User.js";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/learnpath";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
  await mongoose.connect(mongoUri);
  await seedDefaults();
  return mongoUri;
}

async function seedDefaults() {
  const adminExists = await User.exists({ email: adminSeed.email.toLowerCase() });
  if (!adminExists) {
    await User.create({
      name: adminSeed.name,
      email: adminSeed.email.toLowerCase(),
      password: adminSeed.password,
      role: adminSeed.role
    });
  }

  const existingSubjects = await Catalog.find({}, { subject: 1 }).lean();
  const existingSet = new Set(existingSubjects.map((item) => item.subject));
  const documents = Object.entries(learningCatalog)
    .filter(([subject]) => !existingSet.has(subject))
    .map(([subject, content]) => ({ subject, ...content }));

  if (documents.length > 0) {
    await Catalog.insertMany(documents);
  }
}
