'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { User, Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    projectUpdates: true,
    issueAssigned: true,
    issueCompleted: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await api.getCurrentUser()
      setUser(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - in real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (user.newPassword !== user.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      // Simulate API call - in real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password updated successfully')
      setUser(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - in real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Preferences updated successfully')
    } catch (error) {
      toast.error('Failed to update preferences')
    } finally {
      setIsLoading(false)
    }
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
              Settings
            </h1>
            <p className="text-blue-200 text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
                  <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white font-medium border border-white/10">
                      <User className="h-5 w-5" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-white/10 text-blue-200 transition-colors">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-white/10 text-blue-200 transition-colors">
                      <Shield className="h-5 w-5" />
                      Security
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-white/10 text-blue-200 transition-colors">
                      <Palette className="h-5 w-5" />
                      Appearance
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-white/10 text-blue-200 transition-colors">
                      <Globe className="h-5 w-5" />
                      Language & Region
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-white/10 text-blue-200 transition-colors">
                      <HelpCircle className="h-5 w-5" />
                      Help & Support
                    </button>
                  </nav>
                </Card>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-blue-200">Full Name</Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-25"></div>
                        <Input
                          id="name"
                          value={user.name}
                          onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                          className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:border-white/40 mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-blue-200">Email Address</Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-25"></div>
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="relative bg-white/5 backdrop-blur-sm border border-white/10 text-blue-200 mt-1"
                        />
                      </div>
                      <p className="text-sm text-blue-300 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                        className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                      >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Security Settings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Security</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-blue-200">Current Password</Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg blur opacity-25"></div>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={user.currentPassword}
                          onChange={(e) => setUser(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:border-white/40 mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword" className="text-blue-200">New Password</Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg blur opacity-25"></div>
                        <Input
                          id="newPassword"
                          type="password"
                          value={user.newPassword}
                          onChange={(e) => setUser(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:border-white/40 mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword" className="text-blue-200">Confirm New Password</Label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-25"></div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={user.confirmPassword}
                          onChange={(e) => setUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:border-white/40 mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                      <Button 
                        onClick={handlePasswordUpdate}
                        disabled={isLoading || !user.currentPassword || !user.newPassword}
                        className="relative w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Notification Settings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="text-blue-200">Email Notifications</Label>
                        <p className="text-sm text-blue-300">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="border-t border-white/10"></div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports" className="text-blue-200">Weekly Reports</Label>
                        <p className="text-sm text-blue-300">Get weekly summary of your projects</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyReports: checked }))}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="border-t border-white/10"></div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="projectUpdates" className="text-blue-200">Project Updates</Label>
                        <p className="text-sm text-blue-300">Notifications about project changes</p>
                      </div>
                      <Switch
                        id="projectUpdates"
                        checked={preferences.projectUpdates}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, projectUpdates: checked }))}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="border-t border-white/10"></div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="issueAssigned" className="text-blue-200">Issue Assigned</Label>
                        <p className="text-sm text-blue-300">When an issue is assigned to you</p>
                      </div>
                      <Switch
                        id="issueAssigned"
                        checked={preferences.issueAssigned}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, issueAssigned: checked }))}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                      <Button 
                        onClick={handlePreferencesUpdate}
                        disabled={isLoading}
                        className="relative w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 mt-6"
                      >
                        {isLoading ? 'Updating...' : 'Update Preferences'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Appearance Settings */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-25"></div>
                <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Appearance</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme" className="text-blue-200">Theme</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                        <SelectTrigger className="mt-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border border-white/20">
                          <SelectItem value="light" className="text-white">Light</SelectItem>
                          <SelectItem value="dark" className="text-white">Dark</SelectItem>
                          <SelectItem value="system" className="text-white">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="language" className="text-blue-200">Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger className="mt-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border border-white/20">
                          <SelectItem value="en" className="text-white">English</SelectItem>
                          <SelectItem value="es" className="text-white">Spanish</SelectItem>
                          <SelectItem value="fr" className="text-white">French</SelectItem>
                          <SelectItem value="de" className="text-white">German</SelectItem>
                          <SelectItem value="it" className="text-white">Italian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone" className="text-blue-200">Timezone</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger className="mt-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border border-white/20">
                          <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                          <SelectItem value="EST" className="text-white">Eastern Time</SelectItem>
                          <SelectItem value="PST" className="text-white">Pacific Time</SelectItem>
                          <SelectItem value="GMT" className="text-white">Greenwich Mean Time</SelectItem>
                          <SelectItem value="CET" className="text-white">Central European Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
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
