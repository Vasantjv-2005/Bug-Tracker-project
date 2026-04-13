'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { UserPlus, Eye, EyeOff, Bug, Sparkles, Shield } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register(email, password, name)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.5), transparent 50%)`,
          }}
        />
        
        {/* Animated floating elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* 3D Card with glassmorphism */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main card */}
            <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
              
              <div className="relative p-8">
                {/* Logo with 3D effect */}
                <div className="flex justify-center mb-8">
                  <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                      <UserPlus className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Title with 3D text effect */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Create Account
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-purple-200">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-lg">Join Bug Tracker today</p>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name input with 3D effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-transparent border-0 text-white placeholder-purple-200 focus:ring-0 focus:border-0"
                      />
                    </div>
                  </div>

                  {/* Email input with 3D effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg blur opacity-25"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-transparent border-0 text-white placeholder-purple-200 focus:ring-0 focus:border-0"
                      />
                    </div>
                  </div>

                  {/* Password input with 3D effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg blur opacity-25"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                      <div className="flex items-center">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="bg-transparent border-0 text-white placeholder-purple-200 focus:ring-0 focus:border-0 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-purple-200 hover:text-white transition-colors p-2"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password input with 3D effect */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg blur opacity-25"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                      <div className="flex items-center">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="bg-transparent border-0 text-white placeholder-purple-200 focus:ring-0 focus:border-0 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-purple-200 hover:text-white transition-colors p-2"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3D Button */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                    <Button
                      type="submit"
                      className="relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <UserPlus className="h-5 w-5" />
                          Create Account
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Link */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-center text-purple-200">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-white hover:text-purple-200 transition-colors underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
