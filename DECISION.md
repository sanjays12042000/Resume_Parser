# DECISION.md — AI Resume Parser

Build a complete AI Resume Parser and Resume Analyzer using the following technologies:

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
- **AI:** Google Gemini API

## Requirements

1. Allow users to upload their resumes in PDF format.
2. Extract text and important information from resumes.
3. Allow users to enter a job description.
4. Use Gemini AI to analyze the resume against the job description.
5. Display a resume match score from 0 to 100.
6. Identify candidate skills, matching skills, and missing skills.
7. Show education, experience, strengths, weaknesses, and improvement suggestions.
8. Save and retrieve analysis results using MongoDB.
9. Create a clean, modern, responsive React user interface.
10. Connect the frontend and backend using REST APIs.
11. Handle invalid files, API errors, and database errors properly.
12. Keep the code clean, organized, and easy to maintain.

## Environment Variables

Store backend configuration in `backend/.env`:

- `GEMINI_API_KEY`
- `MONGODB_URI`
- `PORT`
- `FRONTEND_URL`

Keep all secrets in the backend. Never expose API keys or database credentials in React code. Add `.env` to `.gitignore`.

## Instructions for VS Code AI

Read this file and inspect my existing project before writing code.

Implement the project step by step. Reuse existing working code and do not overwrite files unnecessarily.

Install the required dependencies, create the necessary files, implement all features, connect React with Express, integrate MongoDB and Gemini AI, and test the complete application.

Provide working code and clear instructions for running the frontend and backend.

Do not leave important features as placeholders. Fix errors and verify each feature before considering the project complete. 