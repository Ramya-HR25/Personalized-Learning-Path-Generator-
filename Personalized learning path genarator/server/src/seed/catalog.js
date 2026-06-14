import { generateAllCourses } from "../services/courseCatalogGenerator.js";

// Generate all courses dynamically from the catalog generator
export const learningCatalog = generateAllCourses();

export const adminSeed = {
  name: "Admin User",
  email: "admin@learnpath.dev",
  password: "Admin@123",
  role: "admin"
};
