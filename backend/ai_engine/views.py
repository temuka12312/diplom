import os
import json
import sys

import tempfile
import subprocess
from pathlib import Path

from google import genai

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from progress.models import LessonProgress
from courses.models import Lesson, Course
from users.models import User

try:
    import resource
except ImportError:
    resource = None


def apply_runner_limits():
    if resource is None:
        return

    memory_limit_bytes = 128 * 1024 * 1024
    output_file_limit_bytes = 1024 * 1024
    cpu_seconds = max(1, int(settings.RUN_CODE_TIMEOUT_SECONDS) + 1)

    for limit_name, limits in (
        (resource.RLIMIT_CPU, (cpu_seconds, cpu_seconds)),
        (resource.RLIMIT_AS, (memory_limit_bytes, memory_limit_bytes)),
        (resource.RLIMIT_FSIZE, (output_file_limit_bytes, output_file_limit_bytes)),
    ):
        try:
            resource.setrlimit(limit_name, limits)
        except (OSError, ValueError):
            pass

    if hasattr(resource, "RLIMIT_NPROC"):
        try:
            resource.setrlimit(resource.RLIMIT_NPROC, (16, 16))
        except (OSError, ValueError):
            pass


def truncate_runner_output(value: str) -> str:
    limit = int(settings.RUN_CODE_MAX_OUTPUT_CHARS)
    if len(value) <= limit:
        return value
    return f"{value[:limit]}\n...[truncated]"


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
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return simple_summarize(text)

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Доорх e-learning хичээлийн агуулгыг 1-2 өгүүлбэрт багтаан, "
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
        if not summary:
            return simple_summarize(text)
        return summary

    except Exception:
        return simple_summarize(text)


def llm_quiz(text: str, num_questions: int = 3) -> list[dict]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
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
        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)
        questions = data.get("questions", [])
        cleaned = []

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
            except Exception:
                continue

        return cleaned

    except Exception:
        return []


def llm_practice_task(text: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "title": "Жижиг практик даалгавар",
            "description": "Энэ хичээлийн агуулгад тулгуурлан богино хэмжээний практик даалгавар ажиллана уу.",
            "hint": "Хичээлийн үндсэн ойлголтыг ашиглан бодож гүйцэтгэнэ.",
            "expected_output": "Өөрийн хариулт эсвэл кодоо зөв логикоор бичсэн байна.",
        }

    try:
        client = genai.Client(api_key=api_key)

        prompt = (
            "Доорх e-learning хичээлийн агуулгад үндэслэн 1 ширхэг жижиг практик даалгавар үүсгэ. "
            "Даалгавар нь программчлал, код нөхөж бичих байж болно. "
            "Хариуг Монгол хэл дээр өг. "
            "Зөвхөн дараах JSON бүтэцтэй буцаа:\n\n"
            "{\n"
            '  "title": "Даалгаврын гарчиг",\n'
            '  "description": "Даалгаврын тайлбар",\n'
            '  "hint": "Товч hint",\n'
            '  "expected_output": "Жишээ хариу эсвэл хүлээгдэх үр дүн"\n'
            "}\n\n"
            "JSON-оос өөр ямар ч текст бүү бич.\n\n"
            f"Хичээлийн агуулга:\n{text}"
        )

        resp = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        raw = (resp.text or "").strip()
        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        return {
            "title": str(data.get("title", "")).strip(),
            "description": str(data.get("description", "")).strip(),
            "hint": str(data.get("hint", "")).strip(),
            "expected_output": str(data.get("expected_output", "")).strip(),
        }

    except Exception:
        return {
            "title": "Жижиг практик даалгавар",
            "description": "Энэ хичээлийн агуулгад тулгуурлан богино хэмжээний практик даалгавар ажиллана уу.",
            "hint": "Хичээлийн үндсэн ойлголтыг ашиглан бодож гүйцэтгэнэ.",
            "expected_output": "Өөрийн хариулт эсвэл кодоо зөв логикоор бичсэн байна.",
        }


def generate_practice_task_from_lesson(lesson: Lesson) -> dict:
    text_parts = []

    if lesson.title:
        text_parts.append(f"Lesson title: {lesson.title}")
    if lesson.content:
        text_parts.append(f"Lesson content: {lesson.content}")
    if lesson.course and lesson.course.title:
        text_parts.append(f"Course title: {lesson.course.title}")
    if lesson.course and lesson.course.description:
        text_parts.append(f"Course description: {lesson.course.description}")

    source_text = "\n\n".join(text_parts).strip()

    if not source_text:
        return {
            "title": "Жижиг практик даалгавар",
            "description": "Энэ хичээлд practice task автоматаар үүсгэх хангалттай агуулга олдсонгүй.",
            "hint": "Хичээлийн үндсэн санааг ашиглан богино дасгал хийж болно.",
            "expected_output": "Өөрийн хариултыг тайлбарлаж бичнэ.",
        }

    return llm_practice_task(source_text)


