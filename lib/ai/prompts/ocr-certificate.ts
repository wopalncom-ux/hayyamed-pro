// v1 — Certificate OCR extraction prompt (Sonnet — multimodal vision)
// Appended as text content alongside the image/PDF base64 block.

export const OCR_CERTIFICATE_PROMPT = `Extract CME/CPD certificate information. Respond ONLY with valid JSON, no other text:
{"title":"<activity or course name>","provider":"<issuing organization>","date":"<YYYY-MM-DD or null>","credits":<number or null>,"category":"<conference|online|workshop|journal|teaching|simulation|mandatory|patient_safety|other or null>"}

Rules:
- title: the main training/activity name on the certificate
- provider: who awarded it (hospital, authority, university, etc.)
- date: completion or activity date in YYYY-MM-DD format; null if not visible
- credits: CME/CPD credit hours shown as a number; null if not shown
- category: best fit for the activity type; null if unclear
Use null for any field not visible in the certificate.`;
