'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Bug, Search, Filter, Plus, Calendar, User, ArrowRight } from 'lucide-react'

interface Issue {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done' | 'To Do' | 'In Progress' | 'Done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  project?: {
    name: string
  }
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    fetchAllIssues()
  }, [])

  useEffect(() => {
    filterIssues()
  }, [issues, searchTerm, statusFilter, priorityFilter])

  const fetchAllIssues = async () => {
    try {
      setIsLoading(true)
      const projectsResponse = await api.getProjects()
      const projects = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse.projects || []
      
      const allIssues = []
      for (const project of projects) {
        try {
          const issuesResponse = await api.getIssues(project._id || project.id)
          const projectIssues = Array.isArray(issuesResponse) ? issuesResponse : issuesResponse.issues || []
          allIssues.push(...projectIssues.map(issue => ({
            ...issue,
            project: { name: project.name }
          })))
        } catch (error) {
          console.error(`Error fetching issues for project ${project.id}:`, error)
        }
      }
      
      setIssues(allIssues)
    } catch (error) {
      toast.error('Failed to load issues')
    } finally {
      setIsLoading(false)
    }
  }

  const filterIssues = () => {
    let filtered = issues

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => 
        issue.status === statusFilter || 
        (statusFilter === 'todo' && issue.status === 'To Do') ||
        (statusFilter === 'in-progress' && issue.status === 'In Progress') ||
        (statusFilter === 'done' && issue.status === 'Done')
      )
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter)
    }

    setFilteredIssues(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
      case 'To Do':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'in-progress':
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'done':
      case 'Done':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-200">Loading issues...</p>
          </div>
        </div>
      </div>
    )
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              All Issues
            </h1>
            <p className="text-blue-200 text-lg">
              Manage and track all your issues across projects
            </p>
          </div>

          {/* Filters and Search */}
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25"></div>
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-25"></div>
                  <div className="relative flex items-center">
                    <Search className="h-5 w-5 text-blue-300 absolute left-3" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:border-white/40"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-lg blur opacity-25"></div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer focus:border-white/40"
                  >
                    <option value="all" className="bg-black">All Status</option>
                    <option value="todo" className="bg-black">To Do</option>
                    <option value="in-progress" className="bg-black">In Progress</option>
                    <option value="done" className="bg-black">Done</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-lg blur opacity-25"></div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg appearance-none cursor-pointer focus:border-white/40"
                  >
                    <option value="all" className="bg-black">All Priority</option>
                    <option value="low" className="bg-black">Low</option>
                    <option value="medium" className="bg-black">Medium</option>
                    <option value="high" className="bg-black">High</option>
                  </select>
                </div>

                {/* New Issue Button */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                  <Button className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                    <Plus className="h-4 w-4 mr-2" />
                    New Issue
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-12 text-center">
                  <div className="h-20 w-20 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Bug className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No issues found</h3>
                  <p className="text-blue-200">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Try adjusting your filters or search terms'
                      : 'Create your first issue to get started'}
                  </p>
                </Card>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6 transform transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {issue.title}
                          </h3>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status === 'todo' ? 'To Do' : 
                             issue.status === 'in-progress' ? 'In Progress' : 
                             issue.status === 'done' ? 'Done' : issue.status}
                          </Badge>
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-blue-200 mb-4 line-clamp-2">
                          {issue.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-blue-300">
                          {issue.project && (
                            <div className="flex items-center gap-1">
                              <span>Project:</span>
                              <span className="font-medium">{issue.project.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                        <Button className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-lg transform transition-all duration-300 group-hover:scale-105">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
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
      `}</style>
    </div>
  )
}
