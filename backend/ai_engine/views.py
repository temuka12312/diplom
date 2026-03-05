import os
import json

from google import genai 

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from progress.models import LessonProgress
from courses.models import Lesson, Course


def simple_summarize(text: str, max_sentences: int = 3) -> str:
    if not text:
        return "No content to summarize."

    parts = [s.strip() for s in text.split(".") if s.strip()]
    if not parts:
        return text[:300] + ("..." if len(text) > 300 else "")

    summary_sentences = parts[:max_sentences]
    summary = ". ".join(summary_sentences)
    if not summary.endswith("."):
        summary += "."
    return summary


def llm_summarize(text: str) -> str:
    """
    Gemini API ашиглаж summary гаргана.
    GEMINI_API_KEY байхгүй эсвэл алдаа гарвал simple_summarize руу fallback.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(">>> USING SIMPLE SUMMARY (NO GEMINI_API_KEY)")
        return simple_summarize(text)

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Доорх e-learning хичээлийн агуулгыг 2–3 өгүүлбэрт багтаан, "
            "оюутанд ойлгомжтой байдлаар өөр үгээр дахин бичиж хураангуйлаарай. "
            "Ямар ч өгүүлбэрийг эх тексттэй ижилээр бүү хуул. "
            "Хариуг Монгол хэл дээр гарга.\n\n"
            f"{text}"
        )

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        summary = (response.text or "").strip()
        print(">>> USING GEMINI SUMMARY")

        if not summary:
            return simple_summarize(text)
        return summary

    except Exception as e:
        print("Gemini summary error:", e)
        print(">>> FALLBACK SIMPLE SUMMARY (ERROR)")
        return simple_summarize(text)


def llm_quiz(text: str, num_questions: int = 3) -> list[dict]:
    """
    Lesson-ийн текстээс AI ашиглаж multiple-choice quiz үүсгэнэ.
    Алдаа гарвал хоосон лист буцаана.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(">>> QUIZ: NO GEMINI_API_KEY, returning []")
        return []

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Доорх e-learning хичээлийн агуулгыг ашиглан "
            f"{num_questions} ширхэг multiple-choice асуулт үүсгэ. "
            "Бүх асуулт Монгол хэл дээр байна. Асуулт бүр 4 сонголттой байг. "
            "Нэг л зөв хариулттай байг. Зөв хариултын индексийг 0-эс эхэлсэн "
            "index байдлаар өг. Зөв хариултын тайлбар (яагаад зөв болохыг) бас бич. "
            "Зөвхөн дараах JSON хэлбэрээр хариул:\n\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "question": "Асуулт 1",\n'
            '      "options": ["A", "B", "C", "D"],\n'
            '      "answer_index": 1,\n'
            '      "explanation": "Тайлбар"\n'
            "    }\n"
            "  ]\n"
            "}\n\n"
            "JSON-оос өөр ямар нэг текст, тайлбар, markdown бүү бич.\n\n"
            f"Хичээлийн агуулга:\n{text}"
        )

        resp = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        raw = (resp.text or "").strip()
        print("RAW QUIZ RESPONSE >>>", raw[:200])

        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.lower().startswith("json"):
                raw = raw[4:].lstrip()

        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        questions = data.get("questions", [])
        cleaned: list[dict] = []

        for idx, q in enumerate(questions, start=1):
            try:
                opts = q.get("options", [])
                cleaned.append(
                    {
                        "id": idx,
                        "question": str(q.get("question", "")),
                        "options": [str(o) for o in opts],
                        "answer_index": int(q.get("answer_index", 0)),
                        "explanation": str(q.get("explanation", "")),
                    }
                )
            except Exception as inner_e:
                print("Quiz item clean error:", inner_e)
                continue

        print(">>> USING GEMINI QUIZ, count:", len(cleaned))
        return cleaned

    except Exception as e:
        print("Gemini quiz error:", e)
        print(">>> QUIZ FALLBACK: []")
        return []


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_quiz(request, lesson_id):
    """
    AI ашиглаж тухайн lesson-ийн quiz үүсгээд буцаана.
    """
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {"detail": "Lesson not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    text = lesson.content or ""
    if not text:
        return Response(
            {"detail": "Lesson has no content to generate quiz."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    questions = llm_quiz(text, num_questions=3)

    return Response(
        {
            "lesson_id": lesson.id,
            "title": lesson.title,
            "questions": questions,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_summary(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {"detail": "Lesson not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    text = lesson.content or ""

    if not text and lesson.file:
        summary = (
            "This lesson has a PDF file, but text extraction is not implemented yet."
        )
    else:
        summary = llm_summarize(text)

    data = {
        "lesson_id": lesson.id,
        "title": lesson.title,
        "summary": summary,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommended_lessons(request):
    """
    Дуусаагүй байгаа хичээлүүдээс level-д нь таарсан recommendation.
    """
    user = request.user

    completed_ids = LessonProgress.objects.filter(
        user=user,
        is_completed=True,
    ).values_list("lesson_id", flat=True)

    qs = (
        Lesson.objects.exclude(id__in=completed_ids)
        .select_related("course")
        .order_by("course__level", "course__title", "order")
    )

    qs = qs[:5]

    recommendations = []
    for lesson in qs:
        recommendations.append(
            {
                "lesson_id": lesson.id,
                "lesson_title": lesson.title,
                "course_id": lesson.course.id,
                "course_title": lesson.course.title,
                "level": lesson.course.level,
            }
        )

    return Response(
        {
            "count": len(recommendations),
            "results": recommendations,
        },
        status=status.HTTP_200_OK,
    )


def llm_placement_quiz(num_questions: int = 20) -> list[dict]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(">>> PLACEMENT QUIZ: NO GEMINI_API_KEY, returning []")
        return []

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Программчлалын үндэс, логик сэтгэлгээ, алгоритм, вэб хөгжүүлэлтийн "
            "анхан шатны мэдлэгийг шалгах зорилгоор placement test үүсгэ. "
            f"{num_questions} ширхэг multiple-choice асуулт гарга. "
            "Бүх асуулт Монгол хэл дээр байна. Асуулт бүр 4 сонголттой байг. "
            "Нэг л зөв хариулттай байг. Зөв хариултын индексийг 0-ээс эхэлсэн "
            "index байдлаар өг. Зөв хариултын тайлбар (яагаад зөв болохыг) бас бич. "
            "Зөвхөн дараах JSON хэлбэрээр хариул:\n\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "question": "Асуулт 1",\n'
            '      "options": ["A", "B", "C", "D"],\n'
            '      "answer_index": 1,\n'
            '      "explanation": "Тайлбар"\n'
            "    }\n"
            "  ]\n"
            "}\n\n"
            "JSON-оос өөр ямар нэг текст, тайлбар, markdown бүү бич."
        )

        resp = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        raw = (resp.text or "").strip()
        print("RAW PLACEMENT QUIZ >>>", raw[:200])

        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.lower().startswith("json"):
                raw = raw[4:].lstrip()

        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)
        questions = data.get("questions", [])
        cleaned: list[dict] = []

        for idx, q in enumerate(questions, start=1):
            try:
                opts = q.get("options", [])
                cleaned.append(
                    {
                        "id": idx,
                        "question": str(q.get("question", "")),
                        "options": [str(o) for o in opts],
                        "answer_index": int(q.get("answer_index", 0)),
                        "explanation": str(q.get("explanation", "")),
                    }
                )
            except Exception as inner_e:
                print("Placement quiz item clean error:", inner_e)
                continue

        print(">>> USING GEMINI PLACEMENT QUIZ, count:", len(cleaned))
        return cleaned

    except Exception as e:
        print("Gemini placement quiz error:", e)
        print(">>> PLACEMENT QUIZ FALLBACK: []")
        return []


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def placement_quiz(request):
    """
    Анхны түвшин тогтоох placement test.
    """
    questions = llm_placement_quiz(num_questions=20)
    return Response({"questions": questions}, status=status.HTTP_200_OK)