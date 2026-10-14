1. Build a resume-parser landing page where users can upload a PDF resume and see a score, the skills they have, the skills they are missing, and suggestions for improving their resume.
2. Build the website with React.
3. Compare the uploaded PDF resume with a job description. Use keyword matching for now; AI analysis will be added later.
4. **Required:** Move the complete React application from `react/` into `frontend/`. Keep the frontend source, configuration, and frontend-specific scripts together there.
5. **Required:** Create a `backend/` folder containing an Express server that accepts the PDF and job description, runs the comparison, and connects to MongoDB to save analyses. AI analysis remains out of scope until it is added later.

backend folder should container server.js routes folder, controller folder, service folder, middleware folder and utils.js