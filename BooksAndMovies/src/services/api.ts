const API_BASE_URL = 'http://localhost:3000/api';

export async function getMessage(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/message`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
