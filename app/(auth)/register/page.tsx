'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react' // 🔑 Import useState
import { RegisterSchema, registerSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Card, // 🔑 Added Card components
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert' // 🔑 Added Alert variants
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react' // 🔑 Import icons

const RegisterPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // 🔑 State for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // 🔑 State for confirm password
  const { register } = useAuth()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // Form submission
  const onSubmit = async (data: RegisterSchema) => {
    setError(null)
    setIsLoading(true)
    try {
      await register(data)
      // 💡 Consider adding a success toast here
      router.push('/login')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md"> {/* 🔑 Use Card */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl font-bold text-primary-300">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                disabled={isLoading} // 🔑 Disable on loading
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be 3-20 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    {/* 🔑 Relative container for icon */}
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          // 🔑 Toggle type based on state
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      {/* 🔑 Show/Hide Icon */}
                      <div className="absolute inset-y-0 right-3 flex cursor-pointer items-center">
                        {showPassword
                          ? (
                          <EyeOff
                            className="size-5 text-gray-400"
                            onClick={() => setShowPassword(false)}
                          />
                            )
                          : (
                          <Eye
                            className="size-5 text-gray-400"
                            onClick={() => setShowPassword(true)}
                          />
                            )}
                      </div>
                    </div>
                    <FormDescription>
                      At least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    {/* 🔑 Relative container for icon */}
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          // 🔑 Toggle type based on state
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      {/* 🔑 Show/Hide Icon */}
                      <div className="absolute inset-y-0 right-3 flex cursor-pointer items-center">
                        {showConfirmPassword
                          ? (
                          <EyeOff
                            className="size-5 text-gray-400"
                            onClick={() => setShowConfirmPassword(false)}
                          />
                            )
                          : (
                          <Eye
                            className="size-5 text-gray-400"
                            onClick={() => setShowConfirmPassword(true)}
                          />
                            )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                    )
                  : (
                      'Create Account'
                    )}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* 🔑 Footer link to Login */}
        <CardFooter className="justify-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-1"
            onClick={() => router.push('/login')}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage
