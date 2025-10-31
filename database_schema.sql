-- CDC Cakrawala University Database Schema
-- Run this in your Supabase SQL Editor

-- Drop existing tables if recreating
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS internship_jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS cdc_statistics CASCADE;
DROP TABLE IF EXISTS news_events CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;

-- Students table
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  nim TEXT UNIQUE NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  major TEXT NOT NULL,
  "currentSks" INTEGER DEFAULT 0,
  gpa DECIMAL(3,2) DEFAULT 0.00,
  "isEligible" BOOLEAN DEFAULT false,
  "cvPath" TEXT,
  "portfolioPath" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "logoPath" TEXT,
  "industrySector" TEXT,
  description TEXT,
  "websiteUrl" TEXT,
  location TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internship Jobs table
CREATE TABLE internship_jobs (
  id TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL,
  position TEXT NOT NULL,
  "locationType" TEXT NOT NULL CHECK ("locationType" IN ('WFO', 'WFH', 'Hybrid')),
  tag TEXT CHECK (tag IN ('Berbayar', 'Rekomendasi CDC', 'Remote')),
  description TEXT NOT NULL,
  requirements TEXT,
  "closingDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  salary TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("companyId") REFERENCES companies(id) ON DELETE CASCADE
);

-- Job Applications table
CREATE TABLE job_applications (
  id TEXT PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "applicationDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'Reviewed', 'Interview', 'Accepted', 'Rejected')),
  notes TEXT,
  FOREIGN KEY ("studentId") REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY ("jobId") REFERENCES internship_jobs(id) ON DELETE CASCADE,
  UNIQUE("studentId", "jobId")
);

-- CDC Statistics table
CREATE TABLE cdc_statistics (
  id TEXT PRIMARY KEY,
  "totalAlumniPlaced" INTEGER DEFAULT 0,
  "totalCompanies" INTEGER DEFAULT 0,
  "placementRate" DECIMAL(5,2) DEFAULT 0.00,
  "majorEligibleData" JSONB,
  "updateDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News & Events table
CREATE TABLE news_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "eventDate" TIMESTAMP WITH TIME ZONE,
  "imagePath" TEXT,
  category TEXT CHECK (category IN ('Job Fair', 'Seminar', 'Workshop', 'News')),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  "studentName" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  position TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  "photoPath" TEXT,
  "graduationYear" INTEGER,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cdc_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own profile" ON students FOR UPDATE USING (true);

CREATE POLICY "Allow public read companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow insert companies" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update companies" ON companies FOR UPDATE USING (true);

CREATE POLICY "Allow public read jobs" ON internship_jobs FOR SELECT USING (true);
CREATE POLICY "Allow insert jobs" ON internship_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update jobs" ON internship_jobs FOR UPDATE USING (true);

CREATE POLICY "Allow read applications" ON job_applications FOR SELECT USING (true);
CREATE POLICY "Allow insert applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update applications" ON job_applications FOR UPDATE USING (true);

CREATE POLICY "Allow public read statistics" ON cdc_statistics FOR SELECT USING (true);
CREATE POLICY "Allow update statistics" ON cdc_statistics FOR UPDATE USING (true);
CREATE POLICY "Allow insert statistics" ON cdc_statistics FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read news" ON news_events FOR SELECT USING (true);
CREATE POLICY "Allow insert news" ON news_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update news" ON news_events FOR UPDATE USING (true);

CREATE POLICY "Allow public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update testimonials" ON testimonials FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX idx_students_nim ON students(nim);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_eligible ON students("isEligible");
CREATE INDEX idx_jobs_company ON internship_jobs("companyId");
CREATE INDEX idx_jobs_active ON internship_jobs("isActive");
CREATE INDEX idx_jobs_closing ON internship_jobs("closingDate");
CREATE INDEX idx_applications_student ON job_applications("studentId");
CREATE INDEX idx_applications_job ON job_applications("jobId");
CREATE INDEX idx_applications_status ON job_applications(status);

-- Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for students table
DROP TRIGGER IF EXISTS update_students_timestamp ON students;
CREATE TRIGGER update_students_timestamp
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert initial CDC statistics
INSERT INTO cdc_statistics (id, "totalAlumniPlaced", "totalCompanies", "placementRate", "majorEligibleData")
VALUES (
  'stat_1',
  250,
  50,
  85.5,
  '{
    "Teknik Informatika": {"eligible": 85, "total": 100},
    "Sistem Informasi": {"eligible": 78, "total": 95},
    "Manajemen": {"eligible": 72, "total": 90},
    "Akuntansi": {"eligible": 80, "total": 88}
  }'::jsonb
);

