"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { useUserProfile } from "@core/hooks"

export type UserProfile = {
  email: string
  name: string
  role: "public" | "admin"
  avatar: string
}

type UserProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSaveProfile: (profile: UserProfile) => void
}

const AVATAR_OPTIONS = ["🌙", "👑", "✨", "📖", "🕌", "🤲", "⭐", "🌿"]

export function UserProfileModal({
  isOpen,
  onClose,
  onSaveProfile,
}: UserProfileModalProps) {
  const { profile, saveProfile } = useUserProfile()
  const [activeTab, setActiveTab] = useState<"login" | "register">("register")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"public" | "admin">("public")
  const [avatar, setAvatar] = useState("🌙")
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (profile) {
      setTimeout(() => setEmail(profile.email || ""), 0)
      setName(profile.name || "")
      setRole(profile.role || "public")
      setAvatar(profile.avatar || "🌙")
    }
  }, [profile, isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const payload = {
        action: activeTab,
        email,
        name: activeTab === "register" ? name : undefined,
        password,
        role: activeTab === "register" ? role : undefined,
        avatar_url: activeTab === "register" ? avatar : undefined,
      }

      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal menyimpan akun.")
      }

      setSuccessMsg(data.message || "Berhasil masuk ke akun Anda!")

      if (data.profile) {
        const fullProfile: UserProfile = {
          email: data.profile.email,
          name: data.profile.name,
          role: data.profile.role as "public" | "admin",
          avatar: data.profile.avatar || "🌙",
        }
        saveProfile(fullProfile)
        onSaveProfile(fullProfile)
        setTimeout(() => onClose(), 800)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungkan ke server.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <div>
              <DialogTitle className="text-base font-extrabold">
                Autentikasi & Akun Pengguna
              </DialogTitle>
              <DialogDescription className="text-[10px]">
                Disimpan Permanen di Supabase Cloud DB
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="mb-4 flex rounded-xl border border-border/40 bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("register")
              setErrorMsg("")
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
              activeTab === "register"
                ? "bg-background font-extrabold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📝 Daftar Akun Baru
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("login")
              setErrorMsg("")
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
              activeTab === "login"
                ? "bg-background font-extrabold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔑 Masuk / Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ✅ {successMsg}
            </div>
          )}

          <div>
            <Label className="mb-1 block">
              Alamat Email <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              placeholder="contoh: ahmad@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {activeTab === "register" && (
            <div>
              <Label className="mb-1 block">
                Nama Lengkap / Panggilan{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="contoh: Ahmad Ridwan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={activeTab === "register"}
              />
            </div>
          )}

          <div>
            <Label className="mb-1 block">
              Kata Sandi / Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Masukkan Kata Sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="mt-0.5 block text-[10px] text-muted-foreground">
              Password dienkripsi secara aman (SHA-256) di Supabase Cloud DB.
            </span>
          </div>

          {activeTab === "register" && (
            <div>
              <Label className="mb-1 block">Ikon Profil (Avatar)</Label>
              <div className="flex flex-wrap items-center gap-1.5">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-all ${
                      avatar === av
                        ? "scale-110 bg-primary text-white shadow-md"
                        : "border border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold"
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl px-5 py-2 text-xs font-bold shadow-md"
            >
              {saving
                ? "🔐 Memproses..."
                : activeTab === "login"
                  ? "🔑 Masuk Akun"
                  : "📝 Daftar Akun"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
