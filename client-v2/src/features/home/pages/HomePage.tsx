import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Library,
  Users,
  University,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import UniShareLogo from "../../../components/brand/UniShareLogo";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[var(--unishare-background)]
        text-[var(--unishare-text)]
      "
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-[var(--unishare-border)]
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            sm:px-6
            lg:px-8
          "
        >
          {/* Brand */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              rounded-xl
              transition
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--unishare-blue)]/30
            "
            aria-label="UniShare"
          >
            <UniShareLogo />
          </button>

          {/* Actions */}

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[var(--unishare-blue)]
                transition
                hover:bg-blue-50
                sm:px-5
              "
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="
                rounded-xl
                bg-[var(--unishare-blue)]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-md
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:bg-[var(--unishare-indigo)]
                hover:shadow-lg
                sm:px-5
              "
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          pt-32
          pb-20
          text-white
          sm:pt-36
          sm:pb-24
        "
        style={{
          backgroundImage: "var(--unishare-gradient)",
        }}
      >
        {/* Decorative background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-cyan-300/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            max-w-7xl
            items-center
            gap-12
            px-5
            sm:px-6
            lg:grid-cols-2
            lg:px-8
          "
        >
          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div className="max-w-2xl">
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-sm
                font-medium
                text-blue-50
                backdrop-blur
              "
            >
              <GraduationCap size={17} />

              <span>
                مجتمع جامعي واحد
              </span>
            </div>

            <h1
              className="
                text-4xl
                font-extrabold
                leading-[1.25]
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              منصتك الجامعية الذكية

              <br />

              <span className="text-blue-50">
                شارك المعرفة وابنِ مستقبلك
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-xl
                text-base
                leading-8
                text-blue-50
                sm:text-lg
              "
            >
              UniShare منصة جامعية تجمع الطلبة والأساتذة
              والمحتوى الأكاديمي في مكان واحد، للوصول إلى
              الدروس والملفات والامتحانات والموارد التعليمية
              بسهولة.
            </p>

            {/* CTA */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-7
                  py-3.5
                  font-bold
                  text-[var(--unishare-blue)]
                  shadow-xl
                  shadow-blue-900/20
                  transition
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >
                إنشاء حساب

                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/40
                  bg-white/5
                  px-7
                  py-3.5
                  font-bold
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-white
                  hover:text-[var(--unishare-blue)]
                "
              >
                تسجيل الدخول
              </button>
            </div>
          </div>

          {/* =================================================
              HERO VISUAL
          ================================================= */}

          <div className="hidden lg:flex lg:justify-center">
            <div
              className="
                relative
                w-full
                max-w-md
                rounded-[2rem]
                border
                border-white/20
                bg-white/10
                p-8
                shadow-2xl
                shadow-blue-950/20
                backdrop-blur-xl
              "
            >
              <div className="flex justify-center">
                {/* Logo — بدون طبقة بيضاء */}

                <div
                  className="
                    rounded-3xl
                    bg-transparent
                    p-6
                  "
                >
                  <UniShareLogo
                    showText={false}
                    compact
                    className="scale-[1.8]"
                  />
                </div>
              </div>

              <div className="mt-10 text-center">
                <h2 className="text-2xl font-extrabold">
                  مجتمع جامعي متكامل
                </h2>

                <p className="mt-3 text-blue-50">
                  تعلم، شارك، وتطور مع مجتمعك الجامعي.
                </p>
              </div>

              <div
                className="
                  mt-8
                  grid
                  grid-cols-3
                  gap-3
                "
              >
                {[
                  {
                    icon: BookOpen,
                    label: "تعلم",
                  },
                  {
                    icon: Users,
                    label: "تواصل",
                  },
                  {
                    icon: GraduationCap,
                    label: "تطور",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/10
                        p-4
                        text-center
                      "
                    >
                      <Icon
                        className="mx-auto"
                        size={22}
                      />

                      <span className="mt-2 block text-xs font-semibold">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="relative z-10 -mt-8 px-5 sm:px-6">
        <div
          className="
            mx-auto
            grid
            max-w-6xl
            grid-cols-2
            gap-4
            md:grid-cols-4
          "
        >
          {[
            {
              icon: University,
              title: "الجامعات",
            },
            {
              icon: BookOpen,
              title: "المقررات",
            },
            {
              icon: Library,
              title: "الموارد",
            },
            {
              icon: Users,
              title: "الطلبة",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-[var(--unishare-border)]
                  bg-white
                  p-5
                  text-center
                  shadow-lg
                  shadow-slate-900/5
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--unishare-gradient-soft)]
                    text-[var(--unishare-blue)]
                  "
                >
                  <Icon size={23} />
                </div>

                <h3 className="mt-3 font-bold text-[var(--unishare-navy)]">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="
                inline-flex
                rounded-full
                bg-blue-50
                px-4
                py-2
                text-sm
                font-bold
                text-[var(--unishare-blue)]
              "
            >
              لماذا UniShare؟
            </span>

            <h2
              className="
                mt-4
                text-3xl
                font-extrabold
                tracking-tight
                text-[var(--unishare-navy)]
                sm:text-4xl
              "
            >
              كل ما يحتاجه الطالب في مكان واحد
            </h2>

            <p className="mt-4 leading-7 text-[var(--unishare-muted)]">
              منصة مصممة لتجعل الحياة الجامعية أكثر سهولة،
              تفاعلاً وتنظيماً.
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              gap-6
              md:grid-cols-3
            "
          >
            {[
              {
                icon: University,
                title: "الجامعات",
                text: "استكشف الجامعات والكليات والتخصصات وابحث عن المسار الأكاديمي المناسب لك.",
              },
              {
                icon: BookOpen,
                title: "المصادر التعليمية",
                text: "الوصول إلى المحاضرات والملفات العلمية والموارد الأكاديمية بسهولة.",
              },
              {
                icon: Library,
                title: "الامتحانات السابقة",
                text: "استعد لامتحاناتك من خلال الوصول إلى نماذج ومصادر أكاديمية مفيدة.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    group
                    rounded-3xl
                    border
                    border-[var(--unishare-border)]
                    bg-white
                    p-7
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-xl
                    hover:shadow-blue-500/10
                  "
                >
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[var(--unishare-gradient-soft)]
                      text-[var(--unishare-blue)]
                      transition
                      group-hover:scale-105
                    "
                  >
                    <Icon size={27} />
                  </div>

                  <h3
                    className="
                      mt-6
                      text-xl
                      font-extrabold
                      text-[var(--unishare-navy)]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      leading-7
                      text-[var(--unishare-muted)]
                    "
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[var(--unishare-navy)]
          py-20
          text-center
          text-white
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-64
            w-64
            -translate-x-1/2
            rounded-full
            bg-blue-500/20
            blur-3xl
          "
        />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
          <div className="flex justify-center">
            <UniShareLogo
              showText={false}
              compact
              className="rounded-2xl bg-white p-3"
            />
          </div>

          <h2 className="mt-7 text-3xl font-extrabold sm:text-4xl">
            جاهز للانضمام إلى UniShare؟
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
            ابدأ رحلتك الجامعية، تواصل مع مجتمعك وشارك المعرفة.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              px-8
              py-3.5
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
            style={{
              backgroundImage: "var(--unishare-gradient)",
            }}
          >
            إنشاء حساب مجاني

            <ArrowLeft size={18} />
          </button>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          border-t
          border-slate-800
          bg-slate-950
          px-5
          py-8
          text-center
          text-sm
          text-slate-400
        "
      >
        <div className="flex justify-center">
          <UniShareLogo
            showText={false}
            compact
          />
        </div>

        <p className="mt-4">
          © 2026 UniShare
        </p>

        <p className="mt-1">
          جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}