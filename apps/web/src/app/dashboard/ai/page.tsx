'use client'

import { useState } from 'react'
import { 
  Zap, 
  Search, 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles,
  RefreshCw,
  Info,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'

export default function AiInsightsPage() {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('http://localhost:3001/ai/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputText }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data.data)
      } else {
        setError(data.message || data.error || 'Failed to get AI analysis')
      }
    } catch (err: any) {
      setError(err.message || 'Connection to AI service failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">AI Insights Engine</h1>
          </div>
          <p className="text-muted-foreground mt-1">Leverage machine learning to analyze business trends and predict future outcomes.</p>
        </div>
        <Badge variant="outline" className="h-fit py-1.5 px-4 bg-amber-50 text-amber-700 border-amber-200 font-bold">
          <Sparkles className="w-3.5 h-3.5 mr-2" /> Powered by BillEasy ML v1.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-none shadow-premium bg-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> Analysis Query
                </label>
                <textarea 
                  placeholder="Type a business scenario or product description here (e.g. 'How will the increase in raw sugar prices affect my retail margins next quarter?')" 
                  className="w-full h-40 px-5 py-4 bg-slate-50 border border-border rounded-2xl text-base focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none placeholder:text-slate-400"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground italic">Try asking about revenue predictions, inventory trends, or market analysis.</p>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="h-14 text-lg font-bold shadow-brand rounded-2xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-3 animate-spin" /> 
                    Processing Data...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3 text-amber-400" /> 
                    Run Analysis
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive" className="rounded-xl border-rose-200 bg-rose-50">
                  <p className="font-bold text-rose-800">{error}</p>
                </Alert>
              )}
            </div>
          </Card>

          {/* Results Area */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-8 border-2 border-emerald-100 shadow-premium bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative">
                  <div className="absolute -top-12 -right-12 opacity-5">
                    <Brain className="w-64 h-64" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        Analysis Result
                      </h3>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Confidence Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-1000" 
                              style={{ width: `${result.confidence}%` }} 
                            />
                          </div>
                          <span className="text-sm font-black text-emerald-700">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm min-h-[100px]">
                      <p className="text-lg text-slate-700 leading-relaxed font-medium">
                        {result.prediction}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/60 border border-emerald-100/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-emerald-800">Model Applied</p>
                          <p className="text-slate-500">{result.model_type}</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/60 border border-emerald-100/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-emerald-800">Processing Time</p>
                          <p className="text-slate-500">{result.processing_time_ms.toFixed(2)}ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-soft bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl" />
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> How it works
            </h4>
            <div className="space-y-4 relative z-10 text-slate-300 text-sm">
              <p>Our machine learning engine processes your business data alongside market trends to provide actionable intelligence.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Uses historical transaction data for pattern recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Predicts stock depletion rates based on seasonal demand.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Identifies revenue leakage points in real-time.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-soft bg-white">
            <h4 className="font-bold text-sm mb-4">Sample Queries</h4>
            <div className="space-y-3">
              <SampleQuery text="Predict monthly revenue for next quarter" onSelect={setInputText} />
              <SampleQuery text="Identify top 3 growth categories" onSelect={setInputText} />
              <SampleQuery text="Analyze customer retention trends" onSelect={setInputText} />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

function SampleQuery({ text, onSelect }: { text: string; onSelect: (t: string) => void }) {
  return (
    <button 
      onClick={() => onSelect(text)}
      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary-light transition-all group"
    >
      <p className="text-xs font-bold text-slate-600 group-hover:text-primary-600">{text}</p>
    </button>
  )
}
