export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);
  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

  let response;
  try {
    response = await fetch(`${apiBaseUrl}/api/analyze`, {
      method: "POST",
      body: formData
    });
  } catch {
    throw new Error("Could not reach the API. Make sure the backend server is running.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `The server answered ${response.status}.`);
  }
  return data;
}