def ensure_practice_task_for_lesson(lesson: Lesson) -> Lesson:
    has_existing_task = bool(
        (lesson.practice_title or "").strip()
        or (lesson.practice_description or "").strip()
        or (lesson.practice_hint or "").strip()
        or (lesson.practice_expected_output or "").strip()
    )

    if has_existing_task:
        return lesson

    generated = generate_practice_task_from_lesson(lesson)

    lesson.practice_title = generated.get("title", "")
    lesson.practice_description = generated.get("description", "")
    lesson.practice_hint = generated.get("hint", "")
    lesson.practice_expected_output = generated.get("expected_output", "")

    lesson.save(
        update_fields=[
            "practice_title",
            "practice_description",
            "practice_hint",
            "practice_expected_output",
        ]
    )

    return lesson


def collect_level_source_text(level: str) -> str:
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
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return []

    if not source_text.strip():
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
            "2. Гадны хамааралгүй мэдлэг бүү оруул.\n"
            "3. Асуултууд нь программчлал, HTML, CSS, JavaScript, Python, Git, backend/frontend, "
            "алгоритм, логик ойлголтуудын хүрээнд байна.\n"
            "4. Бүх асуулт Монгол хэл дээр байна.\n"
            "5. Асуулт бүр 4 сонголттой байна.\n"
            "6. Нэг л зөв хариулттай байна.\n"
            "7. answer_index нь 0-ээс эхэлсэн индекс байна.\n"
            "8. explanation нь яагаад зөв болохыг товч тайлбарлана.\n\n"
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
        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)
        questions = data.get("questions", [])
        cleaned = []

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
            except Exception:
                continue

        return cleaned

    except Exception:
        return []


def llm_placement_quiz(num_questions: int = 20) -> list[dict]:
    source_text = collect_level_source_text("beginner")
    return build_quiz_from_source_text(
        source_text=source_text,
        num_questions=num_questions,
        purpose="PLACEMENT QUIZ",
        fallback_topic="beginner level programming and web development basics",
    )


def llm_level_up_quiz(current_level: str, num_questions: int = 10) -> list[dict]:
    source_text = collect_level_source_text(current_level)
    next_level = "intermediate" if current_level == "beginner" else "advanced"

    return build_quiz_from_source_text(
        source_text=source_text,
        num_questions=num_questions,
        purpose=f"LEVEL UP QUIZ ({current_level} -> {next_level})",
        fallback_topic=f"{current_level} level programming and web development knowledge",
    )


def sanitize_questions(questions: list[dict]) -> list[dict]:
    safe_questions = []
    for q in questions:
        safe_questions.append(
            {
                "id": q.get("id"),
                "question": q.get("question"),
                "options": q.get("options", []),
                "explanation": q.get("explanation", ""),
            }
        )
    return safe_questions


