'use client'
import { Suspense } from 'react'
import { LoginPageSkeleton } from '@/components/skeletons/login-page/LoginPageSkeleton'
import LoginForm from './LoginForm'



const LoginPage = () => {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
