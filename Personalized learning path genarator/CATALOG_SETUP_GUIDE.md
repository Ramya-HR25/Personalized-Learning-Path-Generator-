# Course Catalog Extension - Testing & Setup Guide

## Overview
The course catalog has been extended from 5 courses to **60+ Computer Science courses** with dynamic search, auto-suggestions, and category filtering.

## What's New

### 1. **60+ CS Courses Available**
All courses from the following categories:
- Programming Languages (C, C++, Java, Python, OOP)
- Core CS (Data Structures, Algorithms, Math, etc.)
- Systems (OS, DBMS, Networks, Architecture)
- Web Technologies (HTML, CSS, JavaScript, React, Node, etc.)
- Data Science & AI (ML, DL, NLP, Computer Vision, etc.)
- Big Data & Cloud (Hadoop, Spark, Docker, Microservices)
- Security (Cyber Security, Cryptography, Ethical Hacking)
- Mobile Dev (Android, Flutter, React Native, Kotlin)
- DevOps & Tools (Git, Linux, Shell Scripting, DevOps)
- Emerging Tech (Blockchain, Quantum Computing, IoT)

### 2. **Dynamic Search with Auto-Suggest**
- Real-time search as you type
- Fuzzy matching across course names, titles, and descriptions
- Relevance-ranked results
- Support for custom topics not in the catalog

### 3. **Category Filtering**
- Browse courses by category
- Click category chips to filter
- Visual feedback for active filters

### 4. **Popular Course Suggestions**
- 6 trending courses shown by default
- Quick access to most popular topics

### 5. **YouTube API Integration (Optional)**
- Dynamic video fetching from YouTube
- Fallback to static URLs if API not configured

## Setup Instructions

### Step 1: Install Dependencies
```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Navigate to client directory
cd ../client

# Install dependencies (if not already done)
npm install
```

### Step 2: Configure Environment Variables
```bash
# In the server directory, create .env file
cd server
copy .env.example .env

# Edit .env file with your configurations:
# - MongoDB URI
# - JWT Secret
# - YouTube API Key (optional)
```

### Step 3: Run Database Migration
```bash
# In the server directory
npm run migrate-catalog

# This will:
# - Connect to MongoDB
# - Generate all 60+ courses
# - Insert/update courses in the database
# - Show migration statistics
```

Expected output:
```
Starting catalog migration...
Connected to MongoDB: mongodb://localhost:27017/learnpath
Generated 67 courses
✓ Migrated: C Programming
✓ Migrated: C++ Programming
...
Migration completed!
Successful: 67
Failed: 0
Total: 67

Total courses in database: 67
```

### Step 4: Start the Servers
```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

### Step 5: Test the Application

#### Test 1: Course Search
1. Navigate to the Preferences page
2. Try searching for:
   - "Python" → Should show Python Programming
   - "Machine Learning" → Should show ML course
   - "React" → Should show React JS
   - "web" → Should show multiple web-related courses
3. Verify auto-suggestions appear as you type
4. Click a suggestion and verify it's selected

#### Test 2: Category Filtering
1. On Preferences page, scroll to category filters
2. Click "Programming Languages" → Should show 5 courses
3. Click "Data Science & AI" → Should show 9 courses
4. Click "Security" → Should show 6 courses
5. Verify courses update in suggestions

#### Test 3: Popular Courses
1. Clear the search box
2. Verify 6 popular courses are displayed
3. Click any popular course
4. Verify it gets selected

#### Test 4: Custom Topic
1. Type a custom topic not in catalog (e.g., "Rust Programming")
2. Wait for search results
3. Should see option: "Use 'Rust Programming' as custom topic"
4. Click it to select as custom topic

#### Test 5: Complete Flow
1. Select a course (e.g., "Python Programming")
2. Click Continue
3. Select purpose (e.g., "Job preparation")
4. Click Continue
5. Select level (e.g., "Beginner")
6. Click "Generate path"
7. Verify learning path is generated with chapters and topics
8. Navigate through the path
9. Try tracking a resource
10. Try taking a quiz

#### Test 6: Multiple Paths
1. Generate a path for "Python Programming"
2. Go back to Preferences
3. Generate another path for "Machine Learning"
4. Verify both paths are saved
5. Switch between paths

## API Endpoints

### Search Courses
```
GET /api/learning/search?query=python
```

Response:
```json
{
  "results": [
    {
      "subject": "Python Programming",
      "title": "Python Programming Mastery Path",
      "overview": "Master python programming from fundamentals...",
      "estimatedHours": 35,
      "relevance": 100
    }
  ],
  "categories": {
    "Programming Languages": [...],
    "Web Technologies": [...]
  },
  "total": 1
}
```

### Get All Courses (no query)
```
GET /api/learning/search
```

Returns all 60+ courses organized by categories.

## Troubleshooting

### Issue: No courses appearing in search
**Solution:** Run the migration script
```bash
cd server
npm run migrate-catalog
```

### Issue: MongoDB connection error
**Solution:** 
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env file
3. Default: `mongodb://localhost:27017/learnpath`

