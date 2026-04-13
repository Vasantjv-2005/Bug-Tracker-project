'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const [data, setData] = useState({
    dailyIssues: [],
    dailyProjects: [],
    totalStats: {
      totalIssues: 0,
      totalProjects: 0,
      thisWeekIssues: 0,
      thisWeekProjects: 0
    },
    statusDistribution: [],
    priorityDistribution: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all projects first
      const projectsResponse = await api.getProjects()
      const projects = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse.projects || []
      
      // Fetch issues for each project
      const allIssues = []
      for (const project of projects) {
        try {
          const issuesResponse = await api.getIssues(project._id || project.id)
          const projectIssues = Array.isArray(issuesResponse) ? issuesResponse : issuesResponse.issues || []
          allIssues.push(...projectIssues)
        } catch (error) {
          console.error(`Error fetching issues for project ${project.id}:`, error)
        }
      }
      
      // Process daily data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split('T')[0]
      })
      
      const dailyIssues = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        issues: allIssues.filter(issue => 
          new Date(issue.createdAt).toISOString().split('T')[0] === date
        ).length,
        fullDate: date
      }))
      
      const dailyProjects = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        projects: projects.filter(project => 
          new Date(project.createdAt).toISOString().split('T')[0] === date
        ).length,
        fullDate: date
      }))
      
      // Calculate stats
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const thisWeekIssues = allIssues.filter(issue => 
        new Date(issue.createdAt) >= oneWeekAgo
      ).length
      
      const thisWeekProjects = projects.filter(project => 
        new Date(project.createdAt) >= oneWeekAgo
      ).length
      
      // Status distribution
      const statusDistribution = [
        { name: 'To Do', value: allIssues.filter(i => i.status === 'todo' || i.status === 'To Do').length, color: '#f59e0b' },
        { name: 'In Progress', value: allIssues.filter(i => i.status === 'in-progress' || i.status === 'In Progress').length, color: '#3b82f6' },
        { name: 'Done', value: allIssues.filter(i => i.status === 'done' || i.status === 'Done').length, color: '#10b981' }
      ]
      
      // Priority distribution
      const priorityDistribution = [
        { name: 'Low', value: allIssues.filter(i => i.priority === 'low').length, color: '#10b981' },
        { name: 'Medium', value: allIssues.filter(i => i.priority === 'medium').length, color: '#f59e0b' },
        { name: 'High', value: allIssues.filter(i => i.priority === 'high').length, color: '#ef4444' }
      ]
      
      setData({
        dailyIssues,
        dailyProjects,
        totalStats: {
          totalIssues: allIssues.length,
          totalProjects: projects.length,
          thisWeekIssues,
          thisWeekProjects
        },
        statusDistribution,
        priorityDistribution
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading analytics...</p>
            </div>
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
              Analytics Dashboard
            </h1>
            <p className="text-blue-200 text-lg">
              Track your project and issue metrics over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">Total Issues</p>
                    <p className="text-3xl font-bold text-white">{data.totalStats.totalIssues}</p>
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
                    <p className="text-sm font-medium text-blue-200">Total Projects</p>
                    <p className="text-3xl font-bold text-white">{data.totalStats.totalProjects}</p>
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
                    <p className="text-sm font-medium text-blue-200">This Week Issues</p>
                    <p className="text-3xl font-bold text-white">{data.totalStats.thisWeekIssues}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 transform transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-200">This Week Projects</p>
                    <p className="text-3xl font-bold text-white">{data.totalStats.thisWeekProjects}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Issues Chart */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Daily Issues Created (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.dailyIssues}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }} 
                    />
                    <Bar dataKey="issues" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Projects Chart */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Daily Projects Created (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.dailyProjects}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }} 
                    />
                    <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Issue Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Issue Priority Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.priorityDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }} 
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {data.priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
      `}</style>
    </div>
  )
}
