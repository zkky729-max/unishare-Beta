import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  Building2,
  GraduationCap,
  LogOut,
  MessageSquare,
  UserRound,
} from "lucide-react";

import {
  useAuth,
} from "../../auth/context/AuthContext";

import {
  supabase,
} from "../../../lib/supabaseClient";

import {
  getPosts,
} from "../../posts/api/getPosts";

import PostCard from "../../posts/components/PostCard";

import type {
  Post,
} from "../../posts/types/post";

interface AcademicData {
  universityId: string | null;
  universityName: string | null;
  facultyName: string | null;
  specialtyName: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    profile,
    loading: authLoading,
    signOut,
  } = useAuth();

  const [
    academic,
    setAcademic,
  ] = useState<AcademicData>({
    universityId: null,
    universityName: null,
    facultyName: null,
    specialtyName: null,
  });

  const [
    academicLoading,
    setAcademicLoading,
  ] = useState(true);

  const [
    universityPosts,
    setUniversityPosts,
  ] = useState<Post[]>([]);

  const [
    postsLoading,
    setPostsLoading,
  ] = useState(true);

  // =====================================================
  // Load Dashboard Data
  // =====================================================

  useEffect(() => {
    if (!profile) {
      setAcademicLoading(false);
      setPostsLoading(false);

      return;
    }

    loadDashboardData();
  }, [profile]);

  async function loadDashboardData() {
    if (!profile) {
      return;
    }

    setAcademicLoading(true);
    setPostsLoading(true);

    try {
      let universityId: string | null = null;
      let universityName: string | null = null;
      let facultyName: string | null = null;
      let specialtyName: string | null = null;

      // ===================================================
      // Faculty
      // ===================================================

      if (profile.faculty_id) {
        const {
          data: faculty,
          error: facultyError,
        } = await supabase
          .from("faculties")
          .select("name, university_id")
          .eq(
            "id",
            profile.faculty_id
          )
          .maybeSingle();

        if (facultyError) {
          console.error(
            "Dashboard faculty error:",
            facultyError
          );
        }

        facultyName =
          faculty?.name ?? null;

        universityId =
          faculty?.university_id ?? null;

        // ===============================================
        // University
        // ===============================================

        if (universityId) {
          const {
            data: university,
            error: universityError,
          } = await supabase
            .from("universities")
            .select("name")
            .eq(
              "id",
              universityId
            )
            .maybeSingle();

          if (universityError) {
            console.error(
              "Dashboard university error:",
              universityError
            );
          }

          universityName =
            university?.name ?? null;
        }
      }

      // ===================================================
      // Specialty
      // ===================================================

      if (profile.specialty_id) {
        const {
          data: specialty,
          error: specialtyError,
        } = await supabase
          .from("specialties")
          .select("name")
          .eq(
            "id",
            profile.specialty_id
          )
          .maybeSingle();

        if (specialtyError) {
          console.error(
            "Dashboard specialty error:",
            specialtyError
          );
        }

        specialtyName =
          specialty?.name ?? null;
      }

      // ===================================================
      // Save Academic Data
      // ===================================================

      setAcademic({
        universityId,
        universityName,
        facultyName,
        specialtyName,
      });

      setAcademicLoading(false);

      // ===================================================
      // University Posts
      // ===================================================

      if (universityId) {
        try {
          const posts =
            await getPosts(
              "all",
              {
                universityId,
                limit: 5,
              }
            );

          setUniversityPosts(
            posts
          );
        } catch (error) {
          console.error(
            "Dashboard university posts error:",
            error
          );

          setUniversityPosts([]);
        }
      } else {
        setUniversityPosts([]);
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setAcademic({
        universityId: null,
        universityName: null,
        facultyName: null,
        specialtyName: null,
      });

      setUniversityPosts([]);
    } finally {
      setAcademicLoading(false);
      setPostsLoading(false);
    }
  }

  // =====================================================
  // Logout
  // =====================================================

  async function handleSignOut() {
    try {
      await signOut();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  // =====================================================
  // Loading
  // =====================================================

  if (authLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            جاري تحميل حسابك...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // No User
  // =====================================================

  if (!user || !profile) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <UserRound
            size={38}
            className="mx-auto text-gray-400"
          />

          <p className="mt-4 text-gray-600">
            لم يتم العثور على بيانات الحساب.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // User Name
  // =====================================================

  const displayName =
    profile.full_name ||
    profile.username ||
    "الطالب";

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-7xl space-y-6"
    >
      {/* ================================================= */}
      {/* Welcome */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">
              مرحباً بعودتك 👋
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              هذه مساحتك الأكاديمية في UniShare.
              يمكنك متابعة جامعتك والوصول بسرعة إلى
              مسارك والموارد التعليمية.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/25"
            >
              <UserRound size={18} />

              الملف الشخصي
            </button>

            <button
              type="button"
              onClick={
                handleSignOut
              }
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
            >
              <LogOut size={18} />

              خروج
            </button>
          </div>
        </div>

        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
      </section>

      {/* ================================================= */}
      {/* Academic Identity */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap
                size={23}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                مساري الأكاديمي
              </h2>

              <p className="text-sm text-gray-500">
                المسار المرتبط بحسابك
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {academicLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                1,
                2,
                3,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-gray-100"
                  />
                )
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <AcademicItem
                icon={
                  <Building2
                    size={21}
                  />
                }
                label="الجامعة"
                value={
                  academic.universityName
                }
              />

              <AcademicItem
                icon={
                  <GraduationCap
                    size={21}
                  />
                }
                label="الكلية"
                value={
                  academic.facultyName
                }
              />

              <AcademicItem
                icon={
                  <BookOpen
                    size={21}
                  />
                }
                label="التخصص"
                value={
                  academic.specialtyName
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Quick Access */}
      {/* ================================================= */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            الوصول السريع
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            أهم الأماكن المرتبطة بمسارك الجامعي
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Faculty */}

          <QuickCard
            icon={
              <GraduationCap
                size={24}
              />
            }
            title="كلية المستخدم"
            description="استكشف أقسام كليتك"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );
              }
            }}
          />

          {/* Academic Path */}

          <QuickCard
            icon={
              <BookOpen
                size={24}
              />
            }
            title="المسار الأكاديمي"
            description="انتقل إلى مسارك الأكاديمي"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );
              }
            }}
          />

          {/* Resources */}

          <QuickCard
            icon={
              <BookOpen
                size={24}
              />
            }
            title="الموارد التعليمية"
            description="الوصول إلى الموارد الدراسية"
            disabled={
              !profile.faculty_id
            }
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate(
                "/universities"
              );
            }}
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* University Community */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                مجتمع الجامعة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                آخر المنشورات من جامعتك
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/posts")
            }
            className="flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            عرض جميع المنشورات

            <ArrowLeft
              size={17}
            />
          </button>
        </div>

        <div className="p-6">
          {postsLoading ? (
            <div className="space-y-4">
              {[
                1,
                2,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl bg-gray-100"
                  />
                )
              )}
            </div>
          ) : universityPosts.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed bg-gray-50 px-6 py-12 text-center">
              <MessageSquare
                size={34}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-4 font-semibold text-gray-800">
                لا توجد منشورات بعد
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                ستظهر هنا آخر منشورات مجتمع جامعتك
                عندما يتم نشرها.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {universityPosts.map(
                (post) => (
                  <PostCard
                    key={
                      post.id
                    }
                    post={post}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* Educational Resources */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                الموارد التعليمية
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                موارد مرتبطة بمسارك الأكاديمي
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <BookOpen
            size={38}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 font-semibold text-gray-800">
            الموارد التعليمية ستكون هنا
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
            سنربط هذا القسم بالموارد التعليمية
            الموجودة فعليًا في المشروع، ونرتبها حسب
            الجامعة والتخصص والمستوى والسداسي والوحدة.
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* Continue Academic Journey */}
      {/* ================================================= */}

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              مساحتك الأكاديمية
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {academic.specialtyName ||
                academic.facultyName ||
                academic.universityName ||
                "ابدأ مسارك الأكاديمي"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {[
                academic.universityName,
                academic.facultyName,
                academic.specialtyName,
              ]
                .filter(Boolean)
                .join(" • ") ||
                "لم يتم تحديد المسار الأكاديمي بعد"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                profile.faculty_id
              ) {
                navigate(
                  `/departments?facultyId=${encodeURIComponent(
                    profile.faculty_id
                  )}`
                );

                return;
              }

              navigate(
                "/universities"
              );
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            متابعة الدراسة

            <ArrowLeft
              size={18}
            />
          </button>
        </div>
      </section>
    </div>
  );
}

// =======================================================
// Academic Item
// =======================================================

interface AcademicItemProps {
  icon: ReactNode;
  label: string;
  value: string | null;
}

function AcademicItem({
  icon,
  label,
  value,
}: AcademicItemProps) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-5">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-xs font-medium text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm font-bold leading-6 text-gray-900">
        {value ||
          "غير محدد"}
      </p>
    </div>
  );
}

// =======================================================
// Quick Card
// =======================================================

interface QuickCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

function QuickCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: QuickCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group rounded-2xl border bg-white p-5 text-right shadow-sm transition",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>

        <ArrowLeft
          size={18}
          className="text-gray-300 transition group-hover:-translate-x-1 group-hover:text-blue-600"
        />
      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </button>
  );
}
