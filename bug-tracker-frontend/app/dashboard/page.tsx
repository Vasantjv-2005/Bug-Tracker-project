'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import CreateProjectModal from '@/components/dashboard/create-project-modal'

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  issueCount?: number
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await api.getProjects()
      const projectsData = Array.isArray(data) ? data : data.projects || []
      
      // Fetch issue count for each project
      const projectsWithIssueCounts = await Promise.all(
        projectsData.map(async (project: any) => {
          try {
            const issues = await api.getIssues(project._id || project.id)
            const issueCount = Array.isArray(issues) ? issues.length : (issues.issues || []).length
            return {
              ...project,
              id: project._id?.toString() || project.id?.toString() || Math.random().toString(),
              issueCount
            }
          } catch (error) {
            return {
              ...project,
              id: project._id?.toString() || project.id?.toString() || Math.random().toString(),
              issueCount: 0
            }
          }
        })
      )
      
      setProjects(projectsWithIssueCounts)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreated = () => {
    fetchProjects()
    setShowCreateModal(false)
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-blue-200 text-lg mt-2">
                Manage your projects and track issues
              </p>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 transform group-hover:scale-105 group-hover:-translate-y-1"
              >
                <Plus className="h-5 w-5" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Total Projects</p>
                    <p className="text-3xl font-bold text-white">{projects.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Total Issues</p>
                    <p className="text-3xl font-bold text-white">
                      {projects.reduce((sum, project) => sum + (project.issueCount || 0), 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Active Projects</p>
                    <p className="text-3xl font-bold text-white">
                      {projects.filter(p => (p.issueCount || 0) > 0).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Avg Issues/Project</p>
                    <p className="text-3xl font-bold text-white">
                      {projects.length > 0 ? Math.round(projects.reduce((sum, project) => sum + (project.issueCount || 0), 0) / projects.length) : 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
                <p className="text-blue-200">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-2xl blur opacity-25"></div>
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    No projects yet
                  </h2>
                  <p className="text-blue-200 mb-8 text-lg">
                    Create your first project to get started
                  </p>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg transform group-hover:scale-105 group-hover:-translate-y-1"
                    >
                      <Plus className="h-5 w-5" />
                      Create Your First Project
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}`}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transform transition-all duration-300 group-hover:scale-105 cursor-pointer overflow-hidden">
                      {/* Project Header */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                            {project.name}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-blue-200 mb-6 flex-1 line-clamp-3 leading-relaxed">
                          {project.description || 'No description provided'}
                        </p>
                        
                        {/* Stats Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-white">
                              {project.issueCount || 0} issues
                            </span>
                          </div>
                          <span className="text-xs text-blue-300">
                            {new Date(project.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <CreateProjectModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleProjectCreated}
          />
        </div>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
