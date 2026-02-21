"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react"

type ProcessingStage = {
  label: string
  status: "pending" | "active" | "done"
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stages, setStages] = useState<ProcessingStage[]>([
    { label: "Cleaning Data", status: "pending" },
    { label: "Detecting Patterns", status: "pending" },
    { label: "Generating Visualizations", status: "pending" },
    { label: "Writing Insights", status: "pending" },
    { label: "Preparing Report", status: "pending" },
  ])

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter((line) => line.trim())
    return lines.slice(0, 11).map((line) => {
      const result: string[] = []
      let current = ""
      let inQuotes = false
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    })
  }

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) return
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvPreview(parseCSV(text))
    }
    reader.readAsText(selectedFile)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = () => {
    setFile(null)
    setCsvPreview([])
    setIsProcessing(false)
    setProgress(0)
    setStages((prev) => prev.map((s) => ({ ...s, status: "pending" })))
  }

  const startProcessing = () => {
    setIsProcessing(true)
    setProgress(0)

    const stageDelays = [800, 1600, 2600, 3600, 4400]

    stageDelays.forEach((delay, index) => {
      setTimeout(() => {
        setStages((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i < index ? "done" : i === index ? "active" : "pending",
          }))
        )
        setProgress(((index + 1) / stageDelays.length) * 100)
      }, delay)
    })

    setTimeout(() => {
      setStages((prev) => prev.map((s) => ({ ...s, status: "done" })))
      setProgress(100)
      setTimeout(() => {
        router.push("/dashboard")
      }, 600)
    }, 5200)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Upload Your Dataset
            </h1>
            <p className="mt-3 text-muted-foreground">
              Drop your CSV file below and let InsightPilot AI handle the rest.
            </p>
          </div>

          {/* Upload Area */}
          {!file && (
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload CSV file"
              className={`mt-10 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click()
                }
              }}
            >
              <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10">
                <FileSpreadsheet className="size-8 text-primary" />
              </div>
              <p className="mt-4 text-base font-medium text-foreground">
                Drag & drop your CSV file here
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                or click to browse from your computer
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
            </div>
          )}

          {/* File Preview */}
          {file && !isProcessing && (
            <div className="mt-10">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileSpreadsheet className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={removeFile}
                  aria-label="Remove file"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* CSV Preview Table */}
              {csvPreview.length > 1 && (
                <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      Data Preview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Showing first {csvPreview.length - 1} rows
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {csvPreview[0]?.map((header, i) => (
                            <TableHead key={i} className="text-xs">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvPreview.slice(1).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell
                                key={cellIndex}
                                className="text-xs text-muted-foreground"
                              >
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  size="lg"
                  className="gap-2 px-8"
                  onClick={startProcessing}
                >
                  <Upload className="size-4" />
                  Analyze Dataset
                </Button>
              </div>
            </div>
          )}

          {/* Processing View */}
          {isProcessing && (
            <div className="mt-10">
              <div className="rounded-xl border border-border bg-card p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      Processing {file?.name}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="mt-3" />
                </div>

                <div className="flex flex-col gap-4">
                  {stages.map((stage) => (
                    <div
                      key={stage.label}
                      className="flex items-center gap-3"
                    >
                      {stage.status === "done" && (
                        <CheckCircle2 className="size-5 text-green-500" />
                      )}
                      {stage.status === "active" && (
                        <Loader2 className="size-5 animate-spin text-primary" />
                      )}
                      {stage.status === "pending" && (
                        <div className="size-5 rounded-full border-2 border-border" />
                      )}
                      <span
                        className={`text-sm ${
                          stage.status === "active"
                            ? "font-medium text-foreground"
                            : stage.status === "done"
                              ? "text-muted-foreground"
                              : "text-muted-foreground/60"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Skeleton loading for charts */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-4"
                    >
                      <Skeleton className="mb-3 h-3 w-24" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
