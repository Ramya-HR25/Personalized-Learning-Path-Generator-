# Personalized Learning Path Generator

Full-stack learning platform with guided onboarding, personalized path generation, automatic progress tracking, analytics, feedback, and an admin panel.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: MongoDB with Mongoose

## Features

- Attractive landing page with modern glassmorphism styling
- Registration and login with validation
- Step-by-step preference setup with single-select choices
- Personalized chapter -> topic -> subtopic learning path generation
- Automatic progress tracking for videos, courses, articles, and notes
- Dashboard with study time, remaining time, progress, and coach summary
- Feedback storage and admin moderation
- Admin login and catalog management
- Light and dark mode
- Downloadable report and certificate

## Demo admin account

- Email: `admin@learnpath.dev`
- Password: `Admin@123`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the backend:

```bash
npm run dev --workspace server
```

3. In a second terminal, start the frontend:

```bash
npm run dev --workspace client
```

4. Open `http://localhost:5173`

## Production build

```bash
npm run build
```

## Notes

- Default MongoDB URI: `mongodb://127.0.0.1:27017/learnpath`
- To use a different database, set `MONGODB_URI` before starting the server.
- The backend API runs on `http://localhost:4000`.
- Learning progress is tracked automatically when users open resources from the generated path page.
- The server seeds the admin account and initial learning catalog into MongoDB on first run.
