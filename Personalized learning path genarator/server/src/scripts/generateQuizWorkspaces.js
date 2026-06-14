import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { courseCategories } from '../services/courseCatalogGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const purposes = [
  "Job preparation",
  "Skill development",
  "Project development",
  "Academic learning",
  "Interview preparation",
  "Career switch",
  "Competitive exams"
];

const levels = ["Beginner", "Intermediate", "Advanced"];

// Extract all 89 courses from the categories
const allCourses = [];
for (const category in courseCategories) {
  allCourses.push(...courseCategories[category]);
}

// Ensure the target directory exists
const targetDir = path.join(__dirname, '../data/quiz_workspaces');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Generate a file for each course
allCourses.forEach(course => {
  const courseFileName = course.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.json';
  const filePath = path.join(targetDir, courseFileName);

  const courseStructure = {
    courseName: course,
    workspaces: {}
  };

  purposes.forEach(purpose => {
    courseStructure.workspaces[purpose] = {};
    levels.forEach(level => {
      // Empty array where the user can directly add quiz question objects
      courseStructure.workspaces[purpose][level] = [];
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(courseStructure, null, 2));
  console.log(`Created workspace file for ${course}`);
});

console.log(`Successfully created ${allCourses.length} workspace files in ${targetDir}`);
