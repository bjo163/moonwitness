"use client"

import React, { useState, useMemo } from "react"
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Play, Loader2 } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { apiPost } from "@moon/client"
import { APP_PORTS } from "@workspace/types"
import { cosmicAudio } from "../cosmic-sound-synthesizer"

export interface CosmicImportModalProps {
  isOpen: boolean
  onClose: () => void
  schema: ModelSchema
  onImportSuccess?: () => void
}

export function CosmicImportModal({
  isOpen,
  onClose,
  schema,
  onImportSuccess,
}: CosmicImportModalProps) {
  const [csvText, setCsvText] = useState("")
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [importStats, setImportStats] = useState<{ success: number; failed: number } | null>(null)

  const schemaFieldOptions = useMemo(() => {
    return Object.entries(schema.fields)
      .filter(([_, def]) => !def.readonly && !def.invisible && def.type !== "one2many" && def.type !== "many2many")
      .map(([key, def]) => ({ key, label: `${def.label} (${key})` }))
  }, [schema.fields])

  // Parse CSV text
  const { headers, rows } = useMemo(() => {
    if (!csvText.trim()) return { headers: [], rows: [] }

    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length < 2 || !lines[0]) return { headers: [], rows: [] }

    const parsedHeaders = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim())
    const parsedRows = lines.slice(1).map((line) => {
      // Split by comma ignoring commas inside quotes
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.replace(/^["']|["']$/g, "").trim())
      const rowObj: Record<string, string> = {}
      parsedHeaders.forEach((h, idx) => {
        rowObj[h] = values[idx] || ""
      })
      return rowObj
    })

    return { headers: parsedHeaders, rows: parsedRows }
  }, [csvText])

  // Auto-map headers when headers change
  React.useEffect(() => {
    if (headers.length > 0) {
      const mapping: Record<string, string> = {}
      headers.forEach((h) => {
        const cleanHeader = h.toLowerCase().replace(/[^a-z0-9]/g, "")
        const match = schemaFieldOptions.find(
          (f) =>
            f.key.toLowerCase() === cleanHeader ||
            f.label.toLowerCase().includes(cleanHeader) ||
            cleanHeader.includes(f.key.toLowerCase())
        )
        if (match) mapping[h] = match.key
      })
      setFieldMappings(mapping)
    }
  }, [headers, schemaFieldOptions])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCsvText(event.target?.result as string)
      setError(null)
      setImportStats(null)
    }
    reader.readAsText(file)
  }

  const getApiBase = () => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }
    return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
  }

  const handleExecuteImport = async () => {
    if (rows.length === 0) return
    setImporting(true)
    setProgress(0)
    setError(null)
    setImportStats(null)

    let successCount = 0
    let failedCount = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row) continue
      const payload: Record<string, any> = {}

      for (const [csvCol, fieldKey] of Object.entries(fieldMappings)) {
        if (!fieldKey || fieldKey === "IGNORE") continue
        const val = row[csvCol] ?? ""
        const def = schema.fields[fieldKey]

        if (def) {
          if (def.type === "integer") payload[fieldKey] = parseInt(val, 10) || 0
          else if (def.type === "float" || def.type === "monetary") payload[fieldKey] = parseFloat(val) || 0.0
          else if (def.type === "boolean") payload[fieldKey] = val.toLowerCase() === "true" || val === "1"
          else payload[fieldKey] = val
        }
      }

      try {
        await apiPost(`${getApiBase()}/api/${schema.name}`, payload)
        successCount++
      } catch {
        failedCount++
      }

      setProgress(Math.round(((i + 1) / rows.length) * 100))
    }

    setImporting(false)
    setImportStats({ success: successCount, failed: failedCount })

    if (successCount > 0) {
      cosmicAudio.playSuccessChime()
      onImportSuccess?.()
    } else {
      cosmicAudio.playAlertTone()
      setError("Failed to import rows. Please check data types and field mappings.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-cyber-dark/95 border border-cyber-cyan/40 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden corner-box font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cyan/20 bg-cyber-panel/60">
          <div>
            <span className="text-[10px] text-cyber-cyan tracking-widest uppercase">
              {schema.name} // BULK INGESTION WIZARD
            </span>
            <h2 className="text-lg font-bold text-white uppercase font-orbitron">
              IMPORT CSV DATASET
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-steel-gray hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-cyber-pink/10 border border-cyber-pink/40 rounded text-cyber-pink">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {importStats && (
            <div className="flex items-center gap-2 p-3 bg-cyber-green/10 border border-cyber-green/40 rounded text-cyber-green">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                INGESTION COMPLETE: {importStats.success} records created, {importStats.failed} failed.
              </span>
            </div>
          )}

          {/* Upload or Paste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-dashed border-cyber-cyan/30 rounded bg-black/40 flex flex-col items-center justify-center text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-cyber-cyan" />
              <span className="font-bold text-white">SELECT .CSV FILE</span>
              <p className="text-[10px] text-steel-gray">Upload UTF-8 comma-separated file</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="text-[10px] text-steel-gray file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:bg-cyber-cyan/20 file:text-cyber-cyan file:cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-steel-gray uppercase">OR PASTE RAW CSV CONTENT:</span>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value)
                  setError(null)
                  setImportStats(null)
                }}
                placeholder="name,priority,stageId&#10;System Optimization,high,1&#10;Security Patch,critical,2"
                rows={4}
                className="w-full bg-black/60 border border-cyber-cyan/20 rounded p-2.5 text-white text-[11px] font-mono focus:border-cyber-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Header Mapping Section */}
          {headers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-cyber-cyan/20 pb-1">
                <span className="font-bold text-cyber-cyan uppercase">FIELD MAPPING CONFIGURATION</span>
                <span className="text-[10px] text-steel-gray">{rows.length} ROWS DETECTED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {headers.map((h) => (
                  <div key={h} className="flex items-center justify-between gap-2 p-2 bg-black/40 border border-cyber-cyan/10 rounded">
                    <span className="font-bold text-white truncate max-w-[120px]">{h}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0" />
                    <select
                      value={fieldMappings[h] || "IGNORE"}
                      onChange={(e) => setFieldMappings((prev) => ({ ...prev, [h]: e.target.value }))}
                      className="bg-cyber-panel border border-cyber-cyan/30 rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                    >
                      <option value="IGNORE">-- DO NOT IMPORT --</option>
                      {schemaFieldOptions.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {importing && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-cyber-cyan font-bold">
                <span>INGESTING DATASET...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-black/80 rounded-full h-2 overflow-hidden border border-cyber-cyan/30">
                <div
                  className="bg-cyber-cyan h-full transition-all duration-150 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-cyan/20 bg-cyber-panel/60">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black/60 border border-steel-gray/30 rounded text-steel-gray hover:text-white uppercase transition-all"
          >
            CANCEL
          </button>

          <button
            onClick={handleExecuteImport}
            disabled={importing || rows.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-cyber-cyan text-black font-bold rounded uppercase hover:bg-cyber-cyan/90 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>IMPORT {rows.length} RECORDS</span>
          </button>
        </div>
      </div>
    </div>
  )
}
