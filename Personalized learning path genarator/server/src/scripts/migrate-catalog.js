import { generateAllCourses } from "../services/courseCatalogGenerator.js";
import { Catalog } from "../models/Catalog.js";
import { connectDatabase } from "../config/database.js";

async function migrateCatalog() {
  console.log("Starting catalog migration...");
  
  try {
    const mongoUri = await connectDatabase();
    console.log(`Connected to MongoDB: ${mongoUri}`);
    
    const courses = generateAllCourses();
    console.log(`Generated ${Object.keys(courses).length} courses`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [subject, courseData] of Object.entries(courses)) {
      try {
        await Catalog.findOneAndUpdate(
          { subject },
          { 
            ...courseData, 
            subject,
            updatedAt: new Date()
          },
          { upsert: true }
        );
        successCount++;
        console.log(`✓ Migrated: ${subject}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Error migrating ${subject}:`, error.message);
      }
    }
    
    console.log("\nMigration completed!");
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log(`Total: ${Object.keys(courses).length}`);
    
    // Verify migration
    const totalCourses = await Catalog.countDocuments();
    console.log(`\nTotal courses in database: ${totalCourses}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
}

migrateCatalog();
