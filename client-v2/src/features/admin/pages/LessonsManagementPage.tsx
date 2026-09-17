import { useState } from "react";

interface Lesson {
id: number;
title: string;
description: string;
status: "منشور" | "مسودة";
}

export default function LessonsManagementPage() {
const [lessons, setLessons] = useState<Lesson[]>([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [showForm, setShowForm] = useState(false);

function handleAddLesson() {
const trimmedTitle = title.trim();

if (!trimmedTitle) {
  return;
}

const newLesson: Lesson = {
  id: Date.now(),
  title: trimmedTitle,
  description: description.trim(),
  status: "مسودة",
};

setLessons((current) => [newLesson, ...current]);

setTitle("");
setDescription("");
setShowForm(false);
}

function handleDeleteLesson(id: number) {
setLessons((current) =>
current.filter((lesson) => lesson.id !== id)
);
}

return (
<div
dir="rtl"
style={{
minHeight: "100vh",
background: "#f8fafc",
padding: "32px",
color: "#111827",
fontFamily: "Cairo, sans-serif",
}}
>
{/* Header */}
<div
style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "20px",
marginBottom: "28px",
flexWrap: "wrap",
}}
> <div>
<h1
style={{
margin: 0,
fontSize: "30px",
fontWeight: 800,
color: "#0f172a",
}}
>
إدارة الدروس </h1>

```
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "15px",
          color: "#64748b",
        }}
      >
        إدارة وتنظيم الدروس داخل منصة UniShare
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowForm((value) => !value)}
      style={{
        border: "none",
        borderRadius: "12px",
        padding: "12px 20px",
        background:
          "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.18)",
      }}
    >
      {showForm ? "إلغاء" : "+ إضافة درس"}
    </button>
  </div>

  {/* Add lesson form */}
  {showForm && (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: "20px",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        إضافة درس جديد
      </h2>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <div>
          <label
            htmlFor="lesson-title"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#374151",
            }}
          >
            عنوان الدرس
          </label>

          <input
            id="lesson-title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="اكتب عنوان الدرس"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              padding: "12px 14px",
              outline: "none",
              fontSize: "15px",
              background: "#ffffff",
              color: "#111827",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="lesson-description"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#374151",
            }}
          >
            وصف الدرس
          </label>

          <textarea
            id="lesson-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="اكتب وصفًا مختصرًا للدرس"
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              padding: "12px 14px",
              outline: "none",
              resize: "vertical",
              fontSize: "15px",
              background: "#ffffff",
              color: "#111827",
            }}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleAddLesson}
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "11px 20px",
              background: "#3b82f6",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            حفظ الدرس
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Statistics */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    }}
  >
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        إجمالي الدروس
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {lessons.length}
      </div>
    </div>

    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        المنشورة
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#16a34a",
        }}
      >
        {lessons.filter(
          (lesson) => lesson.status === "منشور"
        ).length}
      </div>
    </div>

    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        المسودات
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#f59e0b",
        }}
      >
        {lessons.filter(
          (lesson) => lesson.status === "مسودة"
        ).length}
      </div>
    </div>
  </div>

  {/* Lessons list */}
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "19px",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        قائمة الدروس
      </h2>
    </div>

    {lessons.length === 0 ? (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            marginBottom: "12px",
          }}
        >
          📚
        </div>

        <h3
          style={{
            margin: "0 0 8px",
            color: "#334155",
            fontSize: "18px",
          }}
        >
          لا توجد دروس حاليًا
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          اضغط على «إضافة درس» لإنشاء أول درس.
        </p>
      </div>
    ) : (
      <div>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "220px" }}>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {lesson.title}
              </h3>

              {lesson.description && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {lesson.description}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "999px",
                  background: "#fef3c7",
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {lesson.status}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleDeleteLesson(lesson.id)
                }
                style={{
                  border: "1px solid #fecaca",
                  borderRadius: "9px",
                  padding: "8px 12px",
                  background: "#ffffff",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
}