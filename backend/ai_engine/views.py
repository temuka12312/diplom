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
            "Бүх асуулт Монгол хэл дээр байна. "
            "Асуулт бүр 4 сонголттой байг. "
            "Нэг л зөв хариулттай байг. "
            "Зөв хариултын индексийг 0-эс эхэлсэн index байдлаар өг. "
            "Зөв хариултын тайлбар (яагаад зөв болохыг) бас бич. "
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


def collect_level_source_text(level: str) -> str:
    """
    Тухайн түвшний course + lesson агуулгуудыг нэг том source_text болгоно.
    """
    courses = Course.objects.filter(level=level).prefetch_related("lessons")

    parts = []
    for course in courses:
        parts.append(f"Course title: {course.title}")
        if course.description:
            parts.append(f"Course description: {course.description}")

        for lesson in course.lessons.all().order_by("order"):
            parts.append(f"Lesson title: {lesson.title}")
            if lesson.content:
                parts.append(f"Lesson content: {lesson.content}")

    return "\n\n".join(parts).strip()


def build_quiz_from_source_text(
    source_text: str,
    num_questions: int,
    purpose: str,
    fallback_topic: str,
) -> list[dict]:
    """
    source_text дээр тулгуурлан AI quiz үүсгэнэ.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(f">>> {purpose}: NO GEMINI_API_KEY, returning []")
        return []

    if not source_text.strip():
        print(f">>> {purpose}: EMPTY SOURCE TEXT, returning []")
        return []

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Энэ бол программчлал, вэб хөгжүүлэлт, алгоритм, логик сэтгэлгээтэй холбоотой "
            "e-learning платформ юм.\n\n"

            f"Доорх course болон lesson-үүдийн агуулгаас САНАА АВЧ "
            f"{num_questions} ширхэг multiple-choice асуулт зохио.\n\n"

            "ЧУХАЛ ДҮРЭМ:\n"
            "1. Асуултууд нь ЗӨВХӨН доорх агуулгад суурилсан байна.\n"
            "2. Гадны хамааралгүй мэдлэг, англи хэлний дүрэм, газарзүй, түүх, кино, ерөнхий боловсролын "
            "сэдэв БҮҮ оруул.\n"
            "3. Асуултууд нь программчлал, HTML, CSS, JavaScript, Python, Git, backend/frontend, "
            "алгоритм, логик ойлголтуудын хүрээнд байна.\n"
            "4. Хэт шууд хуулбарлаж асуухгүй, агуулгыг ойлгосон эсэхийг шалгасан байна.\n"
            "5. Бүх асуулт Монгол хэл дээр байна.\n"
            "6. Асуулт бүр 4 сонголттой байна.\n"
            "7. Нэг л зөв хариулттай байна.\n"
            "8. answer_index нь 0-ээс эхэлсэн индекс байна.\n"
            "9. explanation нь яагаад зөв болохыг товч тайлбарлана.\n\n"

            f"Quiz purpose: {purpose}\n"
            f"Fallback topic hint: {fallback_topic}\n\n"

            "Хариуг ЗӨВХӨН дараах JSON бүтэцтэй буцаа:\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "question": "Асуулт",\n'
            '      "options": ["A", "B", "C", "D"],\n'
            '      "answer_index": 1,\n'
            '      "explanation": "Тайлбар"\n'
            "    }\n"
            "  ]\n"
            "}\n\n"

            "JSON-оос өөр ямар ч тайлбар, markdown, нэмэлт текст бүү бич.\n\n"

            "Course + lesson source content:\n"
            f"{source_text}"
        )

        resp = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        raw = (resp.text or "").strip()
        print(f"RAW {purpose} >>>", raw[:300])

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
                cleaned.append(
                    {
                        "id": idx,
                        "question": str(q.get("question", "")),
                        "options": [str(o) for o in q.get("options", [])],
                        "answer_index": int(q.get("answer_index", 0)),
                        "explanation": str(q.get("explanation", "")),
                    }
                )
            except Exception as inner_e:
                print(f"{purpose} clean error:", inner_e)
                continue

        print(f">>> USING {purpose}, count:", len(cleaned))
        return cleaned

    except Exception as e:
        print(f"{purpose} error:", e)
        return []


def llm_placement_quiz(num_questions: int = 20) -> list[dict]:
    """
    Beginner түвшний course + lesson агуулгаас placement test үүсгэнэ.
    """
    source_text = collect_level_source_text("beginner")

    return build_quiz_from_source_text(
        source_text=source_text,
        num_questions=num_questions,
        purpose="PLACEMENT QUIZ",
        fallback_topic="beginner level programming and web development basics",
    )


def llm_level_up_quiz(current_level: str, num_questions: int = 10) -> list[dict]:
    """
    Одоогийн түвшний course + lesson агуулгаас level-up test үүсгэнэ.
    Жишээ:
      - beginner -> intermediate test = beginner content-ийг ойлгосон эсэх
      - intermediate -> advanced test = intermediate content-ийг ойлгосон эсэх
    """
    source_text = collect_level_source_text(current_level)

    next_level = "intermediate" if current_level == "beginner" else "advanced"

    return build_quiz_from_source_text(
        source_text=source_text,
        num_questions=num_questions,
        purpose=f"LEVEL UP QUIZ ({current_level} -> {next_level})",
        fallback_topic=f"{current_level} level programming and web development knowledge",
    )


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
    Дуусаагүй байгаа хичээлүүдээс user-ийн level-д таарсан recommendation.
    """
    user = request.user

    completed_ids = LessonProgress.objects.filter(
        user=user,
        is_completed=True,
    ).values_list("lesson_id", flat=True)

    user_level = getattr(user, "skill_level", None)

    qs = Lesson.objects.exclude(id__in=completed_ids).select_related("course")

    if user_level in ["beginner", "intermediate", "advanced"]:
        qs = qs.filter(course__level=user_level)

    qs = qs.order_by("course__title", "order")[:5]

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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def placement_quiz(request):
    """
    Анхны түвшин тогтоох placement test.
    Beginner content-оос асуулт авна.
    """
    questions = llm_placement_quiz(num_questions=20)
    return Response({"questions": questions}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def level_up_quiz(request):
    user = request.user
    current_level = getattr(user, "skill_level", "beginner")

    if current_level == "advanced":
        return Response(
            {"detail": "You are already at the highest level."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    questions = llm_level_up_quiz(current_level=current_level, num_questions=10)

    next_level = "intermediate" if current_level == "beginner" else "advanced"

    return Response(
        {
            "current_level": current_level,
            "next_level": next_level,
            "questions": questions,
        },
        status=status.HTTP_200_OK,
    )