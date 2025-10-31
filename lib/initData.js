import { getCollection } from './mongodb'

export async function initializeData() {
  try {
    // Check if data already exists
    const statsCollection = await getCollection('statistics')
    const existingStats = await statsCollection.findOne({})
    
    if (existingStats) {
      console.log('Data already initialized')
      return
    }

    console.log('Initializing database with sample data...')

    // Initialize Statistics
    await statsCollection.insertOne({
      id: 'stat_1',
      totalAlumniPlaced: 250,
      totalCompanies: 50,
      placementRate: 85.5,
      majorEligibleData: {
        'Teknik Informatika': { eligible: 85, total: 100 },
        'Sistem Informasi': { eligible: 78, total: 95 },
        'Manajemen': { eligible: 72, total: 90 },
        'Akuntansi': { eligible: 80, total: 88 }
      },
      updateDate: new Date()
    })

    // Initialize Companies
    const companiesCollection = await getCollection('companies')
    await companiesCollection.insertMany([
      {
        id: 'comp_1',
        name: 'Tech Innovators Indonesia',
        logoPath: 'https://via.placeholder.com/150',
        industrySector: 'Technology',
        description: 'Leading technology company specializing in software development and digital transformation',
        websiteUrl: 'https://techinnovators.id',
        location: 'Jakarta',
        createdAt: new Date()
      },
      {
        id: 'comp_2',
        name: 'Global Finance Corp',
        logoPath: 'https://via.placeholder.com/150',
        industrySector: 'Finance',
        description: 'International financial services provider with focus on digital banking',
        websiteUrl: 'https://globalfinance.com',
        location: 'Surabaya',
        createdAt: new Date()
      },
      {
        id: 'comp_3',
        name: 'Creative Digital Agency',
        logoPath: 'https://via.placeholder.com/150',
        industrySector: 'Marketing',
        description: 'Award-winning digital marketing and creative agency',
        websiteUrl: 'https://creativedigital.id',
        location: 'Bandung',
        createdAt: new Date()
      },
      {
        id: 'comp_4',
        name: 'Smart Solutions Ltd',
        logoPath: 'https://via.placeholder.com/150',
        industrySector: 'Technology',
        description: 'Enterprise software solutions and consulting services',
        websiteUrl: 'https://smartsolutions.co.id',
        location: 'Jakarta',
        createdAt: new Date()
      },
      {
        id: 'comp_5',
        name: 'Eco Business Group',
        logoPath: 'https://via.placeholder.com/150',
        industrySector: 'Sustainability',
        description: 'Sustainable business consulting and green technology',
        websiteUrl: 'https://ecobusiness.id',
        location: 'Yogyakarta',
        createdAt: new Date()
      }
    ])

    // Initialize Jobs
    const jobsCollection = await getCollection('jobs')
    await jobsCollection.insertMany([
      {
        id: 'job_1',
        companyId: 'comp_1',
        position: 'Software Engineer Intern',
        locationType: 'Hybrid',
        tag: 'Berbayar',
        description: 'Join our development team to build cutting-edge web applications using modern technologies.',
        requirements: 'Currently enrolled in Computer Science or related field. Knowledge of JavaScript, React, and Node.js preferred.',
        closingDate: new Date('2025-12-31'),
        salary: 'Rp 4.000.000 - Rp 5.000.000',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'job_2',
        companyId: 'comp_2',
        position: 'Financial Analyst Intern',
        locationType: 'WFO',
        tag: 'Rekomendasi CDC',
        description: 'Work with our finance team to analyze market trends and prepare financial reports.',
        requirements: 'Accounting or Finance major. Strong analytical skills and proficiency in Excel required.',
        closingDate: new Date('2025-11-30'),
        salary: 'Rp 3.500.000',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'job_3',
        companyId: 'comp_3',
        position: 'Digital Marketing Intern',
        locationType: 'WFH',
        tag: 'Remote',
        description: 'Create engaging content and manage social media campaigns for our clients.',
        requirements: 'Marketing or Communications major. Experience with social media platforms and content creation.',
        closingDate: new Date('2025-12-15'),
        salary: 'Rp 3.000.000',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'job_4',
        companyId: 'comp_1',
        position: 'UI/UX Designer Intern',
        locationType: 'Hybrid',
        tag: 'Berbayar',
        description: 'Design intuitive and beautiful user interfaces for web and mobile applications.',
        requirements: 'Design or related field. Proficiency in Figma, Adobe XD, or similar tools.',
        closingDate: new Date('2025-12-31'),
        salary: 'Rp 3.500.000 - Rp 4.500.000',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'job_5',
        companyId: 'comp_4',
        position: 'Data Analyst Intern',
        locationType: 'WFO',
        tag: 'Rekomendasi CDC',
        description: 'Analyze business data and create insights to drive decision-making.',
        requirements: 'Information Systems or Statistics major. Knowledge of SQL and data visualization tools.',
        closingDate: new Date('2025-11-15'),
        salary: 'Rp 4.000.000',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'job_6',
        companyId: 'comp_5',
        position: 'Business Development Intern',
        locationType: 'Hybrid',
        tag: 'Berbayar',
        description: 'Support our business development team in identifying new opportunities and partnerships.',
        requirements: 'Business or Management major. Strong communication and presentation skills.',
        closingDate: new Date('2025-12-20'),
        salary: 'Rp 3.500.000',
        isActive: true,
        createdAt: new Date()
      }
    ])

    // Initialize Testimonials
    const testimonialsCollection = await getCollection('testimonials')
    await testimonialsCollection.insertMany([
      {
        id: 'test_1',
        studentName: 'Budi Santoso',
        companyName: 'Tech Innovators Indonesia',
        position: 'Software Engineer',
        testimonial: 'CDC membantu saya menemukan kesempatan magang yang sempurna. Sekarang saya bekerja full-time di perusahaan impian saya!',
        photoPath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        graduationYear: 2023,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'test_2',
        studentName: 'Siti Rahayu',
        companyName: 'Global Finance Corp',
        position: 'Financial Analyst',
        testimonial: 'Program bimbingan karier dari CDC sangat membantu dalam mempersiapkan diri untuk dunia kerja profesional.',
        photoPath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        graduationYear: 2024,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'test_3',
        studentName: 'Ahmad Wijaya',
        companyName: 'Creative Digital Agency',
        position: 'Digital Marketing Specialist',
        testimonial: 'Melalui CDC, saya mendapat pelatihan workshop yang sangat bermanfaat dan membuka peluang karier di industri kreatif.',
        photoPath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        graduationYear: 2023,
        isActive: true,
        createdAt: new Date()
      }
    ])

    // Initialize News/Events
    const newsCollection = await getCollection('news')
    await newsCollection.insertMany([
      {
        id: 'news_1',
        title: 'Job Fair Cakrawala University 2025',
        content: 'Bergabunglah dengan Job Fair terbesar tahun ini! Lebih dari 50 perusahaan terkemuka akan hadir.',
        eventDate: new Date('2025-08-15'),
        imagePath: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: 'Job Fair',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'news_2',
        title: 'Workshop: Resume Writing & Interview Skills',
        content: 'Tingkatkan kemampuan Anda dalam menulis CV dan menghadapi interview dengan para profesional.',
        eventDate: new Date('2025-07-20'),
        imagePath: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        category: 'Workshop',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'news_3',
        title: 'Seminar: Career Path in Technology Industry',
        content: 'Pelajari berbagai jalur karier di industri teknologi dari para praktisi berpengalaman.',
        eventDate: new Date('2025-07-10'),
        imagePath: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
        category: 'Seminar',
        isActive: true,
        createdAt: new Date()
      }
    ])

    console.log('Database initialized successfully with sample data!')
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}
