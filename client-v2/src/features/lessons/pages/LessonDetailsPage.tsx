import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getLessonById,
} from "../api/lessons";

import type {
  Lesson,
} from "../api/lessons";

export default function LessonDetailsPage() {
  const params =
    useParams<{ id: string }>();

  const id =
    params.id;

  const navigate =
    useNavigate();

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("معرف الدرس غير موجود.");
      setLoading(false);
      return;
    }

    async function loadLesson(lessonId: string) {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getLessonById(lessonId);

        if (!data) {
          setError(
            "لم يتم العثور على هذا الدرس."
          );
          setLesson(null);
          return;
        }

        setLesson(data);
      } catch (err) {
        console.error(
          "LOAD LESSON ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل الدرس."
        );

        setLesson(null);
      } finally {
        setLoading(false);
      }
    }

    loadLesson(id);
  }, [id]);

  function handleBack() {
    if (lesson?.subject_id) {
      navigate(
        `/subjects/${lesson.subject_id}/lessons`
      );
      return;
    }

    navigate(-1);
  }

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6"
      >
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />

            <p className="text-sm text-slate-500">
              جاري تحميل الدرس...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6"
      >
        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الدروس
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h1 className="text-xl font-bold text-red-700">
              تعذر تحميل الدرس
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error ??
                "لم يتم العثور على هذا الدرس."}
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50"
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* العودة */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الدروس
        </button>

        {/* الدرس */}

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}

          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-6 py-8 text-white sm:px-8 lg:px-10">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <BookOpen className="h-7 w-7" />
              </div>

              <div className="min-w-0">

                <p className="mb-2 text-sm font-medium text-white/80">
                  درس
                </p>

                <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                  {lesson.title}
                </h1>

              </div>

            </div>

          </div>

          {/* Body */}

          <div className="p-6 sm:p-8 lg:p-10">

            {/* الوصف */}

            {lesson.description && (
              <section className="mb-8">

                <div className="mb-3 flex items-center gap-2">

                  <div className="h-8 w-1 rounded-full bg-blue-600" />

                  <h2 className="text-lg font-bold text-slate-800">
                    وصف الدرس
                  </h2>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm leading-7 text-slate-600">
                    {lesson.description}
                  </p>

                </div>

              </section>
            )}

            {/* المحتوى */}

            <section>

              <div className="mb-4 flex items-center gap-2">

                <div className="h-8 w-1 rounded-full bg-indigo-600" />

                <h2 className="text-lg font-bold text-slate-800">
                  محتوى الدرس
                </h2>

              </div>

              {lesson.content ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                  <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                    {lesson.content}
                  </div>

                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <p className="text-sm text-slate-500">
                    لا يوجد محتوى لهذا الدرس بعد.
                  </p>

                </div>
              )}

            </section>

            {/* التاريخ */}

            {lesson.created_at && (
              <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">

                <CalendarDays className="h-4 w-4" />

                <span>
                  تمت إضافة الدرس في{" "}
                  {new Date(
                    lesson.created_at
                  ).toLocaleDateString("ar-DZ")}
                </span>

              </div>
            )}

          </div>

        </article>

      </div>
    </div>
  );
}