'use client'
import { ProcessApplication } from '@/components/applications'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProcessPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Process New Application</h1>
      </div>
      <ProcessApplication />
    </div>
  )
}
