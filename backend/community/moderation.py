import json
import os

from google import genai


BANNED_WORDS = [
    "alna",
    "teneg",
    "mal",
    "lalr",
    "pizda",
    "gichii",
]


def keyword_moderation(text: str) -> dict:
    lowered = text.lower()

    for word in BANNED_WORDS:
        if word in lowered:
            return {
                "status": "reject",
                "reason": f"Blocked word detected: {word}",
            }

    return {
        "status": "allow",
        "reason": "No blocked keywords",
    }


def ai_moderation(text: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"status": "allow", "reason": "AI moderation skipped"}

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Чи e-learning community moderation assistant.\n"
            "Доорх хэрэглэгчийн бичсэн текстийг шалга.\n\n"
            "ДҮРЭМ:\n"
            "1. Хэрэв сургалттай холбоотой энгийн, зөв текст бол allow.\n"
            "2. Хэрэв бага зэрэг бүдүүлэг, spam шинжтэй, эсвэл сургалтын орчинд тохиромжгүй байж магадгүй бол review.\n"
            "3. Хэрэв доромжлол, хараал, заналхийлэл, маш зохисгүй агуулга байвал reject.\n"
            "4. Зөвхөн JSON буцаа.\n\n"
            "Формат:\n"
            "{\n"
            '  "status": "allow" | "review" | "reject",\n'
            '  "reason": "товч тайлбар"\n'
            "}\n\n"
            f"TEXT:\n{text}"
        )

        resp = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        raw = (resp.text or "").strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw)

        status = data.get("status", "allow")
        reason = data.get("reason", "")

        if status not in ["allow", "review", "reject"]:
            status = "allow"

        return {
            "status": status,
            "reason": reason,
        }

    except Exception as e:
        print("AI moderation error >>>", e)
        return {"status": "allow", "reason": "AI moderation fallback allow"}


def moderate_text(text: str) -> dict:
    if not text.strip():
        return {"status": "reject", "reason": "Empty text"}

    keyword_result = keyword_moderation(text)
    if keyword_result["status"] == "reject":
        return keyword_result

    return ai_moderation(text)