'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'
import KanbanBoard from '@/components/dashboard/kanban-board'
import CreateIssueModal from '@/components/dashboard/create-issue-modal'

interface Project {
  id: string
  name: string
  description: string
}

interface Issue {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done' | 'To Do' | 'In Progress' | 'Done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  createdAt: string
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching project data for ID:", projectId)
      const [projectResponse, issuesResponse] = await Promise.all([
        api.getProject(projectId),
        api.getIssues(projectId),
      ])
      console.log("Project response:", projectResponse)
      console.log("Issues response:", issuesResponse)
      
      // Handle project data
      const project = projectResponse.project || projectResponse
      setProject(project)
      
      // Handle issues data
      const rawIssues = Array.isArray(issuesResponse) ? issuesResponse : issuesResponse.issues || []
      
      // Map MongoDB _id to frontend id field
      const issues = rawIssues.map((issue: any) => ({
        ...issue,
        id: issue._id || issue.id
      }))
      
      console.log("Setting issues:", issues)
      setIssues(issues)
      console.log("Issues set in state:", issues.length)
    } catch (error: any) {
      console.error("Fetch project data error:", error)
      toast.error(error.message || 'Failed to load project')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIssueCreated = () => {
    console.log("=== Issue Created - Refreshing Data ===")
    setShowCreateModal(false)
    fetchProjectData()
    toast.success('Issue created successfully!')
  }

  const handleIssueUpdated = () => {
    fetchProjectData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        {/* Animated floating elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push('/dashboard')}
                    className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {project.name}
                  </h1>
                  <p className="text-blue-200 mt-2 text-lg">{project.description}</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 transform group-hover:scale-105 group-hover:-translate-y-1"
                >
                  <Plus className="h-5 w-5" />
                  New Issue
                </Button>
              </div>
            </div>
            
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Total Issues</p>
                      <p className="text-2xl font-bold text-white">{issues.length}</p>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="h-5 w-5 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200">To Do</p>
                      <p className="text-2xl font-bold text-white">
                        {issues.filter(i => i.status === 'todo' || i.status === 'To Do').length}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <div className="h-5 w-5 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200">In Progress</p>
                      <p className="text-2xl font-bold text-white">
                        {issues.filter(i => i.status === 'in-progress' || i.status === 'In Progress').length}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <div className="h-5 w-5 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Completed</p>
                      <p className="text-2xl font-bold text-white">
                        {issues.filter(i => i.status === 'done' || i.status === 'Done').length}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <div className="h-5 w-5 bg-white rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <KanbanBoard
                issues={issues}
                projectId={projectId}
                onIssueUpdated={handleIssueUpdated}
              />
            </div>
          </div>
        </div>

        <CreateIssueModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleIssueCreated}
          projectId={projectId}
        />
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}
