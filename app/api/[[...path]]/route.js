import { NextResponse } from 'next/server'
import { getCollection } from '../../../lib/mongodb'
import { initializeData, jobsData, newsData, companiesData } from '../../../lib/initData'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'cdc-secret-key'

// Initialize database on first request
let isInitialized = false
async function ensureInitialized() {
  if (!isInitialized) {
    await initializeData()
    isInitialized = true
  }
}

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
    await ensureInitialized()

    // Get statistics
    if (pathname === '/api/statistics') {
      const collection = await getCollection('statistics')
      const data = await collection.findOne({})
      return NextResponse.json(data || {})
    }

    // Get all jobs with filters
    if (pathname === '/api/jobs') {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const locationType = url.searchParams.get('locationType')
      const tag = url.searchParams.get('tag')
      
      let filteredJobs = jobsData;

      if (search && search !== 'undefined') {
        filteredJobs = filteredJobs.filter(job => 
          job.position.toLowerCase().includes(search.toLowerCase()) ||
          job.companies.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (locationType && locationType !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.locationType === locationType);
      }

      if (tag && tag !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.tag === tag);
      }

      // Mensimulasikan data perusahaan yang sudah ada di dalam data dummy
      // Tidak perlu join/populate lagi

      return NextResponse.json(filteredJobs);
    }

    // Get latest 6 jobs
    if (pathname === '/api/jobs/latest') {
      const jobsCollection = await getCollection('jobs')
      const companiesCollection = await getCollection('companies')
      
      const jobs = await jobsCollection
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray()
      
      // Populate company data
      const jobsWithCompanies = await Promise.all(
        jobs.map(async (job) => {
          const company = await companiesCollection.findOne({ id: job.companyId })
          return {
            ...job,
            companies: company
          }
        })
      )
      
      return NextResponse.json(jobsWithCompanies)
    }

    // Get single job by ID
    if (pathname.startsWith('/api/jobs/') && pathname !== '/api/jobs/latest' && pathname !== '/api/jobs/apply') {
      const jobId = pathname.split('/').pop()
      const jobsCollection = await getCollection('jobs')
      const companiesCollection = await getCollection('companies')
      
      const job = await jobsCollection.findOne({ id: jobId })
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      
      const company = await companiesCollection.findOne({ id: job.companyId })
      
      return NextResponse.json({
        ...job,
        companies: company
      })
    }

    // Get all companies
    if (pathname === '/api/companies') {
      // Menggunakan data dummy companies
      return NextResponse.json(companiesData);
    }

    // Get company by ID
    if (pathname.startsWith('/api/companies/')) {
      const companyId = pathname.split('/').pop()
      const collection = await getCollection('companies')
      const data = await collection.findOne({ id: companyId })
      
      if (!data) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }
      
      return NextResponse.json(data)
    }

    // Get testimonials
    if (pathname === '/api/testimonials') {
      const collection = await getCollection('testimonials')
      const data = await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      return NextResponse.json(data)
    }

    // Get news and events
    if (pathname === '/api/news') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      
      let filteredNews = newsData;

      if (category && category !== 'all') {
        filteredNews = newsData.filter(item => item.category === category);
      }
      
      return NextResponse.json(filteredNews);
    }


    // Get student profile (protected)
    if (pathname === '/api/students/profile') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const collection = await getCollection('students')
      const student = await collection.findOne({ id: user.id })
      
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      
      // Remove password from response
      delete student.password
      
      return NextResponse.json(student)
    }

    // Get student's applications (protected)
    if (pathname === '/api/students/applications') {
      const user = getUserFromRequest(request)
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      
      const applicationsCollection = await getCollection('applications')
      const jobsCollection = await getCollection('jobs')
      const companiesCollection = await getCollection('companies')
      
      const applications = await applicationsCollection
        .find({ studentId: user.id })
        .sort({ applicationDate: -1 })
        .toArray()
      
      // Populate job and company data
      const applicationsWithDetails = await Promise.all(
        applications.map(async (app) => {
          const job = await jobsCollection.findOne({ id: app.jobId })
          let company = null
          if (job) {
            company = await companiesCollection.findOne({ id: job.companyId })
          }
          return {
            ...app,
            internship_jobs: job ? {
              ...job,
              companies: company
            } : null
          }
        })
      )
      
      return NextResponse.json(applicationsWithDetails)
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
    await ensureInitialized()

    // Register student
    if (pathname === '/api/auth/register') {
      const body = await request.json()
      const { nim, fullName, email, password, major } = body
      
      if (!nim || !fullName || !email || !password || !major) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
      }
      
      const collection = await getCollection('students')
      
      // Check if student already exists
      const existingStudent = await collection.findOne({
        $or: [{ nim }, { email }]
     })
      
      if (existingStudent) {
        return NextResponse.json({ error: 'Student with this NIM or email already exists' }, { status: 400 })
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create student
      const studentId = `student_${uuidv4()}`
      const newStudent = {
        id: studentId,
        nim,
        fullName,
        email,
        password: hashedPassword,
        major,
        currentSks: 0,
        gpa: 0.00,
        isEligible: false,
        cvPath: null,
        portfolioPath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await collection.insertOne(newStudent)
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newStudent.id, nim: newStudent.nim, email: newStudent.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      // Remove password from response
      delete newStudent.password
      delete newStudent._id
      
      return NextResponse.json({ token, student: newStudent })
    }

    // Login student
    if (pathname === '/api/auth/login') {
      const body = await request.json()
      const { email, password } = body
      
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
      }
      
      const collection = await getCollection('students')
      
      // Find student
      const student = await collection.findOne({ email })
      
      if (!student) {
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
      
      // Remove password and _id from response
      delete student.password
      delete student._id
      
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
      
      const jobsCollection = await getCollection('jobs')
      const applicationsCollection = await getCollection('applications')
      
      // Check if job exists
      const job = await jobsCollection.findOne({ id: jobId })
      
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }
      
      // Check if already applied
      const existingApplication = await applicationsCollection.findOne({
        studentId: user.id,
        jobId: jobId
      })
      
      if (existingApplication) {
        return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 })
      }
      
      // Create application
      const applicationId = `app_${uuidv4()}`
      const newApplication = {
        id: applicationId,
        studentId: user.id,
        jobId: jobId,
        applicationDate: new Date(),
        status: 'Applied',
        notes: null
      }
      
      await applicationsCollection.insertOne(newApplication)
      
      delete newApplication._id
      
      return NextResponse.json({ message: 'Application submitted successfully', application: newApplication })
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
    await ensureInitialized()

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
      
      const collection = await getCollection('students')
      
      await collection.updateOne(
        { id: user.id },
        {
          $set: {
            currentSks,
            gpa,
            cvPath,
            portfolioPath,
            isEligible,
            updatedAt: new Date()
          }
        }
      )
      
      const updatedStudent = await collection.findOne({ id: user.id })
      
      if (!updatedStudent) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }
      
      // Remove password and _id from response
      delete updatedStudent.password
      delete updatedStudent._id
      
      return NextResponse.json(updatedStudent)
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