### Issue: Search API returns empty results
**Solution:**
1. Check server console for errors
2. Verify catalog migration was successful
3. Check network tab in browser dev tools

### Issue: Custom topic not working
**Solution:**
1. Ensure search query is at least 3 characters
2. Check that no matching course exists in catalog
3. Verify the "Use as custom topic" button appears

### Issue: YouTube videos not loading
**Solution:**
1. This is optional - fallback videos will be used
2. To enable, get YouTube Data API v3 key from Google Cloud Console
3. Add to .env: `YOUTUBE_API_KEY=your_key_here`

## Performance Notes

- Search is debounced (300ms) to avoid excessive API calls
- Results limited to top 20 for performance
- Categories loaded once and cached client-side
- All courses stored in MongoDB for fast retrieval

## Backward Compatibility

✅ All existing functionality preserved:
- Old 5 courses still work (Python, Web Dev, Frontend, Backend, Technical Skills)
- User paths and progress maintained
- Quiz system works with new courses
- Tracking, dashboard, certificates, reports all functional
- No breaking changes to API contracts

## Next Steps (Optional Enhancements)

1. **Add YouTube API Key** - Get dynamic video content
2. **Admin Dashboard** - Manage/edit courses through UI
3. **Course Ratings** - Allow users to rate courses
4. **Personalized Recommendations** - Suggest courses based on history
5. **More Resource Types** - Add coding exercises, projects, etc.
6. **Course Previews** - Show sample content before selecting
7. **Advanced Filters** - Filter by difficulty, duration, rating

## Files Modified/Created

### New Files
- `server/src/services/courseCatalogGenerator.js` - Generates 60+ courses
- `server/src/services/youtubeService.js` - YouTube API integration
- `server/src/scripts/migrate-catalog.js` - Database migration script
- `server/.env.example` - Environment variables template

### Modified Files
- `server/src/seed/catalog.js` - Uses dynamic generator
- `server/src/controllers/learningController.js` - Added search endpoint
- `server/src/routes/learningRoutes.js` - Added search route
- `server/package.json` - Added migration script
- `client/src/pages/PreferencesPage.jsx` - Enhanced with search UI
- `client/src/styles/global.css` - Added search-related styles

## Course Count by Category

| Category | Courses |
|----------|---------|
| Programming Languages | 5 |
| Core CS | 7 |
| Systems | 7 |
| Theory | 2 |
| Software Engineering | 4 |
| Web Technologies | 12 |
| Data Science & AI | 9 |
| Big Data & Cloud | 7 |
| IoT & Embedded | 4 |
| Security | 6 |
| Mobile Dev | 5 |
| DevOps & Tools | 6 |
| Math & Graphics | 4 |
| Emerging Tech | 5 |
| **Total** | **73** |

## Support

If you encounter any issues:
1. Check this guide's troubleshooting section
2. Review server and browser console logs
3. Verify MongoDB is running and accessible
4. Ensure all dependencies are installed
5. Run migration script again if needed

---

**Enjoy exploring 60+ CS courses with intelligent search!** 🎓
