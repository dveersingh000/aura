const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Meta data
export async function getMoods() {
  const res = await fetch(`${API_BASE_URL}/moods`);
  if (!res.ok) throw new Error('Failed to fetch moods');
  return res.json();
}

export async function getPersonas() {
  const res = await fetch(`${API_BASE_URL}/personas`);
  if (!res.ok) throw new Error('Failed to fetch personas');
  return res.json();
}

export async function getPersonaByName(name: string) {
  const res = await fetch(`${API_BASE_URL}/personas/by-name/${name}`);
  if (!res.ok) throw new Error('Persona not found');
  return res.json();
}

export async function getNotes() {
  const res = await fetch(`${API_BASE_URL}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

// ----------- PERFUMES -----------

export async function getPerfumes() {
  const res = await fetch(`${API_BASE_URL}/perfumes`);
  if (!res.ok) throw new Error('Failed to fetch perfumes');
  return res.json();
}

export async function getPerfumeById(id: string) {
  const res = await fetch(`${API_BASE_URL}/perfumes/${id}`);
  if (!res.ok) throw new Error('Perfume not found');
  return res.json();
}

// ----------- RECOMMENDATIONS -----------

export async function getRecommendations(payload: {
  moodId: string;
  personaId: string;
  selectedNoteIds: string[];
}) {
  const res = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to get recommendations');
  return res.json();
}
