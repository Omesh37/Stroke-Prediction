const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function predictStroke(formData) {
  const res = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}