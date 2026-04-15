import { useEffect, useState } from "react";
import { API_ORIGIN, getApiErrorMessage } from "../api/axios";
import {
  changePasswordApi,
  updateProfileApi,
} from "../api/auth";
import { getProgressSummary, type ProgressSummary } from "../api/progress";
import useAuth from "../hooks/useAuth";
import LoadingState from "../components/LoadingState";
import "../style/profile.css";

function resolveMediaUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_ORIGIN}${image}`;
}

type UserLevel = "beginner" | "elementary" | "intermediate" | "advanced";

const levelLabels: Record<UserLevel, string> = {
  beginner: "Анхан",
  elementary: "Суурь",
  intermediate: "Дунд",
  advanced: "Ахисан",
};

export default function Profile() {
  const { user, refreshUser, setUser } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    nickname: "",
  });
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        nickname: user.nickname || user.display_name || "",
      });
    }
  }, [user]);

  useEffect(() => {
    getProgressSummary()
      .then(setSummary)
      .catch(() => setError("Профайлын мэдээллийг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setAvatarPreview(resolveMediaUrl(user?.avatar_url));
  }, [avatarFile, user?.avatar_url]);

  const levelText = levelLabels[(user?.skill_level as UserLevel) || "beginner"] || "Анхан";

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("nickname", form.nickname);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updatedUser = await updateProfileApi(formData);
      setUser(updatedUser);
      setProfileMessage("Профайл амжилттай шинэчлэгдлээ.");
      setAvatarFile(null);
      await refreshUser();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Профайл шинэчлэх үед алдаа гарлаа."));
    }
  };

  const handlePasswordSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage("");
    setError("");

    try {
      await changePasswordApi(passwords.current_password, passwords.new_password);
      setPasswordMessage("Нууц үг амжилттай солигдлоо.");
      setPasswords({ current_password: "", new_password: "" });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Нууц үг солих үед алдаа гарлаа."));
    }
  };

  if (!user || loading || !summary) {
    return (
      <div className="container page-shell">
        <LoadingState
          title="Profile бэлдэж байна"
          subtitle="Таны account болон ахицын мэдээллийг нэгтгэж байна..."
        />
      </div>
    );
  }

  return (
    <div className="container page-shell profile-page">

      {(error || profileMessage || passwordMessage) && (
        <p className={`profile-feedback ${error ? "error" : "success"}`}>
          {error || profileMessage || passwordMessage}
        </p>
      )}

      <div className="profile-layout">
        <section className="card profile-summary-card">
          <div className="profile-summary-hero">
            <div className="profile-avatar-wrap">
              {avatarPreview ? (
                <img className="profile-avatar-image" src={avatarPreview} alt="Profile avatar" />
              ) : (
                <div className="profile-avatar-fallback">
                  {(form.nickname || user.username).slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-identity">
              <h2>{form.nickname || user.username}</h2>
              <p>@{user.username}</p>
            </div>
          </div>

          <div className="profile-highlight-stats">
            <div className="profile-highlight-card">
              <span>Түвшин</span>
              <strong>{levelText}</strong>
            </div>
            <div className="profile-highlight-card">
              <span>Оноо</span>
              <strong>{user.total_score}</strong>
            </div>
            <div className="profile-highlight-card">
              <span>Хичээл</span>
              <strong>{user.completed_lessons}</strong>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-row">
              <span>Имэйл</span>
              <strong>{user.email}</strong>
            </div>
            <div className="profile-row">
              <span>Түвшин</span>
              <strong>{levelText}</strong>
            </div>
            <div className="profile-row">
              <span>Нийт оноо</span>
              <strong>{user.total_score}</strong>
            </div>
            <div className="profile-row">
              <span>Дуусгасан хичээл</span>
              <strong>{user.completed_lessons}</strong>
            </div>
            <div className="profile-row">
              <span>Нийт курс</span>
              <strong>{summary.courses.length}</strong>
            </div>
            <div className="profile-row">
              <span>Эрх</span>
              <strong>{user.role}</strong>
            </div>
          </div>
        </section>

        <section className="profile-form-stack">
          <form className="card profile-form-card" onSubmit={handleProfileSave}>
            <div className="profile-card-head">
              <div>
                <h2>Profile мэдээлэл</h2>
                <p>Нэр, username, email болон profile зураг шинэчилнэ.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field">
                <span>Nickname</span>
                <input
                  className="profile-input"
                  value={form.nickname}
                  onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
                />
              </label>

              <label className="profile-field">
                <span>Username</span>
                <input
                  className="profile-input"
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                />
              </label>

              <label className="profile-field">
                <span>Email</span>
                <input
                  className="profile-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </label>

              <label className="profile-field">
                <span>Profile зураг</span>
                <div className="profile-upload-box">
                  <input
                    className="input profile-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                  <small>
                    {avatarFile ? avatarFile.name : "PNG, JPG эсвэл WEBP зураг сонгоно."}
                  </small>
                </div>
              </label>
            </div>

            <button className="button" type="submit">
              Profile хадгалах
            </button>
          </form>

          <form className="card profile-form-card" onSubmit={handlePasswordSave}>
            <div className="profile-card-head">
              <div>
                <h2>Нууц үг солих</h2>
                <p>Аюулгүй байдлаа хадгалахын тулд хүчтэй нууц үг ашиглаарай.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field">
                <span>Одоогийн нууц үг</span>
                <input
                  className="profile-input"
                  type="password"
                  value={passwords.current_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, current_password: e.target.value }))
                  }
                />
              </label>

              <label className="profile-field">
                <span>Шинэ нууц үг</span>
                <input
                  className="profile-input"
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, new_password: e.target.value }))
                  }
                />
              </label>
            </div>

            <button className="button" type="submit">
              Нууц үг шинэчлэх
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
