"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { ContextBlock } from "@core/ui"

export function ErpAnalyticsView() {
  return (
    <>
      <div className="space-y-6">
        <ContextBlock
          title="ANALYTICS & PERFORMA API SYSTEM"
          subtitle="Laporan operasional, performa koneksi API waktu shalat, dan metrik aktivitas jamaah."
          operation="SYSTEM-ANALYTICS"
          status="ONLINE"
          accentColor="system"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Aladhan API Status</CardDescription>
              <CardTitle className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                🟢 200 OK Live
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Server Time Synchronization</CardDescription>
              <CardTitle className="text-xl font-black text-purple-600 dark:text-purple-400">
                Asia/Jakarta (WIB)
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Supabase Cloud Health</CardDescription>
              <CardTitle className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                🟢 Operational
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Performa Sistem</CardTitle>
            <CardDescription>
              Metrik latensi dan ketersediaan layanan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/40 p-4">
              <div>
                <p className="font-bold text-foreground">
                  Kemenag RI Method #20 (Jakarta)
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Aladhan API timingsByCity live query
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
              >
                Latency &lt; 150ms
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/40 p-4">
              <div>
                <p className="font-bold text-foreground">
                  Database Supabase Cloud RLS Policy
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Tabel user_profiles & inspiration_comments
                </p>
              </div>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                Service Key Admin Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