-- Insert sample companies
INSERT INTO companies (id, name, "logoPath", "industrySector", description, "websiteUrl", location)
VALUES
  ('comp_1', 'Tech Innovators Indonesia', 'https://via.placeholder.com/150', 'Technology', 'Leading technology company specializing in software development and digital transformation', 'https://techinnovators.id', 'Jakarta'),
  ('comp_2', 'Global Finance Corp', 'https://via.placeholder.com/150', 'Finance', 'International financial services provider with focus on digital banking', 'https://globalfinance.com', 'Surabaya'),
  ('comp_3', 'Creative Digital Agency', 'https://via.placeholder.com/150', 'Marketing', 'Award-winning digital marketing and creative agency', 'https://creativedigital.id', 'Bandung'),
  ('comp_4', 'Smart Solutions Ltd', 'https://via.placeholder.com/150', 'Technology', 'Enterprise software solutions and consulting services', 'https://smartsolutions.co.id', 'Jakarta'),
  ('comp_5', 'Eco Business Group', 'https://via.placeholder.com/150', 'Sustainability', 'Sustainable business consulting and green technology', 'https://ecobusiness.id', 'Yogyakarta');

-- Insert sample internship jobs
INSERT INTO internship_jobs (id, "companyId", position, "locationType", tag, description, requirements, "closingDate", salary)
VALUES
  ('job_1', 'comp_1', 'Software Engineer Intern', 'Hybrid', 'Berbayar', 'Join our development team to build cutting-edge web applications using modern technologies.', 'Currently enrolled in Computer Science or related field. Knowledge of JavaScript, React, and Node.js preferred.', '2025-12-31', 'Rp 4.000.000 - Rp 5.000.000'),
  ('job_2', 'comp_2', 'Financial Analyst Intern', 'WFO', 'Rekomendasi CDC', 'Work with our finance team to analyze market trends and prepare financial reports.', 'Accounting or Finance major. Strong analytical skills and proficiency in Excel required.', '2025-11-30', 'Rp 3.500.000'),
  ('job_3', 'comp_3', 'Digital Marketing Intern', 'WFH', 'Remote', 'Create engaging content and manage social media campaigns for our clients.', 'Marketing or Communications major. Experience with social media platforms and content creation.', '2025-12-15', 'Rp 3.000.000'),
  ('job_4', 'comp_1', 'UI/UX Designer Intern', 'Hybrid', 'Berbayar', 'Design intuitive and beautiful user interfaces for web and mobile applications.', 'Design or related field. Proficiency in Figma, Adobe XD, or similar tools.', '2025-12-31', 'Rp 3.500.000 - Rp 4.500.000'),
  ('job_5', 'comp_4', 'Data Analyst Intern', 'WFO', 'Rekomendasi CDC', 'Analyze business data and create insights to drive decision-making.', 'Information Systems or Statistics major. Knowledge of SQL and data visualization tools.', '2025-11-15', 'Rp 4.000.000'),
  ('job_6', 'comp_5', 'Business Development Intern', 'Hybrid', 'Berbayar', 'Support our business development team in identifying new opportunities and partnerships.', 'Business or Management major. Strong communication and presentation skills.', '2025-12-20', 'Rp 3.500.000');

-- Insert sample testimonials
INSERT INTO testimonials (id, "studentName", "companyName", position, testimonial, "photoPath", "graduationYear")
VALUES
  ('test_1', 'Budi Santoso', 'Tech Innovators Indonesia', 'Software Engineer', 'CDC membantu saya menemukan kesempatan magang yang sempurna. Sekarang saya bekerja full-time di perusahaan impian saya!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 2023),
  ('test_2', 'Siti Rahayu', 'Global Finance Corp', 'Financial Analyst', 'Program bimbingan karier dari CDC sangat membantu dalam mempersiapkan diri untuk dunia kerja profesional.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 2024),
  ('test_3', 'Ahmad Wijaya', 'Creative Digital Agency', 'Digital Marketing Specialist', 'Melalui CDC, saya mendapat pelatihan workshop yang sangat bermanfaat dan membuka peluang karier di industri kreatif.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 2023);

-- Insert sample news/events
INSERT INTO news_events (id, title, content, "eventDate", "imagePath", category)
VALUES
  ('news_1', 'Job Fair Cakrawala University 2025', 'Bergabunglah dengan Job Fair terbesar tahun ini! Lebih dari 50 perusahaan terkemuka akan hadir.', '2025-08-15 09:00:00', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Job Fair'),
  ('news_2', 'Workshop: Resume Writing & Interview Skills', 'Tingkatkan kemampuan Anda dalam menulis CV dan menghadapi interview dengan para profesional.', '2025-07-20 14:00:00', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Workshop'),
  ('news_3', 'Seminar: Career Path in Technology Industry', 'Pelajari berbagai jalur karier di industri teknologi dari para praktisi berpengalaman.', '2025-07-10 13:00:00', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'Seminar');
