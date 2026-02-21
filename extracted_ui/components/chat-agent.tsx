"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrainCircuit, X, Send, Trash2, Loader2 } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const demoResponses: Record<string, string> = {
  "what are the main trends":
    "**Key Trends Identified:**\n\n- **Revenue Growth:** Consistent upward trajectory at +18% QoQ, with Q4 showing the strongest performance at $7,200.\n- **Cost Optimization:** Cost-to-revenue ratio has improved from 0.67 in Q1 to 0.53 in Q4, indicating operational efficiency gains.\n- **Monthly Acceleration:** Since April, monthly performance metrics show compounding growth, correlating with Category A market expansion.\n- **Seasonality:** Clear seasonal pattern detected with peak activity in Q4, suggesting demand-driven cycles.",

  "which column has highest variance":
    "**Variance Analysis:**\n\n- **Transaction Amount** has the highest variance (s\u00b2 = 2,847.3), indicating significant spread in individual transaction values.\n- **Standard Deviation:** 53.36, with a coefficient of variation of 1.09, classifying this column as highly dispersed.\n- **Contributing Factors:** The 89 identified outliers in this column account for approximately 40% of the total variance.\n- **Recommendation:** Consider segmenting analysis by transaction size brackets for more granular insights.",

  "why are these outliers flagged":
    "**Outlier Detection Methodology:**\n\n- **Method:** Modified Z-Score with a threshold of 3.5, applied across all numeric columns.\n- **Results:** 89 data points flagged, primarily in the transaction amount column.\n\n**Flagging Criteria:**\n- Values exceeding 3 standard deviations from the mean\n- Transactions above $245 or below $2.50\n- Temporal anomalies (unusual activity timestamps)\n\n**Assessment:** 62% appear to be legitimate high-value transactions, 28% warrant manual review, and 10% are likely data entry errors.",

  "give me executive summary":
    "**Executive Summary:**\n\nThe dataset comprises 12,847 records across the 2024 fiscal year. Key findings:\n\n1. **Financial Performance:** Revenue grew 71% from Q1 to Q4, while costs grew only 36%, resulting in significant margin expansion.\n2. **Data Quality:** 342 missing values (2.7% of total) concentrated in region/segment fields. 89 outliers identified for review.\n3. **Market Position:** Category A leads with 35% market share and highest margins. Categories B and C represent growth opportunities.\n4. **Forecast:** Based on current trajectories, projected annual revenue growth of 22-28% is achievable with current resource allocation.\n\n**Priority Actions:** Address data gaps, investigate outliers, and allocate resources toward Category A expansion.",

  "which region performs best":
    "**Regional Performance Analysis:**\n\n- **North America:** Leads with 38% of total revenue and highest average transaction value ($67.40).\n- **Europe:** Second at 28% revenue share, showing fastest growth rate at +24% QoQ.\n- **Asia Pacific:** 22% share with strongest volume metrics (3,847 transactions).\n- **Other Regions:** Combined 12% with significant growth potential.\n\n**Key Insight:** While North America generates the most revenue, Europe\u2019s growth trajectory suggests it may overtake within 2-3 quarters. Consider strategic investment in European market operations.",
}

function getAiResponse(input: string): string {
  const lower = input.toLowerCase().trim()

  for (const [key, response] of Object.entries(demoResponses)) {
    if (lower.includes(key) || key.includes(lower.slice(0, 20))) {
      return response
    }
  }

  return "**Analysis Result:**\n\nBased on the current dataset (12,847 rows, 24 columns), I can provide the following insight:\n\n- The query relates to patterns within the uploaded CSV data.\n- Key numeric columns show moderate-to-strong correlations, particularly between revenue and volume metrics.\n- For more specific analysis, try asking about trends, outliers, variance, regional performance, or request an executive summary.\n\n**Suggested follow-up questions:**\n- \"What are the main trends?\"\n- \"Which column has highest variance?\"\n- \"Give me executive summary.\""
}

export function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to InsightPilot AI Data Agent. I have analyzed your dataset and am ready to answer questions. Ask me about trends, outliers, statistics, or request an executive summary.",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = () => {
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getAiResponse(userMsg.content)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Conversation cleared. I still have your dataset context loaded. How can I help?",
      },
    ])
  }

  const formatMessage = (content: string) => {
    const lines = content.split("\n")
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-semibold text-foreground">
            {line.replace(/\*\*/g, "")}
          </p>
        )
      }
      if (line.startsWith("- **")) {
        const match = line.match(/^- \*\*(.+?)\*\*(.*)/)
        if (match) {
          return (
            <p key={i} className="ml-2 mt-1">
              <span className="font-medium text-foreground">{match[1]}</span>
              {match[2]}
            </p>
          )
        }
      }
      if (line.startsWith("- ")) {
        return (
          <p key={i} className="ml-2 mt-1">
            <span className="mr-1.5 text-primary">{"•"}</span>
            {line.slice(2)}
          </p>
        )
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="ml-2 mt-1">
            {line}
          </p>
        )
      }
      if (line.trim() === "") {
        return <br key={i} />
      }
      return (
        <p key={i} className="mt-1">
          {line}
        </p>
      )
    })
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Open AI Data Agent"
        >
          <BrainCircuit className="size-6 text-primary-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-accent" />
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-card shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <BrainCircuit className="size-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  AI Data Agent
                </h2>
                <p className="text-xs text-muted-foreground">
                  Dataset context loaded
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearConversation}
                aria-label="Clear conversation"
              >
                <Trash2 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant"
                      ? formatMessage(msg.content)
                      : msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-3">
                    <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                    <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                    <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage()
                }}
                placeholder="Ask about your data..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: "Main trends", query: "What are the main trends?" },
                { label: "Executive summary", query: "Give me executive summary" },
                { label: "Outliers", query: "Why are these outliers flagged?" },
              ].map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => {
                    if (isTyping) return
                    const userMsg: Message = {
                      id: Date.now().toString(),
                      role: "user",
                      content: suggestion.query,
                    }
                    setMessages((prev) => [...prev, userMsg])
                    setIsTyping(true)
                    setTimeout(() => {
                      const response = getAiResponse(suggestion.query)
                      const aiMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: response,
                      }
                      setMessages((prev) => [...prev, aiMsg])
                      setIsTyping(false)
                    }, 800 + Math.random() * 600)
                  }}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
