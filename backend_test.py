#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for CDC Cakrawala University
Tests all public, authentication, and protected endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "http://localhost:3000/api"

class CDCAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.auth_token = None
        self.test_student_data = {
            "nim": "2024001001",
            "fullName": "Maria Sari Dewi",
            "email": "maria.sari@student.cakrawala.ac.id",
            "password": "SecurePass123!",
            "major": "Teknik Informatika"
        }
        self.results = {
            "passed": 0,
            "failed": 0,
            "tests": []
        }

    def log_test(self, test_name, status, message="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_sample"] = str(response_data)[:200] + "..." if len(str(response_data)) > 200 else str(response_data)
        
        self.results["tests"].append(result)
        if status == "PASS":
            self.results["passed"] += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.results["failed"] += 1
            print(f"❌ {test_name}: {message}")

    def test_public_endpoints(self):
        """Test all public endpoints that don't require authentication"""
        print("\n=== TESTING PUBLIC ENDPOINTS ===")
        
        # Test GET /api/statistics
        try:
            response = self.session.get(f"{self.base_url}/statistics")
            if response.status_code == 200:
                data = response.json()
                if 'totalAlumniPlaced' in data and 'totalCompanies' in data:
                    self.log_test("GET /api/statistics", "PASS", "Statistics endpoint working correctly", data)
                else:
                    self.log_test("GET /api/statistics", "FAIL", "Missing required fields in statistics response")
            else:
                self.log_test("GET /api/statistics", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/statistics", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/jobs (all jobs)
        try:
            response = self.session.get(f"{self.base_url}/jobs")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if jobs have required fields and company data
                    job = data[0]
                    if 'id' in job and 'position' in job and 'companies' in job:
                        self.log_test("GET /api/jobs", "PASS", f"Jobs endpoint working, returned {len(data)} jobs", {"count": len(data), "sample": job})
                    else:
                        self.log_test("GET /api/jobs", "FAIL", "Jobs missing required fields or company data")
                else:
                    self.log_test("GET /api/jobs", "FAIL", "No jobs returned or invalid format")
            else:
                self.log_test("GET /api/jobs", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/jobs", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/jobs with filters
        try:
            # Test search filter
            response = self.session.get(f"{self.base_url}/jobs?search=Software")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/jobs?search=Software", "PASS", f"Search filter working, returned {len(data)} jobs")
            else:
                self.log_test("GET /api/jobs?search=Software", "FAIL", f"HTTP {response.status_code}")

            # Test locationType filter
            response = self.session.get(f"{self.base_url}/jobs?locationType=Hybrid")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/jobs?locationType=Hybrid", "PASS", f"Location filter working, returned {len(data)} jobs")
            else:
                self.log_test("GET /api/jobs?locationType=Hybrid", "FAIL", f"HTTP {response.status_code}")

            # Test tag filter
            response = self.session.get(f"{self.base_url}/jobs?tag=Berbayar")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/jobs?tag=Berbayar", "PASS", f"Tag filter working, returned {len(data)} jobs")
            else:
                self.log_test("GET /api/jobs?tag=Berbayar", "FAIL", f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/jobs filters", "FAIL", f"Filter tests failed: {str(e)}")

        # Test GET /api/jobs/latest
        try:
            response = self.session.get(f"{self.base_url}/jobs/latest")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) <= 6:
                    self.log_test("GET /api/jobs/latest", "PASS", f"Latest jobs endpoint working, returned {len(data)} jobs")
                else:
                    self.log_test("GET /api/jobs/latest", "FAIL", f"Expected max 6 jobs, got {len(data) if isinstance(data, list) else 'invalid format'}")
            else:
                self.log_test("GET /api/jobs/latest", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/jobs/latest", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/jobs/{jobId} - Get specific job
        try:
            # First get a job ID from the jobs list
            response = self.session.get(f"{self.base_url}/jobs")
            if response.status_code == 200:
                jobs = response.json()
                if jobs and len(jobs) > 0:
                    job_id = jobs[0]['id']
                    response = self.session.get(f"{self.base_url}/jobs/{job_id}")
                    if response.status_code == 200:
                        job_data = response.json()
                        if 'id' in job_data and 'companies' in job_data:
                            self.log_test("GET /api/jobs/{jobId}", "PASS", f"Single job endpoint working for job {job_id}")
                        else:
                            self.log_test("GET /api/jobs/{jobId}", "FAIL", "Job data missing required fields")
                    else:
                        self.log_test("GET /api/jobs/{jobId}", "FAIL", f"HTTP {response.status_code}: {response.text}")
                else:
                    self.log_test("GET /api/jobs/{jobId}", "FAIL", "No jobs available to test with")
        except Exception as e:
            self.log_test("GET /api/jobs/{jobId}", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/companies
        try:
            response = self.session.get(f"{self.base_url}/companies")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    company = data[0]
                    if 'id' in company and 'name' in company:
                        self.log_test("GET /api/companies", "PASS", f"Companies endpoint working, returned {len(data)} companies")
                    else:
                        self.log_test("GET /api/companies", "FAIL", "Companies missing required fields")
                else:
                    self.log_test("GET /api/companies", "FAIL", "No companies returned or invalid format")
            else:
                self.log_test("GET /api/companies", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/companies", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/companies/{companyId}
        try:
            # First get a company ID
            response = self.session.get(f"{self.base_url}/companies")
            if response.status_code == 200:
                companies = response.json()
                if companies and len(companies) > 0:
                    company_id = companies[0]['id']
                    response = self.session.get(f"{self.base_url}/companies/{company_id}")
                    if response.status_code == 200:
                        company_data = response.json()
                        if 'id' in company_data and 'name' in company_data:
                            self.log_test("GET /api/companies/{companyId}", "PASS", f"Single company endpoint working for company {company_id}")
                        else:
                            self.log_test("GET /api/companies/{companyId}", "FAIL", "Company data missing required fields")
                    else:
                        self.log_test("GET /api/companies/{companyId}", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/companies/{companyId}", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/testimonials
        try:
            response = self.session.get(f"{self.base_url}/testimonials")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/testimonials", "PASS", f"Testimonials endpoint working, returned {len(data)} testimonials")
                else:
                    self.log_test("GET /api/testimonials", "FAIL", "Invalid testimonials format")
            else:
                self.log_test("GET /api/testimonials", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/testimonials", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/news
        try:
            response = self.session.get(f"{self.base_url}/news")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/news", "PASS", f"News endpoint working, returned {len(data)} news items")
                else:
                    self.log_test("GET /api/news", "FAIL", "Invalid news format")
            else:
                self.log_test("GET /api/news", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/news", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/news with category filter
        try:
            response = self.session.get(f"{self.base_url}/news?category=Workshop")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET /api/news?category=Workshop", "PASS", f"News category filter working, returned {len(data)} items")
            else:
                self.log_test("GET /api/news?category=Workshop", "FAIL", f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/news category filter", "FAIL", f"Request failed: {str(e)}")

    def test_authentication_endpoints(self):
        """Test authentication endpoints"""
        print("\n=== TESTING AUTHENTICATION ENDPOINTS ===")
        
        # Test POST /api/auth/register
        try:
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=self.test_student_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'token' in data and 'student' in data:
                    self.auth_token = data['token']
                    student = data['student']
                    if student['nim'] == self.test_student_data['nim'] and student['email'] == self.test_student_data['email']:
                        self.log_test("POST /api/auth/register", "PASS", "Student registration successful, token received")
                    else:
                        self.log_test("POST /api/auth/register", "FAIL", "Student data mismatch in response")
                else:
                    self.log_test("POST /api/auth/register", "FAIL", "Missing token or student data in response")
            elif response.status_code == 400:
                # Student might already exist, try with different data
                modified_data = self.test_student_data.copy()
                modified_data['nim'] = "2024001002"
                modified_data['email'] = "maria.sari2@student.cakrawala.ac.id"
                
                response = self.session.post(
                    f"{self.base_url}/auth/register",
                    json=modified_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'token' in data:
                        self.auth_token = data['token']
                        self.test_student_data = modified_data  # Update for future tests
                        self.log_test("POST /api/auth/register", "PASS", "Student registration successful with modified data")
                    else:
                        self.log_test("POST /api/auth/register", "FAIL", "Missing token in response")
                else:
                    self.log_test("POST /api/auth/register", "FAIL", f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("POST /api/auth/register", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/auth/register", "FAIL", f"Request failed: {str(e)}")

        # Test POST /api/auth/login
        try:
            login_data = {
                "email": self.test_student_data['email'],
                "password": self.test_student_data['password']
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'token' in data and 'student' in data:
                    self.auth_token = data['token']  # Update token
                    self.log_test("POST /api/auth/login", "PASS", "Student login successful, token received")
                else:
                    self.log_test("POST /api/auth/login", "FAIL", "Missing token or student data in response")
            else:
                self.log_test("POST /api/auth/login", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST /api/auth/login", "FAIL", f"Request failed: {str(e)}")

        # Test login with invalid credentials
        try:
            invalid_login = {
                "email": "invalid@email.com",
                "password": "wrongpassword"
            }
            
            response = self.session.post(
                f"{self.base_url}/auth/login",
                json=invalid_login,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 401:
                self.log_test("POST /api/auth/login (invalid)", "PASS", "Invalid credentials correctly rejected with 401")
            else:
                self.log_test("POST /api/auth/login (invalid)", "FAIL", f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/auth/login (invalid)", "FAIL", f"Request failed: {str(e)}")

    def test_protected_endpoints(self):
        """Test protected endpoints that require authentication"""
        print("\n=== TESTING PROTECTED ENDPOINTS ===")
        
        if not self.auth_token:
            self.log_test("Protected endpoints", "FAIL", "No auth token available - authentication tests must have failed")
            return

        headers = {
            'Authorization': f'Bearer {self.auth_token}',
            'Content-Type': 'application/json'
        }

        # Test GET /api/students/profile
        try:
            response = self.session.get(f"{self.base_url}/students/profile", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'nim' in data and 'email' in data:
                    if 'password' not in data:  # Password should be removed
                        self.log_test("GET /api/students/profile", "PASS", "Student profile retrieved successfully, password excluded")
                    else:
                        self.log_test("GET /api/students/profile", "FAIL", "Password field present in response (security issue)")
                else:
                    self.log_test("GET /api/students/profile", "FAIL", "Missing required fields in profile response")
            else:
                self.log_test("GET /api/students/profile", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/students/profile", "FAIL", f"Request failed: {str(e)}")

        # Test PUT /api/students/profile
        try:
            profile_update = {
                "currentSks": 120,
                "gpa": 3.50,
                "cvPath": "/uploads/cv/maria_cv.pdf",
                "portfolioPath": "/uploads/portfolio/maria_portfolio.pdf"
            }
            
            response = self.session.put(
                f"{self.base_url}/students/profile",
                json=profile_update,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('currentSks') == 120 and data.get('gpa') == 3.50:
                    # Check eligibility calculation (SKS >= 100 && GPA >= 2.75)
                    if data.get('isEligible') == True:
                        self.log_test("PUT /api/students/profile", "PASS", "Profile updated successfully, eligibility calculated correctly")
                    else:
                        self.log_test("PUT /api/students/profile", "FAIL", "Eligibility calculation incorrect")
                else:
                    self.log_test("PUT /api/students/profile", "FAIL", "Profile update data mismatch")
            else:
                self.log_test("PUT /api/students/profile", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("PUT /api/students/profile", "FAIL", f"Request failed: {str(e)}")

        # Test GET /api/students/applications
        try:
            response = self.session.get(f"{self.base_url}/students/applications", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("GET /api/students/applications", "PASS", f"Applications retrieved successfully, {len(data)} applications found")
                else:
                    self.log_test("GET /api/students/applications", "FAIL", "Invalid applications format")
            else:
                self.log_test("GET /api/students/applications", "FAIL", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("GET /api/students/applications", "FAIL", f"Request failed: {str(e)}")

        # Test POST /api/jobs/apply
        try:
            # First get a job ID to apply for
            response = self.session.get(f"{self.base_url}/jobs")
            if response.status_code == 200:
                jobs = response.json()
                if jobs and len(jobs) > 0:
                    job_id = jobs[0]['id']
                    
                    # Apply for the job
                    apply_data = {"jobId": job_id}
                    response = self.session.post(
                        f"{self.base_url}/jobs/apply",
                        json=apply_data,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        if 'message' in data and 'application' in data:
                            self.log_test("POST /api/jobs/apply", "PASS", f"Job application successful for job {job_id}")
                            
                            # Test applying for the same job again (should fail)
                            response = self.session.post(
                                f"{self.base_url}/jobs/apply",
                                json=apply_data,
                                headers=headers
                            )
                            
                            if response.status_code == 400:
                                self.log_test("POST /api/jobs/apply (duplicate)", "PASS", "Duplicate application correctly rejected")
                            else:
                                self.log_test("POST /api/jobs/apply (duplicate)", "FAIL", f"Expected 400 for duplicate, got {response.status_code}")
                        else:
                            self.log_test("POST /api/jobs/apply", "FAIL", "Missing message or application data in response")
                    else:
                        self.log_test("POST /api/jobs/apply", "FAIL", f"HTTP {response.status_code}: {response.text}")
                else:
                    self.log_test("POST /api/jobs/apply", "FAIL", "No jobs available to apply for")
        except Exception as e:
            self.log_test("POST /api/jobs/apply", "FAIL", f"Request failed: {str(e)}")

        # Test protected endpoints without authentication
        try:
            response = self.session.get(f"{self.base_url}/students/profile")  # No auth header
            
            if response.status_code == 401:
                self.log_test("Protected endpoint without auth", "PASS", "Unauthorized access correctly rejected with 401")
            else:
                self.log_test("Protected endpoint without auth", "FAIL", f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Protected endpoint without auth", "FAIL", f"Request failed: {str(e)}")

    def test_error_cases(self):
        """Test various error scenarios"""
        print("\n=== TESTING ERROR CASES ===")
        
        # Test non-existent job
        try:
            response = self.session.get(f"{self.base_url}/jobs/nonexistent_job_id")
            if response.status_code == 404:
                self.log_test("GET /api/jobs/nonexistent", "PASS", "Non-existent job correctly returns 404")
            else:
                self.log_test("GET /api/jobs/nonexistent", "FAIL", f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/jobs/nonexistent", "FAIL", f"Request failed: {str(e)}")

        # Test non-existent company
        try:
            response = self.session.get(f"{self.base_url}/companies/nonexistent_company_id")
            if response.status_code == 404:
                self.log_test("GET /api/companies/nonexistent", "PASS", "Non-existent company correctly returns 404")
            else:
                self.log_test("GET /api/companies/nonexistent", "FAIL", f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/companies/nonexistent", "FAIL", f"Request failed: {str(e)}")

        # Test registration with missing fields
        try:
            incomplete_data = {"nim": "123", "email": "test@test.com"}  # Missing required fields
            response = self.session.post(
                f"{self.base_url}/auth/register",
                json=incomplete_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 400:
                self.log_test("POST /api/auth/register (incomplete)", "PASS", "Incomplete registration data correctly rejected with 400")
            else:
                self.log_test("POST /api/auth/register (incomplete)", "FAIL", f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("POST /api/auth/register (incomplete)", "FAIL", f"Request failed: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting CDC Cakrawala University Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        self.test_public_endpoints()
        self.test_authentication_endpoints()
        self.test_protected_endpoints()
        self.test_error_cases()
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📈 Success Rate: {(self.results['passed'] / (self.results['passed'] + self.results['failed']) * 100):.1f}%")
        
        if self.results['failed'] > 0:
            print("\n🔍 FAILED TESTS:")
            for test in self.results['tests']:
                if test['status'] == 'FAIL':
                    print(f"   • {test['test']}: {test['message']}")
        
        return self.results

if __name__ == "__main__":
    tester = CDCAPITester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results['failed'] > 0:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)