'use client'
import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, HelpCircle, History } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParsedResumes } from '@/hooks/useParsedResumes';

export default function ProcessApplication() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeOption, setResumeOption] = useState('new') // 'new' or 'existing'
  const [previousResumes, setPreviousResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  // const [isLoadingResumes, setIsLoadingResumes] = useState(true)
  const { parsedResumes, isLoading: isLoadingResumes, error: resumesError } = useParsedResumes();
  console.log('Parsed Resumes:', { parsedResumes, isLoadingResumes, resumesError });
  
  const [formData, setFormData] = useState({
    resume: null,
    jobDescription: '',
    companyApplied: '',
    roleApplied: ''
  })

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  }

  // // Fetch previous resumes
  // useEffect(() => {
  //   const fetchPreviousResumes = async () => {
  //     try {
  //       const token = getToken()
  //       const response = await fetch('http://localhost:8000/api/parsed-resumes', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       })
  //       if (response.ok) {
  //         const data = await response.json()
  //         setPreviousResumes(data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching previous resumes:', error)
  //     } finally {
  //       setIsLoadingResumes(false)
  //     }
  //   }

  //   fetchPreviousResumes()
  // }, [getToken])

  const validateFile = (file) => {
    setFileError('')
    
    if (!file) return false
    
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      setFileError('Please upload a valid document (PDF, DOC, or DOCX)')
      return false
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5MB')
      return false
    }
    
    return true
  }

  const handleFile = (file) => {
    if (validateFile(file)) {
      setFormData(prev => ({ ...prev, resume: file }))
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, []) // This is fine as it doesn't use any external dependencies
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }, [handleFile]) // Add handleFile as dependency
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formDataToStore = {
        jobDescription: formData.jobDescription,
        companyApplied: formData.companyApplied,
        roleApplied: formData.roleApplied,
      }

      if (resumeOption === 'existing') {
        if (!selectedResumeId) {
          throw new Error('Please select a resume')
        }
        formDataToStore.parsed_resume_id = selectedResumeId
      } else {
        if (!formData.resume) {
          throw new Error('Please upload a resume')
        }
        // Convert File object to base64 string
        const reader = new FileReader()
        reader.readAsDataURL(formData.resume)
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            formDataToStore.resume = reader.result
            formDataToStore.fileName = formData.resume.name
            resolve()
          }
          reader.onerror = reject
        })
      }

      sessionStorage.setItem('pendingFormData', JSON.stringify(formDataToStore))
      router.push('/applications/loading')
      
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert(error.message || 'Error preparing submission. Please try again.')
      setIsProcessing(false)
    }
  }

  const renderResumeUpload = () => (
    <div className="flex items-center justify-center w-full">
      <label 
        className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
          dragActive ? 'border-cyan-500 bg-cyan-100' : 'border-cyan-300'
        } ${
          fileError ? 'border-red-300 bg-red-50' : ''
        } border-dashed rounded-lg cursor-pointer bg-cyan-50 hover:bg-cyan-100 transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-8 h-8 mb-2 ${fileError ? 'text-red-600' : 'text-cyan-600'}`} />
          {formData.resume ? (
            <>
              <p className="mb-2 text-sm text-green-600">Selected: {formData.resume.name}</p>
              <p className="text-xs text-gray-500">
                ({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-cyan-600">
                Drag and drop your resume or click to upload
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </>
          )}
          {fileError && (
            <p className="mt-2 text-sm text-red-600">{fileError}</p>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6" onDragEnter={handleDrag}>
        <div className="space-y-4">
          {/* Resume Selection */}
          <div className="space-y-4">
            <Label>Resume</Label>
            <RadioGroup 
              value={resumeOption} 
              onValueChange={setResumeOption} 
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="font-normal">Upload New Resume</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="existing" 
                  id="existing" 
                  disabled={isLoadingResumes || parsedResumes.length === 0}
                />
                <Label htmlFor="existing" className="font-normal">
                  Use Existing Resume
                  {isLoadingResumes && " (Loading...)"}
                  {!isLoadingResumes && parsedResumes.length === 0 && " (No resumes found)"}
                  {!isLoadingResumes && parsedResumes.length > 0 && ` (${parsedResumes.length} available)`}
                </Label>
              </div>
            </RadioGroup>
            {resumeOption === 'new' ? (
                renderResumeUpload()
              ) : (
                <Select 
                  value={selectedResumeId} 
                  onValueChange={setSelectedResumeId}
                  disabled={isLoadingResumes || parsedResumes.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      isLoadingResumes 
                        ? "Loading resumes..." 
                        : parsedResumes.length === 0 
                          ? "No resumes found" 
                          : "Select a resume"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {parsedResumes.map((resume) => (
                      <SelectItem 
                        key={resume.id} 
                        value={resume.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span>
                            {resume.original_filename || 
                              resume.parsed_data?.content?.sections?.find(
                                s => s.type === "contact_information"
                              )?.content?.name || 
                              'Unnamed Resume'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {resume.last_used ? (
                              `Last used: ${resume.last_used.company} (${new Date(resume.last_used.date).toLocaleDateString()})`
                            ) : (
                              `Created: ${new Date(resume.created_at).toLocaleDateString()}`
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

          {/* Company and Role Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Applied</Label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.companyApplied}
                onChange={(e) => setFormData(prev => ({ ...prev, companyApplied: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role Applied</Label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.roleApplied}
                onChange={(e) => setFormData(prev => ({ ...prev, roleApplied: e.target.value }))}
                placeholder="Enter role title"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Job Description</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <p>Paste the full job description here to get the best analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px] whitespace-pre-wrap"
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          disabled={
            !formData.jobDescription || 
            !formData.companyApplied || 
            !formData.roleApplied || 
            isProcessing ||
            (resumeOption === 'new' && !formData.resume) ||
            (resumeOption === 'existing' && !selectedResumeId)
          }
        >
          {isProcessing ? 'Processing...' : 'Process Application'}
        </Button>
      </form>
    </div>
  )
}