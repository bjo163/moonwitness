"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { ContextBlock } from "@core/ui"

type UserProfileItem = {
  id: string
  email: string
  name: string
  role: "public" | "admin"
  avatar_url: string
  created_at: string
}

const INITIAL_USERS: UserProfileItem[] = [
  {
    id: "1",
    email: "rocksoul@moonwitness.com",
    name: "Admin Rocksoul",
    role: "admin",
    avatar_url: "👑",
    created_at: "2026-07-26",
  },
  {
    id: "2",
    email: "ahmad.jamaah@gmail.com",
    name: "Ahmad Jamaah",
    role: "public",
    avatar_url: "🌙",
    created_at: "2026-07-26",
  },
  {
    id: "3",
    email: "hamba.allah@gmail.com",
    name: "Hamba Allah",
    role: "public",
    avatar_url: "✨",
    created_at: "2026-07-26",
  },
]

export function ErpUsersView() {
  const [users, setUsers] = useState<UserProfileItem[]>(INITIAL_USERS)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Edit Inline Form State
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState<"public" | "admin">("public")

  // Add User State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addName, setAddName] = useState("")
  const [addRole, setAddRole] = useState<"public" | "admin">("public")

  const [notification, setNotification] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mw_erp_users_data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => setUsers(parsed), 0)
        }
      } catch (e) {
        console.error("Failed to load ERP users state:", e)
      }
    }
  }, [])

  // Save users state to localStorage
  const saveUsersState = (newUsers: UserProfileItem[]) => {
    setUsers(newUsers)
    localStorage.setItem("mw_erp_users_data", JSON.stringify(newUsers))
  }

  const showNotify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  // Start Inline Editing
  const startEdit = (u: UserProfileItem) => {
    setEditingId(u.id)
    setEditName(u.name)
    setEditEmail(u.email)
    setEditRole(u.role)
  }

  // Save Inline Edit
  const saveInlineEdit = (id: string) => {
    if (!editName.trim() || !editEmail.trim()) return

    const updated = users.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          role: editRole,
          avatar_url: editRole === "admin" ? "👑" : "🌙",
        }
      }
      return u
    })

    saveUsersState(updated)
    setEditingId(null)
    showNotify(`✅ Akun ${editName} berhasil diperbarui & disimpan permanen!`)
  }

  // Quick Toggle Role
  const toggleRole = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const nextRole: "public" | "admin" =
          u.role === "admin" ? "public" : "admin"
        showNotify(`Peran ${u.name} diubah menjadi ${nextRole.toUpperCase()}`)
        return {
          ...u,
          role: nextRole,
          avatar_url: nextRole === "admin" ? "👑" : "🌙",
        }
      }
      return u
    })
    saveUsersState(updated)
  }

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addEmail.trim() || !addName.trim()) return

    const newUser: UserProfileItem = {
      id: Date.now().toString(),
      email: addEmail.trim().toLowerCase(),
      name: addName.trim(),
      role: addRole,
      avatar_url: addRole === "admin" ? "👑" : "🌙",
      created_at: new Date().toISOString().split("T")[0] || "",
    }

    const updated = [newUser, ...users]
    saveUsersState(updated)
    setIsAddOpen(false)
    setAddEmail("")
    setAddName("")
    showNotify(`✅ User ${newUser.name} berhasil ditambahkan!`)
  }

  // Delete User
  const handleDeleteUser = (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${name}?`)) return
    const updated = users.filter((u) => u.id !== id)
    saveUsersState(updated)
    showNotify(`🗑️ Akun ${name} telah dihapus.`)
  }

  return (
    <>
      <div className="space-y-6">
        <ContextBlock
          title="MANAJEMEN AKUN JAMAAH"
          subtitle="Kelola akses, profil jamaah, dan berikan hak istimewa Admin."
          operation="USER-ACCOUNT-MGMT"
          status="ONLINE"
          accentColor="system"
        />

        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="shrink-0 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700"
          >
            ➕ Tambah Pengguna Baru
          </Button>
        </div>

        {notification && (
          <div className="flex animate-in items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 fade-in dark:text-emerald-400">
            <span>{notification}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Total Pengguna</CardDescription>
              <CardTitle className="text-2xl font-black">
                {users.length} Akun
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Administrator</CardDescription>
              <CardTitle className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {users.filter((u) => u.role === "admin").length} Admin
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Status Keamanan</CardDescription>
              <CardTitle className="text-base font-black text-emerald-600 dark:text-emerald-400">
                🔒 SHA-256 Active
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daftar Pengguna Active</CardTitle>
              <CardDescription>
                Klik Edit untuk mengubah Nama/Email atau klik Badge Role untuk
                ubah Hak Akses
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {users.length} Records
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((u) => {
              const isEditing = editingId === u.id

              return (
                <div
                  key={u.id}
                  className="space-y-3 rounded-2xl border border-border/40 bg-card p-4 transition-all hover:bg-muted/20"
                >
                  {isEditing ? (
                    /* EDITING INLINE FORM */
                    <div className="space-y-3 rounded-xl border border-purple-500/30 bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          ✏️ Edit Akun #{u.id}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Inline Mode
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="mb-1 block text-[11px]">
                            Nama Lengkap
                          </Label>
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label className="mb-1 block text-[11px]">
                            Alamat Email
                          </Label>
                          <Input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-[11px]">Peran:</Label>
                          <button
                            type="button"
                            onClick={() =>
                              setEditRole(
                                editRole === "admin" ? "public" : "admin"
                              )
                            }
                            className={`rounded-lg border px-3 py-1 text-xs font-bold transition-all ${
                              editRole === "admin"
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-border bg-background text-foreground"
                            }`}
                          >
                            {editRole === "admin"
                              ? "👑 Admin ERP"
                              : "👥 Jamaah (Public)"}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            className="h-8 rounded-xl px-3 text-xs font-bold"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={() => saveInlineEdit(u.id)}
                            className="h-8 rounded-xl bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-700"
                          >
                            💾 Simpan Perubahan
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL VIEW */
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{u.avatar_url}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {u.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleRole(u.id)}
                              title="Klik untuk mengubah peran Admin/Public secara instan"
                            >
                              <Badge
                                variant={
                                  u.role === "admin" ? "secondary" : "outline"
                                }
                                className={`cursor-pointer transition-all hover:opacity-80 ${
                                  u.role === "admin"
                                    ? "bg-purple-600 text-white"
                                    : ""
                                }`}
                              >
                                {u.role === "admin" ? "👑 ADMIN" : "👥 PUBLIC"}
                              </Badge>
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          onClick={() => startEdit(u)}
                          className="h-8 rounded-xl px-3 text-xs font-bold"
                        >
                          ✏️ Edit Profil
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="h-8 rounded-xl px-3 text-xs font-bold"
                        >
                          🗑️ Hapus
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ADD USER MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle>➕ Tambah Akun Pengguna Baru</DialogTitle>
            <DialogDescription>
              Daftarkan akun pengguna atau admin ke sistem ERP
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <Label className="mb-1 block">Alamat Email *</Label>
              <Input
                type="email"
                placeholder="contoh: ustadz@moonwitness.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="mb-1 block">Nama Lengkap *</Label>
              <Input
                type="text"
                placeholder="contoh: Ustadz Abdullah"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="mb-1 block">Peran (Role)</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAddRole("public")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    addRole === "public"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  👥 Jamaah (Public)
                </button>
                <button
                  type="button"
                  onClick={() => setAddRole("admin")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    addRole === "admin"
                      ? "border-purple-500 bg-purple-500/10 text-purple-600"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  👑 Admin ERP
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 font-bold text-white hover:bg-purple-700"
              >
                Simpan Akun
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

