import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'cdc-secret-key'

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Helper function to get user from token
const getUserFromRequest = (request) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  return verifyToken(token)
}

export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  try {
    // Get statistics
    if (pathname === '/api/statistics') {
      const { data, error } = await supabase
        .from('cdc_statistics')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || {})
    }

    // Get all jobs with filters
    if (pathname === '/api/jobs') {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const locationType = url.searchParams.get('locationType')
      const tag = url.searchParams.get('tag')
      
      let query = supabase
        .from('internship_jobs')
        .select(`
          *,
          companies (
            id,
            name,
            logoPath,
            industrySector,
            location
          )
        `)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
      
      if (search) {
        query = query.or(`position.ilike.%${search}%,description.ilike.%${search}%`)
      }
      
      if (locationType) {
        query = query.eq('locationType', locationType)
      }
      
      if (tag) {
        query = query.eq('tag', tag)
      }
      
      const { data, error } = await query
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    // Get latest 6 jobs
    if (pathname === '/api/jobs/latest') {
      const { data, error } = await supabase
        .from('internship_jobs')
        .select(`
          *,
          companies (
            id,
            name,
            logoPath,
            industrySector,
            location
          )
        `)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
        .limit(6)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    // Get single job by ID
    if (pathname.startsWith('/api/jobs/')) {
      const jobId = pathname.split('/').pop()
      const { data, error } = await supabase
        .from('internship_jobs')
        .select(`
          *,
          companies (
            id,
            name,
            logoPath,
            industrySector,
            location,
            websiteUrl,
            description
          )
        `)
        .eq('id', jobId)
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      
      return NextResponse.json(data)
    }

    // Get all companies
    if (pathname === '/api/companies') {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    // Get company by ID
    if (pathname.startsWith('/api/companies/')) {
      const companyId = pathname.split('/').pop()
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      
      return NextResponse.json(data)
    }

    // Get testimonials
    if (pathname === '/api/testimonials') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    // Get news and events
    if (pathname === '/api/news') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      
      let query = supabase
        .from('news_events')
        .select('*')
        .eq('isActive', true)
        .order('eventDate', { ascending: false })
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    // Get student profile (protected)
    if (pathname === '/api/students/profile') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const { data, error } = await supabase
        .from('students')
        .select('id, nim, fullName, email, major, currentSks, gpa, isEligible, cvPath, portfolioPath')
        .eq('id', user.id)
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      
      return NextResponse.json(data)
    }

    // Get student's applications (protected)
    if (pathname === '/api/students/applications') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          internship_jobs (
            id,
            position,
            locationType,
            companies (
              name,
              logoPath
            )
          )
        `)
        .eq('studentId', user.id)
        .order('applicationDate', { ascending: false })
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data || [])
    }

    return NextResponse.json({ message: 'CDC Cakrawala University API' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url)
  
  try {
    // Register student
    if (pathname === '/api/auth/register') {
      const body = await request.json()
      const { nim, fullName, email, password, major } = body
      
      if (!nim || !fullName || !email || !password || !major) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
      }
      
      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .or(`nim.eq.${nim},email.eq.${email}`)
        .single()
      
      if (existingStudent) {
        return NextResponse.json({ error: 'Student with this NIM or email already exists' }, { status: 400 })
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create student
      const studentId = `student_${uuidv4()}`
      const { data, error } = await supabase
        .from('students')
        .insert([{
          id: studentId,
          nim,
          fullName,
          email,
          password: hashedPassword,
          major,
          currentSks: 0,
          gpa: 0.00,
          isEligible: false
        }])
        .select('id, nim, fullName, email, major, currentSks, gpa, isEligible')
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: data.id, nim: data.nim, email: data.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({ token, student: data })
    }

    // Login student
    if (pathname === '/api/auth/login') {
      const body = await request.json()
      const { email, password } = body
      
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
      }
      
      // Find student
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error || !student) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, student.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: student.id, nim: student.nim, email: student.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      // Remove password from response
      delete student.password
      
      return NextResponse.json({ token, student })
    }

    // Apply for job (protected)
    if (pathname === '/api/jobs/apply') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const body = await request.json()
      const { jobId } = body
      
      if (!jobId) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
      }
      
      // Check if job exists
      const { data: job } = await supabase
        .from('internship_jobs')
        .select('id')
        .eq('id', jobId)
        .single()
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      
      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('studentId', user.id)
        .eq('jobId', jobId)
        .single()
      
      if (existingApplication) {
        return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 })
      }
      
      // Create application
      const applicationId = `app_${uuidv4()}`
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{
          id: applicationId,
          studentId: user.id,
          jobId: jobId,
          status: 'Applied'
        }])
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ message: 'Application submitted successfully', application: data })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  const { pathname } = new URL(request.url)
  
  try {
    // Update student profile (protected)
    if (pathname === '/api/students/profile') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const body = await request.json()
      const { currentSks, gpa, cvPath, portfolioPath } = body
      
      // Calculate eligibility (SKS >= 100, GPA >= 2.75)
      const isEligible = (currentSks >= 100 && gpa >= 2.75)
      
      const { data, error } = await supabase
        .from('students')
        .update({
          currentSks,
          gpa,
          cvPath,
          portfolioPath,
          isEligible
        })
        .eq('id', user.id)
        .select('id, nim, fullName, email, major, currentSks, gpa, isEligible, cvPath, portfolioPath')
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
