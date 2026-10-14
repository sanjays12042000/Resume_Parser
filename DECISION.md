1. Build a resume-parser landing page where users can upload a PDF resume and see a score, the skills they have, the skills they are missing, and suggestions for improving their resume.
2. Build the website with React.
3. Compare the uploaded PDF resume with a job description. Use keyword matching for now; AI analysis will be added later.
4. **Required:** Move the complete React application from `react/` into `frontend/`. Keep the frontend source, configuration, and frontend-specific scripts together there.
5. **Required:** Create a `backend/` folder containing an Express server that accepts the PDF and job description, runs the comparison, and connects to MongoDB to save analyses. AI analysis remains out of scope until it is added later.

backend folder should container server.js routes folder, controller folder, service folder, middleware folder and utils.js

below the format to AI ,lets connect and parse the resume and give the score

Quickstart: call labd from a program
Send the conversation so far as messages, each a role (user or assistant) and its content, ending on the user's turn. labd answers once, in JSON: message.content is the reply and credits.percentLeft is what is left of your allowance. Nothing is remembered between requests, so send the earlier turns yourself when you want a conversation.

curl https://agent.thedevlabs.io/v1/api/chat \
  -H "Authorization: Bearer $LABD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Explain closures in one paragraph."}]}'
const res = await fetch('https://agent.thedevlabs.io/v1/api/chat', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.LABD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Explain closures in one paragraph.' }],
  }),
});
const { message, credits } = await res.json();
console.log(message.content, `${credits.percentLeft}% left`);
Keep the key on a server. labd does not answer browsers on other sites, so a key in a web page is a key anyone viewing it can copy and nothing you can use.
401 the key is wrong or revoked · 402 the allowance is used up · 403 the API is switched off · 429 too many requests this minute, wait and retry.
Every answer spends the same allowance as labd in the portal, your editor and your terminal.