def grade_answers(questions: list[dict], answers: list[int]) -> tuple[int, int, int]:
    total = len(questions)
    correct = 0

    for i, q in enumerate(questions):
        chosen = answers[i] if i < len(answers) else None
        if chosen == q.get("answer_index"):
            correct += 1

    percent = round((correct / total) * 100) if total > 0 else 0
    return correct, total, percent


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_quiz(request, lesson_id):
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
        summary = "This lesson has a PDF file, but text extraction is not implemented yet."
    else:
        summary = llm_summarize(text)

    return Response(
        {
            "lesson_id": lesson.id,
            "title": lesson.title,
            "summary": summary,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommended_lessons(request):
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
    questions = llm_placement_quiz(num_questions=20)

    if not questions:
        return Response(
            {"detail": "Placement test generation failed."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    request.session["placement_questions"] = questions

    return Response(
        {"questions": sanitize_questions(questions)},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def placement_quiz_submit(request):
    answers = request.data.get("answers", [])

    if not isinstance(answers, list):
        return Response(
            {"detail": "answers must be a list"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    questions = request.session.get("placement_questions")
    if not questions:
        return Response(
            {"detail": "No active placement test found. Please reload the test."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    correct, total, percent = grade_answers(questions, answers)

    level = "beginner"
    if percent >= 70:
        level = "advanced"
    elif percent >= 40:
        level = "intermediate"

    user: User = request.user
    user.skill_level = level
    user.has_placement_test = True
    user.save(update_fields=["skill_level", "has_placement_test"])

    request.session.pop("placement_questions", None)

    return Response(
        {
            "correct": correct,
            "total": total,
            "percent": percent,
            "level": level,
            "message": f"Таны түвшин {level} гэж тогтоогдлоо.",
        },
        status=status.HTTP_200_OK,
    )


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

    if not questions:
        return Response(
            {"detail": "Level-up test generation failed."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    next_level = "intermediate" if current_level == "beginner" else "advanced"

    request.session["level_up_questions"] = questions
    request.session["level_up_current_level"] = current_level
    request.session["level_up_next_level"] = next_level

    return Response(
        {
            "current_level": current_level,
            "next_level": next_level,
            "questions": sanitize_questions(questions),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def level_up_quiz_submit(request):
    answers = request.data.get("answers", [])

    if not isinstance(answers, list):
        return Response(
            {"detail": "answers must be a list"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    questions = request.session.get("level_up_questions")
    current_level = request.session.get("level_up_current_level")
    next_level = request.session.get("level_up_next_level")

    if not questions or not current_level or not next_level:
        return Response(
            {"detail": "No active level-up test found. Please reload the test."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    correct, total, percent = grade_answers(questions, answers)
    passed = percent >= 70

    user: User = request.user

    if passed:
        user.skill_level = next_level
        user.save(update_fields=["skill_level"])

    request.session.pop("level_up_questions", None)
    request.session.pop("level_up_current_level", None)
    request.session.pop("level_up_next_level", None)

    return Response(
        {
            "current_level": current_level,
            "next_level": next_level,
            "passed": passed,
            "correct": correct,
            "total": total,
            "percent": percent,
            "new_level": user.skill_level,
            "message": (
                f"Тэнцлээ. Таны шинэ түвшин: {next_level}"
                if passed
                else "Тэнцсэнгүй. Дахин оролдоно уу."
            ),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    message = request.data.get("message", "")

    if not message:
        return Response({"reply": "Хоосон асуулт байна."})

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return Response({"reply": "AI ажиллахгүй байна."})

    try:
        client = genai.Client(api_key=api_key)
        user = request.user

        prompt = (
            "Чи e-learning платформын AI туслах юм. "
            "Programming, course, lesson, learning зөвлөгөө өгнө. "
            "Хариултаа markdown хэлбэрээр, цэвэр шинэ мөртэй, шаардлагатай бол numbered list ашиглан өг."
            "Монгол хэл дээр, ойлгомжтой, товч хариул.\n\n"
            f"User level: {getattr(user, 'skill_level', 'unknown')}\n"
            f"User message: {message}"
        )

        resp = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        reply = (resp.text or "").strip()
        return Response({"reply": reply})

    except Exception:
        return Response({"reply": "Алдаа гарлаа."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def run_code(request):
    if not settings.RUN_CODE_ENABLED:
        return Response(
            {"detail": "Code runner is disabled."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    language = (request.data.get("language") or "").strip().lower()
    code = request.data.get("code", "")

    if language != "python":
        return Response(
            {"detail": "Одоогоор зөвхөн Python дэмжинэ."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not isinstance(code, str) or not code.strip():
        return Response(
            {"detail": "Код хоосон байна."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(code) > settings.RUN_CODE_MAX_CHARS:
        return Response(
            {"detail": "Код хэт урт байна."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        with tempfile.TemporaryDirectory(prefix="lesson-runner-") as temp_dir:
            temp_path = Path(temp_dir) / "main.py"
            temp_path.write_text(code, encoding="utf-8")

            result = subprocess.run(
                [sys.executable, "-I", str(temp_path)],
                capture_output=True,
                text=True,
                timeout=settings.RUN_CODE_TIMEOUT_SECONDS,
                cwd=temp_dir,
                env={"PYTHONIOENCODING": "utf-8"},
                preexec_fn=apply_runner_limits if os.name == "posix" else None,
            )

        output = truncate_runner_output((result.stdout or "").strip())
        error = truncate_runner_output((result.stderr or "").strip())

        return Response(
            {
                "output": output,
                "error": error,
                "exit_code": result.returncode,
            },
            status=status.HTTP_200_OK,
        )

    except subprocess.TimeoutExpired:
        return Response(
            {
                "output": "",
                "error": "Execution timed out. Код хэт удаан ажиллаж байна.",
                "exit_code": -1,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {
                "output": "",
                "error": f"Runner error: {str(e)}",
                "exit_code": -1,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
