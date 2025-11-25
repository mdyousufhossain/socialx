'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react' // 🔑 useState is already here
import { LoginSchema, loginSchema } from '@/lib/validation'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
// 🔑 Added Eye and EyeOff icons
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { LoginPageSkeleton } from '@/components/skeletons/login-page/LoginPageSkeleton'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // 🔑 State for password visibility

  const sessionExpiredError = searchParams.get('error') === 'session_expired'
    ? 'Your session has expired. Please log in again.'
    : null

  const currentError = error || sessionExpiredError

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginSchema) => {
    setError(null)
    setIsSubmitting(true)

    try {
      await login(data)
      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, router, loading])

  if (loading || user) {
    return <LoginPageSkeleton />
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <Card className='w-full max-w-md'>

        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-3xl font-bold text-primary-300'>
            Welcome Back!
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentError && (
            <Alert variant="destructive" className='mb-4'>
              <AlertCircle className="size-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>
                {currentError}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                disabled={isSubmitting}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='you@example.com'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔑 MODIFIED PASSWORD FIELD */}
              <FormField
                control={form.control}
                name='password'
                disabled={isSubmitting}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-normal"
                        onClick={() => router.push('/forgot-password')}
                        type='button'
                        disabled={isSubmitting}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    {/* 1. Relative container for icon */}
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder='••••••••'
                          // 2. Toggle type based on state
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      {/* 3. Show/Hide Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex cursor-pointer items-center justify-center"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword
                          ? (
                          <EyeOff className="size-4 text-gray-500" />
                            )
                          : (
                          <Eye className="size-4 text-gray-500" />
                            )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}
              >
                {/* 💡 Corrected logic to use isSubmitting, not loading */}
                {isSubmitting
                  ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Please wait...
                      </>
                    )
                  : (
                      'Sign In'
                    )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='justify-center text-sm text-gray-500 dark:text-gray-400'>
          Don&apos;t have an account?
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-1"
            onClick={() => router.push('/register')}
            disabled={isSubmitting}
          >
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
