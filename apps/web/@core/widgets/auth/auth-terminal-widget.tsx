"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, User, Terminal, Fingerprint, Lock } from "lucide-react"
import { apiClient } from "@core/api/client"

const REDIRECT_DELAY_MS = 800

export function AuthTerminalWidget() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  // 3 Portals Support
  const [role, setRole] = useState<"public" | "admin" | "console">("public")
  const [avatar, _setAvatar] = useState("🌙")

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [adminPortalSelection, setAdminPortalSelection] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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

      const { data } = await apiClient.post("/api/users/profile", payload)

      if (data.error) {
        throw new Error(data.error || "Gagal memproses autentikasi.")
      }

      setSuccessMsg(data.message || "Berhasil masuk ke akun Anda!")

      if (data.profile) {
        localStorage.setItem("mw_user_profile", JSON.stringify(data.profile))
        window.dispatchEvent(new Event("storage"))
      }

      setTimeout(() => {
        const userRole = data.profile?.role || "public"

        if (userRole === "admin") {
          // Show portal selection for Admin
          setAdminPortalSelection(true)
          setLoading(false)
        } else if (userRole === "console") {
          router.push("/console")
        } else {
          router.push("/home")
        }
      }, REDIRECT_DELAY_MS)
    } catch (err: unknown) {
      setErrorMsg(
        (err as { message?: string }).message || "Terjadi kesalahan koneksi."
      )
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-[480px] p-6 text-left">
      {/* HUD Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Fingerprint className="h-8 w-8 text-cyan-400" />
        </div>
        <h1 className="font-mono text-3xl font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          MOONWITNESS OS
        </h1>
        <p className="mt-2 font-mono text-[10px] font-bold tracking-widest text-cyan-500 uppercase">
          CELESTIAL ACCESS PROTOCOL //{" "}
          {activeTab === "login" ? "AUTHENTICATION" : "REGISTRATION"}
        </p>
      </div>

      <div className="mb-8 w-full border-b border-cyan-500/30" />

      {/* Mode Switcher */}
      {!adminPortalSelection && (
        <div className="mb-6 grid grid-cols-2 gap-4 font-mono text-xs font-bold tracking-widest uppercase">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login")
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`flex items-center justify-center gap-2 border py-3 transition-all ${
              activeTab === "login"
                ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                : "border-white/10 text-primary/40 hover:border-cyan-500/30 hover:text-cyan-500"
            }`}
          >
            <Lock className="h-3.5 w-3.5" /> LOGIN
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register")
              setErrorMsg("")
              setSuccessMsg("")
            }}
            className={`flex items-center justify-center gap-2 border py-3 transition-all ${
              activeTab === "register"
                ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                : "border-white/10 text-primary/40 hover:border-cyan-500/30 hover:text-cyan-500"
            }`}
          >
            <User className="h-3.5 w-3.5" /> REGISTER
          </button>
        </div>
      )}

      {adminPortalSelection ? (
        <div className="animate-in space-y-6 duration-500 fade-in zoom-in">
          <div className="tag-clip border-success/40 bg-success/10 text-success flex items-center justify-center gap-2 border p-3 text-xs font-bold">
            <span>✅</span> AUTHORIZATION ACCEPTED. SELECT DESTINATION PORTAL.
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => router.push("/erp/dashboard")}
              className="group tag-clip relative flex items-center justify-between border border-fuchsia-500/40 bg-fuchsia-500/10 p-4 transition-all hover:bg-fuchsia-500/20 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
            >
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-fuchsia-400" />
                <div className="text-left">
                  <h3 className="font-mono text-sm font-black text-fuchsia-400">
                    ERP DASHBOARD
                  </h3>
                  <p className="font-mono text-[9px] text-primary/70">
                    ADMINISTRATIVE COMMAND CENTER
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-fuchsia-500 opacity-50 group-hover:opacity-100">
                ENTER &rarr;
              </span>
            </button>

            <button
              onClick={() => router.push("/console")}
              className="group tag-clip relative flex items-center justify-between border border-emerald-500/40 bg-emerald-500/10 p-4 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <div className="flex items-center gap-4">
                <Terminal className="h-6 w-6 text-emerald-400" />
                <div className="text-left">
                  <h3 className="font-mono text-sm font-black text-emerald-400">
                    DEVELOPER CONSOLE
                  </h3>
                  <p className="font-mono text-[9px] text-primary/70">
                    SYSTEM DIAGNOSTICS & AI
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-500 opacity-50 group-hover:opacity-100">
                ENTER &rarr;
              </span>
            </button>

            <button
              onClick={() => router.push("/home")}
              className="group tag-clip relative flex items-center justify-between border border-cyan-500/40 bg-cyan-500/10 p-4 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-cyan-400" />
                <div className="text-left">
                  <h3 className="font-mono text-sm font-black text-cyan-400">
                    PUBLIC OBSERVATORY
                  </h3>
                  <p className="font-mono text-[9px] text-primary/70">
                    GLOBAL TRANSMISSION SECTORS
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-cyan-500 opacity-50 group-hover:opacity-100">
                ENTER &rarr;
              </span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 font-mono">
          {errorMsg && (
            <div className="border-danger/40 bg-danger/10 text-danger flex items-center gap-3 border p-4 text-xs font-bold backdrop-blur-md">
              <span className="animate-pulse">⚠️</span> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="border-success/40 bg-success/10 text-success flex items-center gap-3 border p-4 text-xs font-bold backdrop-blur-md">
              <span className="animate-pulse">✅</span> {successMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-500 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> EMAIL
              IDENTITY
            </label>
            <input
              type="email"
              placeholder="enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-cyan-500/10 bg-black/40 px-4 py-3 text-xs text-white placeholder:text-primary/30 focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:ring-0 focus:outline-none"
            />
          </div>

          {activeTab === "register" && (
            <>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-500 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />{" "}
                  PLAYER NAME
                </label>
                <input
                  type="text"
                  placeholder="enter your callsign..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-cyan-500/10 bg-black/40 px-4 py-3 text-xs text-white placeholder:text-primary/30 focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:ring-0 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-500 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />{" "}
                  ASSIGNMENT DIRECTIVE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("public")}
                    className={`flex flex-col items-center justify-center gap-2 border p-3 transition-colors ${
                      role === "public"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-white/10 text-primary/40 hover:border-cyan-500/30"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-[9px] font-bold">PUBLIC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex flex-col items-center justify-center gap-2 border p-3 transition-colors ${
                      role === "admin"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-white/10 text-primary/40 hover:border-cyan-500/30"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[9px] font-bold">ADMIN / ERP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("console")}
                    className={`flex flex-col items-center justify-center gap-2 border p-3 transition-colors ${
                      role === "console"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-white/10 text-primary/40 hover:border-cyan-500/30"
                    }`}
                  >
                    <Terminal className="h-4 w-4" />
                    <span className="text-[9px] font-bold">CONSOLE</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-cyan-500 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> SECURE
              PROTOCOL KEY
            </label>
            <input
              type="password"
              placeholder="enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-cyan-500/10 bg-black/40 px-4 py-3 text-xs text-white placeholder:text-primary/30 focus:border-cyan-500/50 focus:bg-cyan-500/5 focus:ring-0 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative mt-6 flex w-full items-center justify-center overflow-hidden bg-cyan-500 py-3.5 font-mono text-xs font-black tracking-widest text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
          >
            <span className="absolute inset-0 w-full -translate-x-full bg-white/40 transition-all duration-700 ease-in-out group-hover:translate-x-full" />
            {loading
              ? "INITIALIZING UPLINK..."
              : activeTab === "login"
                ? "DECRYPT & ENTER"
                : "INITIALIZE PLAYER"}
          </button>
        </form>
      )}
    </div>
  )
}
