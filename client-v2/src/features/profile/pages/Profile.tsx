import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Edit3,
  GraduationCap,
  MessageCircle,
  PenLine,
  User,
  UserPlus,
  UserRound,
} from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";

import PostCard from "../../posts/components/PostCard";
import type { Post } from "../../posts/types/post";

import GemsCard from "../../gamification/components/GemsCard";
import BadgeCard from "../../gamification/components/BadgeCard";
import { getUserGamification } from "../../gamification/api/getGamification";
import { getGamificationBadges } from "../../gamification/api/getBadges";

import { sendFriendRequest } from "../../friends/api/sendFriendRequest";
import { createConversation } from "../../messages/api/createConversation";

import type {
  GamificationBadge,
  UserBadge,
} from "../../gamification/types/gamification";

// =====================================================
// TYPES
// =====================================================

interface ProfileData {
  id: string;
  user_id?: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  age: number | null;
  avatar_url: string | null;
  faculty_id: string | null;
  specialty_id: string | null;
}

interface FacultyData {
  name: string;
}

interface SpecialtyData {
  name: string;
}

// =====================================================
// COMPONENT
// =====================================================

export default function Profile() {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams<{ userId: string }>();

  // ===================================================
  // PROFILE STATE
  // ===================================================

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [specialty, setSpecialty] = useState<SpecialtyData | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsCount, setPostsCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // ===================================================
  // CURRENT USER / PROFILE OWNER
  // ===================================================

  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // ===================================================
  // FRIEND STATE
  // ===================================================

  const [friendRequestLoading, setFriendRequestLoading] =
    useState(false);

  const [friendRequestSent, setFriendRequestSent] =
    useState(false);

  // ===================================================
  // MESSAGE STATE
  // ===================================================

  const [messageLoading, setMessageLoading] = useState(false);

  // ===================================================
  // GAMIFICATION STATE
  // ===================================================

  const [gems, setGems] = useState(0);
  const [badges, setBadges] = useState<GamificationBadge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [gamificationLoading, setGamificationLoading] = useState(true);

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    loadProfile();
  }, [routeUserId]);

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  async function loadProfile() {
    try {
      setLoading(true);
      setGamificationLoading(true);

      // Reset previous profile data when navigating
      // from one user profile to another.
      setProfile(null);
      setFaculty(null);
      setSpecialty(null);
      setPosts([]);
      setPostsCount(0);
      setGems(0);
      setBadges([]);
      setUserBadges([]);

      setFriendRequestLoading(false);
      setFriendRequestSent(false);
      setMessageLoading(false);

      // -----------------------------------------------
      // CURRENT AUTH USER
      // -----------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      // -----------------------------------------------
      // TARGET USER
      // -----------------------------------------------

      const targetUserId = routeUserId || user.id;

      setProfileUserId(targetUserId);
      setIsOwnProfile(targetUserId === user.id);

      // -----------------------------------------------
      // PROFILE
      // -----------------------------------------------

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            `
              id,
              user_id,
              full_name,
              username,
              bio,
              age,
              avatar_url,
              faculty_id,
              specialty_id
            `
          )
          .eq("user_id", targetUserId)
          .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        setProfile(null);
        setGamificationLoading(false);
        return;
      }

      setProfile(profileData);

      // -----------------------------------------------
      // FACULTY
      // -----------------------------------------------

      if (profileData.faculty_id) {
        const { data: facultyData, error: facultyError } =
          await supabase
            .from("faculties")
            .select("name")
            .eq("id", profileData.faculty_id)
            .maybeSingle();

        if (!facultyError && facultyData) {
          setFaculty(facultyData);
        }
      }

      // -----------------------------------------------
      // SPECIALTY
      // -----------------------------------------------

      if (profileData.specialty_id) {
        const { data: specialtyData, error: specialtyError } =
          await supabase
            .from("specialties")
            .select("name")
            .eq("id", profileData.specialty_id)
            .maybeSingle();

        if (!specialtyError && specialtyData) {
          setSpecialty(specialtyData);
        }
      }

      // -----------------------------------------------
      // POSTS COUNT
      // -----------------------------------------------

      const { count: countData, error: countError } =
        await supabase
          .from("posts")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", targetUserId);

      if (!countError) {
        setPostsCount(countData ?? 0);
      }

      // -----------------------------------------------
      // USER POSTS
      // -----------------------------------------------

      const { data: postsData, error: postsError } =
        await supabase
          .from("posts")
          .select("*")
          .eq("user_id", targetUserId)
          .order("created_at", {
            ascending: false,
          });

      if (!postsError && postsData) {
        setPosts(postsData as Post[]);
      }

      // -----------------------------------------------
      // GAMIFICATION
      // -----------------------------------------------

      try {
        const [gamificationData, badgesData] = await Promise.all([
          getUserGamification(targetUserId),
          getGamificationBadges(targetUserId),
        ]);

        setGems(gamificationData.gamification?.gems ?? 0);
        setBadges(badgesData.badges ?? []);
        setUserBadges(badgesData.userBadges ?? []);
      } catch (gamificationError) {
        console.error(
          "Error loading profile gamification:",
          gamificationError
        );

        // Gamification failure must not prevent
        // the profile itself from appearing.
        setGems(0);
        setBadges([]);
        setUserBadges([]);
      } finally {
        setGamificationLoading(false);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setGamificationLoading(false);
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // SEND FRIEND REQUEST
  // ===================================================

  async function handleAddFriend() {
    if (!profileUserId || isOwnProfile) {
      return;
    }

    try {
      setFriendRequestLoading(true);

      await sendFriendRequest(profileUserId);

      setFriendRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);

      const message =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إرسال طلب الصداقة";

      window.alert(message);
    } finally {
      setFriendRequestLoading(false);
    }
  }

  // ===================================================
  // OPEN MESSAGE
  // ===================================================

  async function handleSendMessage() {
    if (!profileUserId || isOwnProfile) {
      return;
    }

    try {
      setMessageLoading(true);

      const conversationId =
        await createConversation(profileUserId);

      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("Error opening conversation:", error);

      const message =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء فتح المحادثة";

      window.alert(message);
    } finally {
      setMessageLoading(false);
    }
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          جاري تحميل الملف الشخصي...
        </div>
      </div>
    );
  }

  // ===================================================
  // NO PROFILE
  // ===================================================

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <UserRound className="mx-auto h-12 w-12 text-gray-400" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            الملف الشخصي غير موجود
          </h2>

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => navigate("/complete-profile")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              إكمال الملف الشخصي
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===================================================
  // UNLOCKED BADGES
  // ===================================================

  const unlockedBadgeIds = new Set(
    userBadges.map((userBadge) => userBadge.badge_id)
  );

  const unlockedBadges = badges.filter((badge) =>
    unlockedBadgeIds.has(badge.id)
  );

  // ===================================================
  // PROFILE LABELS
  // ===================================================

  const profileName = profile.full_name || "مستخدم UniShare";

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md dark:border-gray-900 dark:bg-gray-800">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileName}
                </h1>

                {profile.username && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    @{profile.username}
                  </p>
                )}

                {profile.bio && (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                PROFILE ACTIONS
            ================================================= */}

            <div className="flex flex-wrap items-center gap-2">
              {!isOwnProfile && (
                <>
                  <button
                    type="button"
                    onClick={handleAddFriend}
                    disabled={
                      friendRequestLoading ||
                      friendRequestSent
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      friendRequestSent
                        ? "cursor-default bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />

                    {friendRequestLoading
                      ? "جاري الإرسال..."
                      : friendRequestSent
                        ? "تم إرسال الطلب"
                        : "إضافة صديق"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={messageLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <MessageCircle className="h-4 w-4" />

                    {messageLoading
                      ? "جاري الفتح..."
                      : "إرسال رسالة"}
                  </button>
                </>
              )}

              {/* Edit button only for own profile */}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => navigate("/profile/edit")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                  تعديل الملف
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="flex items-center gap-3">
                <PenLine className="h-5 w-5 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    المنشورات
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {postsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-indigo-600" />

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    التخصص
                  </p>

                  <p className="mt-1 truncate text-lg font-bold text-gray-900 dark:text-white">
                    {specialty?.name || "غير محدد"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-cyan-600" />

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    الكلية
                  </p>

                  <p className="mt-1 truncate text-lg font-bold text-gray-900 dark:text-white">
                    {faculty?.name || "غير محددة"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          GAMIFICATION
      ================================================= */}

      {!gamificationLoading && (
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                المكافآت والإنجازات
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                جواهر وبادجات{" "}
                {isOwnProfile
                  ? "الخاصة بك"
                  : `الخاصة بـ ${profileName}`}
              </p>
            </div>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => navigate("/gamification")}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                عرض الكل
              </button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Gems */}
            <div className="lg:col-span-1">
              <GemsCard gems={gems} />
            </div>

            {/* Badges */}
            <div className="lg:col-span-2">
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      البادجات
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {unlockedBadges.length} من {badges.length} بادج مفتوح
                    </p>
                  </div>

                  <span className="text-2xl">🏆</span>
                </div>

                {badges.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 px-4 py-8 text-center dark:bg-gray-800/60">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      لا توجد بادجات متاحة حاليًا.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {badges.slice(0, 3).map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        unlocked={unlockedBadgeIds.has(badge.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          ACADEMIC INFO
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              المعلومات الأكاديمية
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              المسار الدراسي
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-indigo-600" />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  الكلية
                </p>

                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {faculty?.name || "غير محددة"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-indigo-600" />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  التخصص
                </p>

                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {specialty?.name || "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          PERSONAL INFO
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950">
            <UserRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              المعلومات الشخصية
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              المعلومات الأساسية
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  الاسم الكامل
                </p>

                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {profile.full_name || "غير محدد"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  العمر
                </p>

                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {profile.age ? `${profile.age} سنة` : "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          POSTS
      ================================================= */}

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile
                ? "منشوراتي"
                : `منشورات ${profileName}`}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isOwnProfile
                ? "آخر ما نشرته على UniShare"
                : "آخر المنشورات التي شاركها على UniShare"}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {postsCount}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <PenLine className="mx-auto h-10 w-10 text-gray-400" />

            <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
              {isOwnProfile
                ? "لم تنشر أي منشور بعد"
                : "لا توجد منشورات لهذا المستخدم بعد"}
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {isOwnProfile
                ? "ابدأ بمشاركة المعرفة مع مجتمعك الجامعي."
                : "ستظهر المنشورات هنا عند مشاركتها على UniShare."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* =================================================
          FOOTER CTA
      ================================================= */}

      {isOwnProfile && (
        <section className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                شارك معرفتك مع مجتمع UniShare
              </h2>

              <p className="mt-1 text-sm text-white/80">
                كل مساهمة منك يمكن أن تساعد طالبًا آخر وتكسبك Gems وبادجات.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-gray-100"
            >
              <PenLine className="h-4 w-4" />
              إنشاء منشور
            </button>
          </div>
        </section>
      )}
    </div>
  );
}