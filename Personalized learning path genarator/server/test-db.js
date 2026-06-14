import { connectDatabase } from "./src/config/database.js";
import { Catalog } from "./src/models/Catalog.js";

async function testDB() {
  try {
    await connectDatabase();
    const count = await Catalog.countDocuments();
    console.log('Total courses in database:', count);
    
    if (count > 0) {
      const sample = await Catalog.findOne();
      console.log('Sample course:', sample.subject);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testDB();
