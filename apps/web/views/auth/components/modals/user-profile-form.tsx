"use client"

import type { FormEvent } from "react"
import { Button, Input, Label } from "@workspace/ui"

export const AVATAR_OPTIONS = ["🌙", "👑", "✨", "📖", "🕌", "🤲", "⭐", "🌿"] as const

type ProfileFormProps = {
  activeTab: "login" | "register"
  email: string
  name: string
  password: string
  role: "public" | "admin"
  avatar: string
  saving: boolean
  errorMsg: string
  successMsg: string
  onTabChange: (tab: "login" | "register") => void
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onAvatarChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

function ProfileTabs({
  activeTab,
  onTabChange,
}: Pick<ProfileFormProps, "activeTab" | "onTabChange">) {
  return (
    <div className="mb-4 flex rounded-xl border border-border/40 bg-muted/60 p-1">
      {(["register", "login"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${activeTab === tab ? "bg-background font-extrabold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          {tab === "register" ? "📝 Daftar Akun Baru" : "🔑 Masuk / Login"}
        </button>
      ))}
    </div>
  )
}

function AvatarPicker({ avatar, onChange }: { avatar: string; onChange: (value: string) => void }) {
  return (
    <div>
      <Label className="mb-1 block">Ikon Profil (Avatar)</Label>
      <div className="flex flex-wrap items-center gap-1.5">
        {AVATAR_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-label={`Pilih avatar ${option}`}
            aria-pressed={avatar === option}
            className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-all ${avatar === option ? "scale-110 bg-primary text-foreground shadow-md" : "border border-border bg-background hover:bg-muted"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export function UserProfileForm({
  activeTab,
  email,
  name,
  password,
  avatar,
  saving,
  errorMsg,
  successMsg,
  onTabChange,
  onEmailChange,
  onNameChange,
  onPasswordChange,
  onAvatarChange,
  onSubmit,
  onClose,
}: ProfileFormProps) {
  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />
      <form onSubmit={onSubmit} className="space-y-3.5">
        {errorMsg && <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive">⚠️ {errorMsg}</div>}
        {successMsg && <div className="rounded-xl border border-success/20 bg-success/10 p-3 text-xs font-bold text-emerald-600 dark:text-success">✅ {successMsg}</div>}

        <div>
          <Label className="mb-1 block">Alamat Email <span className="text-destructive">*</span></Label>
          <Input type="email" placeholder="contoh: ahmad@gmail.com" value={email} onChange={(event) => onEmailChange(event.target.value)} required />
        </div>

        {activeTab === "register" && (
          <div>
            <Label className="mb-1 block">Nama Lengkap / Panggilan <span className="text-destructive">*</span></Label>
            <Input type="text" placeholder="contoh: Ahmad Ridwan" value={name} onChange={(event) => onNameChange(event.target.value)} required />
          </div>
        )}

        <div>
          <Label className="mb-1 block">Kata Sandi / Password <span className="text-destructive">*</span></Label>
          <Input type="password" placeholder="Masukkan Kata Sandi Anda" value={password} onChange={(event) => onPasswordChange(event.target.value)} required />
          <span className="mt-0.5 block text-[10px] text-muted-foreground">Password dienkripsi secara aman (SHA-256) di Supabase Cloud DB.</span>
        </div>

        {activeTab === "register" && <AvatarPicker avatar={avatar} onChange={onAvatarChange} />}

        <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-bold">Batal</Button>
          <Button type="submit" disabled={saving} className="rounded-xl px-5 py-2 text-xs font-bold shadow-md">
            {saving ? "🔐 Memproses..." : activeTab === "login" ? "🔑 Masuk Akun" : "📝 Daftar Akun"}
          </Button>
        </div>
      </form>
    </>
  )
}
