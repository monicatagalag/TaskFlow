import * as FileSystem from 'expo-file-system/legacy';

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
}

export async function analyzeImage(base64Image, prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
          ],
        },
      ],
    }),
  });
  const json = await response.json();
  return json;
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical suggestion based on the scene

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`;

export const PROMPTS = {
  academic: `Act as a university professor. Looking at this image, provide an academic-style analysis.

Respond ONLY with valid JSON in this exact shape, no extra text, no markdown:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
Fill "context" with the educational setting, "activities" with what's happening, and "recommendations" with one piece of constructive feedback.`,

  safety: `Act as a workplace safety inspector. Looking at this image, identify visible hazards or risks.

Respond ONLY with valid JSON in this exact shape, no extra text, no markdown:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
Fill "context" with a brief description of the setting, "activities" with what's happening, and "recommendations" with the top safety concern — or state clearly if none are visible.`,

  inventory: `Act as an asset management clerk. Looking at this image, list every visible physical asset with no extra commentary.

Respond ONLY with valid JSON in this exact shape, no extra text, no markdown:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
Fill "context" and "activities" briefly and neutrally, and "recommendations" with one practical inventory-related suggestion.`,
};