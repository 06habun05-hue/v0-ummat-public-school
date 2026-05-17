'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Terminal, RefreshCcw, ChevronDown, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Ummat Systems Error Boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-danger/20 shadow-2xl shadow-danger/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
          <CardHeader className="space-y-4 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center text-danger mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
                System Exception
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-2">
                The application encountered an unexpected runtime error.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Bug size={80} />
              </div>
              <p className="text-[10px] font-black uppercase text-danger tracking-widest mb-2">Error Message</p>
              <p className="font-mono text-sm sm:text-base font-semibold text-danger/90 break-words leading-relaxed">
                {error.message || "An unknown error occurred"}
              </p>
              {error.digest && (
                <p className="text-[10px] text-muted-foreground mt-3 font-mono font-bold">
                  Digest ID: {error.digest}
                </p>
              )}
            </div>

            <div className="border border-border rounded-2xl overflow-hidden transition-all bg-background">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-muted-foreground" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Technical Details</span>
                </div>
                <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", showDetails ? "rotate-180" : "")} />
              </button>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border bg-black/5 dark:bg-black/40">
                      <pre className="text-[10px] sm:text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto scrollbar-hide">
                        {error.stack || "No stack trace available"}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border pt-6 pb-6 px-6 sm:px-8">
            <Button 
              onClick={() => reset()} 
              className="w-full sm:w-auto h-12 px-8 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} />
              Attempt Recovery
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
