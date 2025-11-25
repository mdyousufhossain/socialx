import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must not exceed 20 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      ),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[@$!%*?&#]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
})

export const productSchema = z.object({
  title: z.string().min(3).max(100),
  productid: z.string().min(5).max(32),
  creator: z.string(),
  specifications: z.array(
    z.object({
      title: z.string().min(3).max(32),
      details: z.string().min(3).max(32)
    })
  ),
  materials: z.array(
    z.object({
      title: z.string().min(3).max(32),
      details: z.string().min(3).max(32)
    })
  ),
  questions: z.array(
    z.object({
      question: z.string().min(3).max(32),
      answer: z.string().min(3).max(32)
    })
  ),
  images: z.array(z.string()).min(2).max(8),
  tags: z.array(z.string().min(3).max(16)).min(1).max(4)
})

/**
 * @newProductSchema
 * @description is optional it should be html or markdown text
 */
export const AddingNewProductValidation = {
  title: {
    minLength: 3,
    maxLength: 255,
    error: 'Title must be between 3 and 100 characters'
  },
  productid: {
    minLength: 3,
    maxLength: 255,
    error: 'Product ID must be between 3 and 50 characters'
  },
  code: {
    minLength: 1,
    maxLength: 255,
    error: 'Product code must be between 1 and 6 digits'
  },
  price: {
    required: true,
    error: 'Price is required'
  },
  category: {
    required: true,
    error: 'Category is required'
  },
  description: {
    maxLength: 500,
    error: 'Description cannot exceed 500 characters'
  },
  specifications: {
    required: true,
    error: 'At least one specification is required',
    items: {
      properties: {
        title: { minLength: 1, maxLength: 255 },
        details: { minLength: 1, maxLength: 255 }
      },
      error: 'must be between 1 and 100 characters'
    }
  },
  materials: {
    required: true,
    error: 'At least one material is required',
    items: {
      properties: {
        title: { minLength: 1, maxLength: 255 },
        details: { minLength: 1, maxLength: 255 }
      },
      error: 'must be between 1 and 100 characters'
    }
  },
  questions: {
    required: true,
    error: 'At least one question is required',
    items: {
      properties: {
        question: { minLength: 1, maxLength: 255 },
        answer: { minLength: 1, maxLength: 255 }
      },
      error: 'must be between 1 and 200 characters'
    }
  },
  images: {
    required: true,
    minLength: 2,
    error: 'At least 2 images are required'
  },
  tags: {
    required: true,
    minLength: 1,
    error: 'At least one tag is required'
  },
  stock: {
    required: true,
    min: 0,
    error: 'Stock amount must be a non-negative number'
  }
}

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
