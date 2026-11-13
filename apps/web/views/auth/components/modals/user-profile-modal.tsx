"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui"
import { useUserProfile } from "@moon/client"
import { UserProfileForm } from "./user-profile-form"

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
      setRole(profile.role === "admin" ? "admin" : "public")
      setAvatar((profile as any).avatar || (profile as any).avatarUrl || "🌙")
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

        <UserProfileForm
          activeTab={activeTab}
          email={email}
          name={name}
          password={password}
          role={role}
          avatar={avatar}
          saving={saving}
          errorMsg={errorMsg}
          successMsg={successMsg}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setErrorMsg("")
          }}
          onEmailChange={setEmail}
          onNameChange={setName}
          onPasswordChange={setPassword}
          onAvatarChange={setAvatar}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
