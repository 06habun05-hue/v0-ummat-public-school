'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const schema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  location: z.string().min(2, 'Location is required'),
  principalName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface BranchFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => Promise<void>
  defaultValues?: Partial<FormData>
  mode: 'add' | 'edit'
}

export function BranchFormModal({ open, onClose, onSubmit, defaultValues, mode }: BranchFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if (open) reset(defaultValues ?? {})
  }, [open, defaultValues])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            className="relative bg-background border-t sm:border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground">
                  {mode === 'add' ? 'Add New Branch' : 'Edit Branch'}
                </h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                  {mode === 'add' ? 'Initialize a new campus' : 'Update campus details'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { label: 'Branch Name', field: 'name' as const, ph: 'e.g. East Campus' },
                { label: 'Location / City', field: 'location' as const, ph: 'e.g. Karachi' },
                { label: 'Principal Name', field: 'principalName' as const, ph: 'e.g. Principal Ali' },
              ].map(({ label, field, ph }) => (
                <div key={field}>
                  <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">
                    {label}
                  </label>
                  <input
                    placeholder={ph}
                    {...register(field)}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner font-medium"
                  />
                  {errors[field] && (
                    <p className="text-[10px] text-accent mt-1 ml-1">{errors[field]?.message}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2 pb-2 sm:pb-0">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? 'Saving…' : mode === 'add' ? 'Create Branch' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
