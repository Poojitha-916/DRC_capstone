  <script>
    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
      // Set default role and load scholar profile
      currentRole = 'scholar';
      roleLabel.textContent = '(SCHOLAR)';
      loadScholarProfile();
      renderSidebarForRole();
      
      // Set up sidebar navigation
      setupSidebarNavigation();
      
      // Set up profile dropdown
      setupProfileDropdown();
      
      // Set up modal close button - FROM SECOND CODE
      document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('applicationModal').classList.remove('active');
      });
      
      // Close modal when clicking outside - FROM SECOND CODE
      document.getElementById('applicationModal').addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
        }
      });
    });

    // Global variables
    let currentRole = 'scholar';
    const roleLabel = document.getElementById('roleLabel');
    const profileIcon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('profileDropdown');
    const sidebar = document.querySelector('.sidebar');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const mainContent = document.getElementById('mainContent');

    // Toggle sidebar
    function toggleSidebar() {
      sidebar.classList.toggle('collapsed');
    }

    // Render sidebar based on current role
    function renderSidebarForRole() {
      if (currentRole === 'scholar') {
        sidebarMenu.innerHTML = `
          <li data-page="profile">Profile</li>
          <li data-page="research">Research Progress</li>
          <li data-page="fee">Fee Details</li>
          <li class="red-button" data-page="applications">Applications</li>
          <li data-page="academic">Academic Progress</li>
          <li class="red-button" data-page="dochub">Doc-Hub</li>
          <li data-page="notice">Notice Board</li>
          <li data-page="repo">Digital Repository</li>
          <li data-page="support">Support</li>
        `;
      } else if (currentRole === 'rac') {
        sidebarMenu.innerHTML = `
          <li data-page="dashboard">Dashboard</li>
          <li data-page="rac_reviews">RAC Reviews</li>
          <li data-page="notice">Notice Board</li>
          <li data-page="profile">Profile</li>
          <li data-page="support">Support</li>
        `;
      } else if (currentRole === 'supervisor') {
        sidebarMenu.innerHTML = `
          <li data-page="dashboard">Dashboard</li>
          <li data-page="rac_reports">RAC Reports</li>
          <li data-page="notice">Notice Board</li>
          <li data-page="profile">Profile</li>
          <li data-page="biometric">Biometric Report</li>
          <li data-page="support">Support</li>
          <li data-page="lpc">LPC</li>
        `;
      }
      
      // Re-attach event listeners after updating sidebar
      setupSidebarNavigation();
    }

    // Setup sidebar navigation
    function setupSidebarNavigation() {
      const sidebarItems = document.querySelectorAll('.sidebar li');
      sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
          // Remove active class from all items
          sidebarItems.forEach(i => i.classList.remove('active'));
          // Add active class to clicked item
          this.classList.add('active');
          
          const page = this.getAttribute('data-page');
          handlePageNavigation(page);
        });
      });
    }

    // Handle page navigation based on role
    function handlePageNavigation(page) {
      if (currentRole === 'scholar') {
        switch(page) {
          case 'profile':
            loadScholarProfile();
            break;
          case 'research':
            loadResearchProgress();
            break;
          case 'fee':
            loadFeeDetails();
            break;
          case 'academic':
            loadAcademicProgress();
            break;
          case 'notice':
            loadNoticeBoard();
            break;
          case 'repo':
            loadDigitalRepository();
            break;
          case 'support':
            loadSupport();
            break;
          case 'applications':
            loadApplicationsPage();
            break;
          case 'dochub':
            loadDocHub();
            break;
          default:
            loadScholarProfile();
        }
      } else if (currentRole === 'rac') {
        switch(page) {
          case 'dashboard':
            loadRacDashboard();
            break;
          case 'rac_reviews':
            loadRacReviews();
            break;
          case 'notice':
            loadNoticeBoard();
            break;
          case 'profile':
            loadRacProfile();
            break;
          case 'support':
            loadSupport();
            break;
          default:
            loadRacDashboard();
        }
      } else if (currentRole === 'supervisor') {
        switch(page) {
          case 'dashboard':
            loadSupervisorDashboard();
            break;
          case 'rac_reports':
            loadSupervisorRacReports();
            break;
          case 'notice':
            loadNoticeBoard();
            break;
          case 'profile':
            loadSupervisorProfile();
            break;
          case 'biometric':
            loadBiometricReport();
            break;
          case 'support':
            loadSupport();
            break;
          case 'lpc':
            loadLPC();
            break;
          default:
            loadSupervisorDashboard();
        }
      }
    }

    // Setup profile dropdown
    function setupProfileDropdown() {
      profileIcon.addEventListener('click', function(e) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
      });

      document.addEventListener('click', function() {
        dropdown.style.display = 'none';
      });

      dropdown.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const role = this.getAttribute('data-role');
          if (role === 'logout') {
            currentRole = 'guest';
            roleLabel.textContent = '(Not logged in)';
            mainContent.innerHTML = '<div style="padding:20px;text-align:center;">You have been logged out.</div>';
            sidebarMenu.innerHTML = '';
          } else {
            currentRole = role;
            roleLabel.textContent = `(${role.toUpperCase()})`;
            renderSidebarForRole();
            
            // Load default page for the role
            if (role === 'scholar') {
              loadScholarProfile();
            } else if (role === 'supervisor') {
              loadSupervisorDashboard();
            } else if (role === 'rac') {
              loadRacDashboard();
            }
          }
          dropdown.style.display = 'none';
          e.stopPropagation();
        });
      });
    }

    // ==================== SCHOLAR UI PAGES ====================

    // Load scholar profile
    function loadScholarProfile() {
      mainContent.innerHTML = `
        <!-- TOP PROFILE PANEL -->
        <div class="profile-card">
          <div class="avatar-col">
            <div class="avatar-placeholder"></div>
            <a href="#" class="change-photo">✎ Change Profile Photo</a>
          </div>

          <div class="details-col">
            <table class="info-table">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Scholar</th>
                  <th>Supervisor</th>
                  <th>RAC Member-1</th>
                  <th>RAC Member-2</th>
                  <th>HOD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="row-title">Name</td>
                  <td>Thirupathi XYZ</td>
                  <td>Supervisor Name</td>
                  <td>RAC Member 1</td>
                  <td>RAC Member 2</td>
                  <td>HOD Name</td>
                </tr>
                <tr>
                  <td class="row-title">ID</td>
                  <td colspan="5">1234567890</td>
                </tr>
                <tr>
                  <td class="row-title">Location</td>
                  <td colspan="5">HYD/GST/DEPARTMENT NAME</td>
                </tr>
                <tr>
                  <td class="row-title">Email</td>
                  <td colspan="5">scholar@example.com</td>
                </tr>
                <tr>
                  <td class="row-title">Phone</td>
                  <td colspan="5">9876543210</td>
                </tr>
                <tr>
                  <td class="row-title">Batch/Program Status</td>
                  <td colspan="4">2024-2025/Full Time</td>
                  <td><span class="pill">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PERSONAL DETAILS -->
        <div class="personal-card">
          <div class="personal-header">
            <h3>Personal Details</h3>
            <button class="edit-btn">Edit Info</button>
          </div>

          <div class="personal-grid">
            <div class="pd-row">
              <div class="pd-label">Application Number:</div><div class="pd-value">APP123456</div>
              <div class="pd-label">Date of Birth:</div><div class="pd-value">15-08-1995</div>
              <div class="pd-label">Father Name:</div><div class="pd-value">Father XYZ</div>
            </div>

            <div class="pd-row">
              <div class="pd-label">Parent Mobile:</div><div class="pd-value">9876543210</div>
              <div class="pd-label">Student Mobile:</div><div class="pd-value">9876543211</div>
              <div class="pd-label">Student Emailid:</div><div class="pd-value">scholar@example.com</div>
            </div>

            <div class="pd-row">
              <div class="pd-label">Aadhaar No:</div><div class="pd-value">XXXX-XXXX-1234</div>
              <div class="pd-label">Nationality:</div><div class="pd-value">Indian</div>
              <div class="pd-label">Address:</div><div class="pd-value">Hyderabad, Telangana</div>
            </div>

            <div class="pd-row">
              <div class="pd-label">State:</div><div class="pd-value">Telangana</div>
              <div class="pd-label">Pincode:</div><div class="pd-value">500032</div>
              <div class="pd-label">Tenth Institute Name:</div><div class="pd-value">ABC School</div>
            </div>

            <div class="pd-row">
              <div class="pd-label">Tenth Board:</div><div class="pd-value">State Board</div>
              <div class="pd-label">Tenth Percentage/CGPA:</div><div class="pd-value">85%</div>
              <div class="pd-label">Tenth Year of Passing:</div><div class="pd-value">2011</div>
            </div>

            <div class="pd-row">
              <div class="pd-label">Inter Institute:</div><div class="pd-value">XYZ College</div>
              <div class="pd-label">Inter Board Name:</div><div class="pd-value">State Board</div>
              <div class="pd-label">Inter Percentage/CGPA:</div><div class="pd-value">88%</div>
            </div>
          </div>
        </div>
      `;
    }

    // Load research progress
    function loadResearchProgress() {
      mainContent.innerHTML = `
        <div class="research-container">
          <div class="research-title">Research Progress</div>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Completed RAC Reviews</div>
                <div class="stat-value">3</div>
              </div>
              <div class="stat-icon" style="color:#1e8b57;">≡</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Pending RAC Report at Scholar</div>
                <div class="stat-value">1</div>
              </div>
              <div class="stat-icon" style="color:#c94141;">●</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Pending RAC Report at Supervisor</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat-icon" style="color:#f5a623;">↗</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Total RAC Reports</div>
                <div class="stat-value">4</div>
              </div>
              <div class="stat-icon" style="color:#8e44ad;">👥</div>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <button style="background:#1e8b57; color:#fff; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(30, 139, 87, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">Export</button>
              <input placeholder="Search:" style="padding:10px 15px; border:1px solid #ddd; border-radius:8px; width: 250px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Stage</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar id</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar name</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Status</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Submitted Date</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">December 2023</td>
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">1234567890</td>
                  <td style="padding:14px; border:1px solid #eee;">Thirupathi XYZ</td>
                  <td style="padding:14px; border:1px solid #eee;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:13px; font-weight:600;">Submitted</span></td>
                  <td style="padding:14px; border:1px solid #eee;">Feb. 14, 2024, 12:18 p.m.</td>
                  <td style="padding:14px; border:1px solid #eee; color:#2f7bd9;">Satisfactory</td>
                </tr>

                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">December 2024</td>
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">1234567890</td>
                  <td style="padding:14px; border:1px solid #eee;">Thirupathi XYZ</td>
                  <td style="padding:14px; border:1px solid #eee;"><span style="background:#c0392b;color:#fff;padding:6px 12px;border-radius:20px;font-size:13px; font-weight:600;">Absent</span></td>
                  <td style="padding:14px; border:1px solid #eee;">-</td>
                  <td style="padding:14px; border:1px solid #eee; color:#2f7bd9;">Absent</td>
                </tr>

                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">July 2025</td>
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">1234567890</td>
                  <td style="padding:14px; border:1px solid #eee;">Thirupathi XYZ</td>
                  <td style="padding:14px; border:1px solid #eee;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:13px; font-weight:600;">Submitted</span></td>
                  <td style="padding:14px; border:1px solid #eee;">Sept. 9, 2025, 3:07 p.m.</td>
                  <td style="padding:14px; border:1px solid #eee; color:#2f7bd9;">Satisfactory</td>
                </tr>

                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">June 2024</td>
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">1234567890</td>
                  <td style="padding:14px; border:1px solid #eee;">Thirupathi XYZ</td>
                  <td style="padding:14px; border:1px solid #eee;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:13px; font-weight:600;">Submitted</span></td>
                  <td style="padding:14px; border:1px solid #eee;">July 10, 2024, 4:32 a.m.</td>
                  <td style="padding:14px; border:1px solid #eee; color:#2f7bd9;">Satisfactory</td>
                </tr>
              </tbody>
            </table>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
              <div style="color:#777;">Showing 1 to 4 of 4 entries</div>
              <div style="display:flex; gap:10px; align-items:center;">
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Previous</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #1e8b57; background:#1e8b57; color:#fff; font-weight:600;">1</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Next</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Load fee details
    function loadFeeDetails() {
      mainContent.innerHTML = `
        <div class="fee-container">
          <div class="fee-title">Fee Details</div>
          
          <h3 style="margin:15px 0; font-weight:600; color: #0b6a55;">Fee Structure (without scholarship)</h3>
          <div style="border:1px solid #e6e6e6; background:#fff; padding:20px; border-radius:10px; margin-bottom:25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden;">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Academic Year</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">1st Year Fee</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">2nd Year Fee</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">3rd Year Fee</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">4th Year Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">2020-2021 Phase II (August 2021 batch)</td>
                  <td style="padding:14px; border:1px solid #eee;">40,000</td>
                  <td style="padding:14px; border:1px solid #eee;">40,000</td>
                  <td style="padding:14px; border:1px solid #eee;">40,000</td>
                  <td style="padding:14px; border:1px solid #eee;">40,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style="margin:15px 0; font-weight:600; color: #0b6a55;">Fee Details <span style="font-weight:400; font-size:14px;">(Kindly verify your fee details with GITAM Payment Portal with the link: https://gpay.gitam.edu)</span></h3>
          <div style="border:1px solid #e6e6e6; background:#fff; padding:20px; border-radius:10px; margin-bottom:25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden;">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Arrears</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Hostel Arrears</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Annual fee</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Verify</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:18px; border:1px solid #eee; text-align:center;">0.0</td>
                  <td style="padding:18px; border:1px solid #eee; text-align:center;">0.0</td>
                  <td style="padding:18px; border:1px solid #eee; text-align:center;">40000</td>
                  <td style="padding:18px; border:1px solid #eee; text-align:center;"><button style="background:#1e8b57;color:#fff;border:none;padding:10px 15px;border-radius:8px;cursor:pointer; font-weight:600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(30, 139, 87, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">Verify</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style="margin:15px 0; font-weight:600; color: #0b6a55;">Payment history from 2nd Year</h3>
          <div style="border:1px solid #e6e6e6; background:#fff; padding:20px; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden;">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Transaction Id</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Transaction Date</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Bank Name</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Total Fee</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Payment Status</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">2024111205600000062658524822067376</td>
                  <td style="padding:14px; border:1px solid #eee;">Nov. 11, 2024, 8:05 a.m.</td>
                  <td style="padding:14px; border:1px solid #eee;">UBI</td>
                  <td style="padding:14px; border:1px solid #eee;">24000.0</td>
                  <td style="padding:14px; border:1px solid #eee; color: #27ae60; font-weight: 600;">Success</td>
                  <td style="padding:14px; border:1px solid #eee; text-align:center; font-size: 18px;">📄</td>
                </tr>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">20231012011040000919313399312497863</td>
                  <td style="padding:14px; border:1px solid #eee;">Oct. 12, 2023, 7:43 p.m.</td>
                  <td style="padding:14px; border:1px solid #eee;">UBI</td>
                  <td style="padding:14px; border:1px solid #eee;">24000.0</td>
                  <td style="padding:14px; border:1px solid #eee; color: #27ae60; font-weight: 600;">Success</td>
                  <td style="padding:14px; border:1px solid #eee; text-align:center; font-size: 18px;">📄</td>
                </tr>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee;">2023011211280010168023411472554</td>
                  <td style="padding:14px; border:1px solid #eee;">Jan. 12, 2023, 9:09 a.m.</td>
                  <td style="padding:14px; border:1px solid #eee;">INDIANBANK</td>
                  <td style="padding:14px; border:1px solid #eee;">24000.0</td>
                  <td style="padding:14px; border:1px solid #eee; color: #27ae60; font-weight: 600;">Success</td>
                  <td style="padding:14px; border:1px solid #eee; text-align:center; font-size: 18px;">📄</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // Load academic progress
    function loadAcademicProgress() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Academic Progress</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <h3 style="margin-bottom:20px; color: #0b6a55;">Course Work Completion Status</h3>
            <table style="width:100%; border-collapse:collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #ddd;">Course Code</th>
                  <th style="padding:12px; border:1px solid #ddd;">Course Name</th>
                  <th style="padding:12px; border:1px solid #ddd;">Credits</th>
                  <th style="padding:12px; border:1px solid #ddd;">Grade</th>
                  <th style="padding:12px; border:1px solid #ddd;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:12px; border:1px solid #ddd;">RSC101</td>
                  <td style="padding:12px; border:1px solid #ddd;">Research Methodology</td>
                  <td style="padding:12px; border:1px solid #ddd;">4</td>
                  <td style="padding:12px; border:1px solid #ddd;">A</td>
                  <td style="padding:12px; border:1px solid #ddd;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:12px; font-weight:600;">Completed</span></td>
                </tr>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:12px; border:1px solid #ddd;">RSC102</td>
                  <td style="padding:12px; border:1px solid #ddd;">Technical Writing</td>
                  <td style="padding:12px; border:1px solid #ddd;">3</td>
                  <td style="padding:12px; border:1px solid #ddd;">A+</td>
                  <td style="padding:12px; border:1px solid #ddd;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:12px; font-weight:600;">Completed</span></td>
                </tr>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:12px; border:1px solid #ddd;">RSC201</td>
                  <td style="padding:12px; border:1px solid #ddd;">Advanced Research Techniques</td>
                  <td style="padding:12px; border:1px solid #ddd;">4</td>
                  <td style="padding:12px; border:1px solid #ddd;">B+</td>
                  <td style="padding:12px; border:1px solid #ddd;"><span style="background:#27ae60;color:#fff;padding:6px 12px;border-radius:20px;font-size:12px; font-weight:600;">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // Load Doc-Hub
    function loadDocHub() {
      mainContent.innerHTML = `
        <div class="dochub-container">
          <div class="dochub-title">Doc-Hub</div>
          
          <div class="document-section">
            <div class="section-title">Personal Identification Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">🆔</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Aadhaar Card</div>
                    <div class="document-description">Government issued identification document with unique 12-digit number</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Uploaded: 15/08/2023</div>
                  <div class="verified-badge">Verified</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('aadhaar')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">💳</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">PAN Card</div>
                    <div class="document-description">Permanent Account Number card for financial transactions</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Uploaded: 20/08/2023</div>
                  <div class="verified-badge">Verified</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('pan')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📸</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Passport Photos</div>
                    <div class="document-description">Recent passport-sized photographs for official documents</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Uploaded: 10/08/2023</div>
                  <div class="verified-badge">Verified</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('passport-photos')">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div class="document-section">
            <div class="section-title">Academic Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">📊</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Grade Cards</div>
                    <div class="document-description">All semester grade cards and mark sheets from previous qualifications</div>
                  </div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('grade-cards')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">🎓</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Degree Certificates</div>
                    <div class="document-description">Bachelor's and Master's degree certificates and provisional certificates</div>
                  </div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('degree-certificates')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📜</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Transfer Certificate</div>
                    <div class="document-description">TC from previous institution with conduct and character details</div>
                  </div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('transfer-certificate')">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div class="document-section">
            <div class="section-title">Scholarship & Fee Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">💰</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Fee Payment Receipts</div>
                    <div class="document-description">All semester fee payment receipts and transaction records</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>All Semesters</div>
                  <div class="verified-badge">Complete</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('fee-receipts')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">🎫</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Scholarship Documents</div>
                    <div class="document-description">Scholarship application, approval letters and related documents</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Complete Set</div>
                  <div class="verified-badge">Approved</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('scholarship-documents')">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div class="document-section">
            <div class="section-title">Research Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">📄</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Research Publications</div>
                    <div class="document-description">Journal papers, conference proceedings, and research articles</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>3 Publications</div>
                  <div class="verified-badge">Updated</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('research-publications')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📝</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Research Articles</div>
                    <div class="document-description">Articles, reviews, and other written research contributions</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>5 Articles</div>
                  <div class="verified-badge">Updated</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('research-articles')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📈</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Research Progress Reports</div>
                    <div class="document-description">Regular research progress reports submitted to RAC and supervisor</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>All Reports</div>
                  <div class="verified-badge">Complete</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('research-progress-reports')">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div class="document-section">
            <div class="section-title">Application Process Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">📋</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Application Forms</div>
                    <div class="document-description">All submitted application forms for various processes</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Complete Set</div>
                  <div class="verified-badge">Archived</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('application-forms')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📑</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Admission Documents</div>
                    <div class="document-description">Original admission application and related documents</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Complete Set</div>
                  <div class="verified-badge">Archived</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('admission-documents')">Upload</button>
                </div>
              </div>
            </div>
          </div>

          <div class="document-section">
            <div class="section-title">Other Important Documents</div>
            <div class="document-cards">
              <div class="document-card">
                <div class="document-icon">🏥</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Medical Certificates</div>
                    <div class="document-description">Health certificates and medical examination reports</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Valid until 2025</div>
                  <div class="verified-badge">Verified</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('medical-certificates')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📧</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Contact Documents</div>
                    <div class="document-description">Address proof, contact details and emergency contact information</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Updated</div>
                  <div class="verified-badge">Current</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('contact-documents')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📚</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Thesis Documents</div>
                    <div class="document-description">Thesis proposal, drafts, and final submission documents</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>In Progress</div>
                  <div>Draft Stage</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('thesis-documents')">Upload</button>
                </div>
              </div>
              
              <div class="document-card">
                <div class="document-icon">📋</div>
                <div class="document-header">
                  <div>
                    <div class="document-name">Caste Certificate</div>
                    <div class="document-description">Caste certificate for reservation purposes (if applicable)</div>
                  </div>
                </div>
                <div class="document-meta">
                  <div>Uploaded: 12/08/2023</div>
                  <div class="verified-badge">Verified</div>
                </div>
                <div class="document-actions">
                  <button class="action-btn">View</button>
                  <button class="action-btn">Download</button>
                  <button class="upload-btn" onclick="uploadDocument('caste-certificate')">Upload</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Upload document function
    function uploadDocument(documentType) {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
      
      // Handle file selection
      fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
          // In a real application, you would upload the file to a server here
          // For this demo, we'll just show a success message
          alert(`Document "${file.name}" uploaded successfully for ${documentType}!`);
          
          // Update the document status
          updateDocumentStatus(documentType, file.name);
        }
      };
      
      // Trigger the file selection dialog
      fileInput.click();
    }

    // Update document status after upload
    function updateDocumentStatus(documentType, fileName) {
      // In a real application, you would update the UI to reflect the new upload
      // For this demo, we'll just log the action
      console.log(`Document ${documentType} updated with file: ${fileName}`);
    }

    // Load other scholar pages with placeholder content
    function loadApplicationsPage() {
      mainContent.innerHTML = `
        <div class="applications-container">
          <div class="applications-title">Applications</div>
          
          <div class="applications-options">
            <button class="application-option" id="applyButton" onclick="showApplySection()">Apply</button>
            <button class="application-option" id="trackButton" onclick="showTrackSection()">Track Your Application</button>
          </div>

          <div id="applySection" style="display: none;">
            <div class="dropdown-container">
              <div class="dropdown-box">Select Application Type ▼</div>
              <div class="dropdown-content">
                <button onclick="showSupervisorChangeForm()">Change of Supervisor</button>
                <button onclick="showPreTalkForm()">Apply for Pre-talk</button>
                <button onclick="showExtensionForm()">Extension of Ph.D Duration</button>
                <button onclick="showReRegistrationForm()">Ph.D Re-Registration</button>
              </div>
            </div>

            <div id="applicationForm" style="display: none;"></div>
          </div>

          <div id="trackSection" style="display: none;">
            <div class="tracking-container" id="trackingContainer">
              <!-- Application cards will be loaded here -->
            </div>
          </div>
        </div>
      `;
      
      // Load tracking section if it's displayed
      if (document.getElementById('trackSection').style.display !== 'none') {
        loadApplicationTracking();
      }
    }

    // Show applications options (restore buttons)
    function showApplicationsOptions() {
      document.getElementById('applySection').style.display = 'none';
      document.getElementById('trackSection').style.display = 'none';
      document.getElementById('applyButton').classList.remove('hidden');
      document.getElementById('trackButton').classList.remove('hidden');
    }

    // Show apply section
    function showApplySection() {
      document.getElementById('applySection').style.display = 'block';
      document.getElementById('trackSection').style.display = 'none';
      document.getElementById('applyButton').classList.add('hidden');
      document.getElementById('trackButton').classList.add('hidden');
    }

    // Show track section
    function showTrackSection() {
      document.getElementById('applySection').style.display = 'none';
      document.getElementById('trackSection').style.display = 'block';
      document.getElementById('applyButton').classList.add('hidden');
      document.getElementById('trackButton').classList.add('hidden');
      
      // Load application tracking cards
      loadApplicationTracking();
    }

    // Load application tracking cards - FROM SECOND CODE
    function loadApplicationTracking() {
      const trackingContainer = document.getElementById('trackingContainer');
      if (!trackingContainer) return;
      
      trackingContainer.innerHTML = `
        <div class="application-card">
          <div class="application-header">
            <div class="application-type">Change of Supervisor</div>
            <div class="application-submitted">Submitted on: Feb 15, 2024</div>
          </div>
          <div class="application-body">
            <div class="current-stage">
              <div class="stage-indicator completed"></div>
              <div class="stage-text">Completed - Approved by HOD</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill supervisor-change"></div>
              </div>
              <div class="progress-text">
                <span>Submitted</span>
                <span>100% Complete</span>
              </div>
            </div>
          </div>
          <div class="application-footer">
            <div class="status-badge completed">Completed</div>
            <button class="details-btn" onclick="showApplicationDetails('supervisor-change')">
              More Details <span>→</span>
            </button>
          </div>
        </div>

        <div class="application-card">
          <div class="application-header">
            <div class="application-type">Extension of Ph.D Duration</div>
            <div class="application-submitted">Submitted on: March 10, 2024</div>
          </div>
          <div class="application-body">
            <div class="current-stage">
              <div class="stage-indicator in-progress"></div>
              <div class="stage-text">Under Review - Currently at Supervisor</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill extension"></div>
              </div>
              <div class="progress-text">
                <span>Submitted</span>
                <span>30% Complete</span>
              </div>
            </div>
          </div>
          <div class="application-footer">
            <div class="status-badge in-progress">In Progress</div>
            <button class="details-btn" onclick="showApplicationDetails('extension')">
              More Details <span>→</span>
            </button>
          </div>
        </div>
      `;
    }

    // Show application details in modal - FROM SECOND CODE
    function showApplicationDetails(type) {
      const modal = document.getElementById('applicationModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalBody = document.getElementById('modalBody');
      
      if (type === 'supervisor-change') {
        modalTitle.textContent = 'Change of Supervisor Application';
        modalBody.innerHTML = `
          <div class="flow-diagram">
            <div class="flow-steps">
              <div class="flow-step">
                <div class="step-icon completed">1</div>
                <div class="step-label">Scholar</div>
                <div class="step-status">Submitted: Feb 15, 2024</div>
              </div>
              <div class="flow-step">
                <div class="step-icon completed">2</div>
                <div class="step-label">Supervisor</div>
                <div class="step-status">Approved: Feb 18, 2024</div>
              </div>
              <div class="flow-step">
                <div class="step-icon completed">3</div>
                <div class="step-label">DRC</div>
                <div class="step-status">Approved: Feb 22, 2024</div>
              </div>
              <div class="flow-step">
                <div class="step-icon completed">4</div>
                <div class="step-label">HOD</div>
                <div class="step-status">Approved: Feb 28, 2024</div>
              </div>
            </div>
          </div>
          
          <div class="documents-section">
            <div class="documents-title">Application Documents</div>
            <div class="documents-list">
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Supervisor Change Form</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Research Progress Report</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">New Supervisor CV</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Approval Letter</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
            <strong>Application Status:</strong> Completed and Approved<br>
            <strong>Final Decision:</strong> Supervisor change approved effective March 1, 2024
          </div>
        `;
      } else if (type === 'extension') {
        modalTitle.textContent = 'Extension of Ph.D Duration Application';
        modalBody.innerHTML = `
          <div class="flow-diagram">
            <div class="flow-steps">
              <div class="flow-step">
                <div class="step-icon completed">1</div>
                <div class="step-label">Scholar</div>
                <div class="step-status">Submitted: March 10, 2024</div>
              </div>
              <div class="flow-step">
                <div class="step-icon active">2</div>
                <div class="step-label">Supervisor</div>
                <div class="step-status">Under Review</div>
              </div>
              <div class="flow-step">
                <div class="step-icon">3</div>
                <div class="step-label">DRC</div>
                <div class="step-status">Pending</div>
              </div>
              <div class="flow-step">
                <div class="step-icon">4</div>
                <div class="step-label">HOD</div>
                <div class="step-status">Pending</div>
              </div>
            </div>
          </div>
          
          <div class="documents-section">
            <div class="documents-title">Application Documents</div>
            <div class="documents-list">
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Extension Request Form</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Research Progress Report</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Publication List</div>
              </div>
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-name">Timeline Extension Justification</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <strong>Application Status:</strong> Under Review at Supervisor Level<br>
            <strong>Expected Completion:</strong> April 15, 2024
          </div>
        `;
      }
      
      modal.classList.add('active');
    }

    // ==================== RAC UI PAGES ====================

    // Load RAC Dashboard
    function loadRacDashboard() {
      mainContent.innerHTML = `
        <div style="padding:8px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">RAC Dashboard</h2>
          <div style="display:flex; gap:18px; margin-bottom:25px;">
            <div style="flex:1; background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';">
              <div>
                <div style="font-size:14px; color:#666; margin-bottom:8px;">Total Scholars</div>
                <div style="font-size:26px; font-weight:700;">1</div>
              </div>
              <div style="font-size:24px; color:#f39c12;">👥</div>
            </div>

            <div style="flex:1; background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';">
              <div>
                <div style="font-size:14px; color:#666; margin-bottom:8px;">Active Scholars</div>
                <div style="font-size:26px; font-weight:700;">1</div>
              </div>
              <div style="font-size:24px; color:#27ae60;">👥</div>
            </div>

            <div style="flex:1; background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';">
              <div>
                <div style="font-size:14px; color:#666; margin-bottom:8px;">Inactive Scholars</div>
                <div style="font-size:26px; font-weight:700;">0</div>
              </div>
              <div style="font-size:24px; color:#95a5a6;">👤</div>
            </div>

            <div style="flex:1; background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)';">
              <div>
                <div style="font-size:14px; color:#666; margin-bottom:8px;">Awarded Scholars</div>
                <div style="font-size:26px; font-weight:700;">0</div>
              </div>
              <div style="font-size:24px; color:#f1c40f;">🎓</div>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <button style="background:#1e8b57; color:#fff; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(30, 139, 87, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">Export</button>
              <input placeholder="Search:" style="padding:10px 15px; border:1px solid #ddd; border-radius:8px; width: 250px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar Regdno</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar Name</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Email</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Phone</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Batch</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Phase</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Programme Type</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Department</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Institute/School</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Campus</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">1234567890</td>
                  <td style="padding:14px; border:1px solid #eee;">Khaja Zahooruddin Ahmed</td>
                  <td style="padding:14px; border:1px solid #eee;">khamed@gitam.in</td>
                  <td style="padding:14px; border:1px solid #eee;">9652350351</td>
                  <td style="padding:14px; border:1px solid #eee;">2020-2021</td>
                  <td style="padding:14px; border:1px solid #eee;">Phase-II</td>
                  <td style="padding:14px; border:1px solid #eee;">Part Time</td>
                  <td style="padding:14px; border:1px solid #eee;">COMPUTER SCIENCE AND ENGINEERING</td>
                  <td style="padding:14px; border:1px solid #eee;">GST</td>
                  <td style="padding:14px; border:1px solid #eee;">HYD</td>
                </tr>
              </tbody>
            </table>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
              <div style="color:#777;">Showing 1 to 1 of 1 entries</div>
              <div style="display:flex; gap:10px; align-items:center;">
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Previous</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #1e8b57; background:#1e8b57; color:#fff; font-weight:600;">1</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Next</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Load RAC Reviews
    function loadRacReviews() {
      mainContent.innerHTML = `
        <div class="rac-reviews-container">
          <div class="rac-reviews-title">Scholar's Research Advisory Committee Ongoing Online Review Reports</div>
          
          <table class="review-table">
            <thead>
              <tr>
                <th>Review</th>
                <th>Scholar's Progression Status</th>
                <th>Supervisor Review Status</th>
                <th>RAC Member-1 Review Status</th>
                <th>RAC Member-2 Review Status</th>
                <th>DEC Review Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><strong>December 2023</strong></td>
                <td><span class="clickable-link">Submitted on: Feb. 15, 2024</span></td>
                <td><span class="clickable-link">Submitted on: Feb. 18, 2024, 0.53 a.m.</span></td>
                <td><span class="clickable-link">Submitted on: Feb. 19, 2024, 0.44 a.m.</span></td>
                <td><span class="clickable-link">Reviewed on: March 7, 2024, 0.58 a.m.</span></td>
                <td>Statistician</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          <table class="review-table">
            <thead>
              <tr>
                <th>Review</th>
                <th>Scholar's Progression Status</th>
                <th>Supervisor Review Status</th>
                <th>RAC Member-1 Review Status</th>
                <th>RAC Member-2 Review Status</th>
                <th>DEC Review Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><strong>June 2024</strong></td>
                <td><span class="clickable-link">Submitted on: Aug. 2, 2024</span></td>
                <td><span class="clickable-link">Submitted on: Aug. 12, 2024</span></td>
                <td><span class="clickable-link">Submitted on: Aug. 16, 2024, 6.57 p.m.</span></td>
                <td><span class="clickable-link">Submitted on: Aug. 16, 2024, 12.93 p.m.</span></td>
                <td><span class="clickable-link">Reviewed on: Aug. 10, 2024, 9.04 a.m.</span></td>
                <td>Statistician</td>
              </tr>
            </tbody>
          </table>

          <table class="review-table">
            <thead>
              <tr>
                <th>Review</th>
                <th>Scholar's Progression Status</th>
                <th>Supervisor Review Status</th>
                <th>RAC Member-1 Review Status</th>
                <th>RAC Member-2 Review Status</th>
                <th>DEC Review Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><strong>December 2024</strong></td>
                <td>Absent</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          <table class="review-table">
            <thead>
              <tr>
                <th>Review</th>
                <th>Scholar's Progression Status</th>
                <th>Supervisor Review Status</th>
                <th>RAC Member-1 Review Status</th>
                <th>RAC Member-2 Review Status</th>
                <th>DEC Review Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><strong>July 2025</strong></td>
                <td><span class="clickable-link">Submitted on: Sept. 5, 2025</span></td>
                <td><span class="clickable-link">Submitted on: Sept. 24, 2025</span></td>
                <td><span class="clickable-link">Submitted on: Oct. 14, 2025, 9.49 a.m.</span></td>
                <td><span class="clickable-link">Submitted on: Nov. 4, 2025, 8.70 a.m.</span></td>
                <td>Pending</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          <div class="note-text">
            Note: Click any blue highlighted text to view/initiate/submit.
          </div>
        </div>
      `;
    }

    // Load RAC Profile
    function loadRacProfile() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">RAC Member Profile</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>RAC member profile information and settings.</p>
          </div>
        </div>`;
    }

    // ==================== SUPERVISOR UI PAGES ====================

    // Load Supervisor Dashboard
    function loadSupervisorDashboard() {
      mainContent.innerHTML = `
        <div class="supervisor-dashboard-container">
          <div class="supervisor-dashboard-title">Dashboard</div>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Total Scholars</div>
                <div class="stat-value">1</div>
              </div>
              <div class="stat-icon" style="color:#f39c12;">👥</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Thesis Submitted</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat-icon" style="color:#27ae60;">📄</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Active Scholars</div>
                <div class="stat-value">1</div>
              </div>
              <div class="stat-icon" style="color:#27ae60;">👥</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Terminated Scholars</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat-icon" style="color:#95a5a6;">👤</div>
            </div>

            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Directed Scholars</div>
                <div class="stat-value">0</div>
              </div>
              <div class="stat-icon" style="color:#f1c40f;">🎓</div>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #e6e6e6; padding:20px; border-radius:10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <button style="background:#1e8b57; color:#fff; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:600; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(30, 139, 87, 0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">Export</button>
              <input placeholder="Search:" style="padding:10px 15px; border:1px solid #ddd; border-radius:8px; width: 250px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:14px; border-radius:8px; overflow:hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <thead>
                <tr style="background:#f1f3f4;">
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar Regdno</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Scholar Name</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Email</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Phone</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Batch</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Phase</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Programme Type</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Department</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Institute/School</th>
                  <th style="padding:12px; border:1px solid #e6e6e6; text-align:left;">Campus</th>
                </tr>
              </thead>
              <tbody>
                <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding:14px; border:1px solid #eee; color:#1e8b57;">HR2DCS1R2H3O3B</td>
                  <td style="padding:14px; border:1px solid #eee;">NELIOJU PRYAMKA</td>
                  <td style="padding:14px; border:1px solid #eee;">pswd@jpg@gmail.com</td>
                  <td style="padding:14px; border:1px solid #eee;">0454664604</td>
                  <td style="padding:14px; border:1px solid #eee;">2021-2022</td>
                  <td style="padding:14px; border:1px solid #eee;">Phase-I</td>
                  <td style="padding:14px; border:1px solid #eee;">Part Time</td>
                  <td style="padding:14px; border:1px solid #eee;">COMPUTER SCIENCE AND ENGINEERING</td>
                  <td style="padding:14px; border:1px solid #eee;">GST</td>
                  <td style="padding:14px; border:1px solid #eee;">HYD</td>
                </tr>
              </tbody>
            </table>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
              <div style="color:#777;">Showing 1 to 1 of 1 entries</div>
              <div style="display:flex; gap:10px; align-items:center;">
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Previous</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #1e8b57; background:#1e8b57; color:#fff; font-weight:600;">1</button>
                <button style="padding:10px 15px; border-radius:8px; border:1px solid #e0e0e0; background:#fff; transition: all 0.3s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">Next</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Load Supervisor RAC Reports
    function loadSupervisorRacReports() {
      mainContent.innerHTML = `
        <div class="supervisor-rac-container">
          <div class="supervisor-rac-title">RAC Reports Online</div>
          
          <div class="table-controls">
            <div>
              <select style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; margin-right: 10px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
                <option>Stage</option>
              </select>
              <select style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; margin-right: 10px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
                <option>Show ID</option>
              </select>
              <select style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; margin-right: 10px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
                <option>entries</option>
              </select>
              <select style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#0b6a55'; this.style.boxShadow='0 0 0 2px rgba(11, 106, 85, 0.1)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='none';">
                <option>Direct</option>
              </select>
            </div>
            <div class="entries-info">Showing 1 to 4 of 4 entries</div>
          </div>

          <table class="supervisor-table">
            <thead>
              <tr>
                <th>Scholar id</th>
                <th>Stage</th>
                <th>Scholar name</th>
                <th>Batch</th>
                <th>Phase</th>
              </tr>
            </thead>
            <tbody>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><span class="clickable-link">HR2DCS1R2H3O3B</span></td>
                <td>December 2023</td>
                <td>NELIOJU PRYAMKA</td>
                <td>2021-2022</td>
                <td>Phase-I</td>
              </tr>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><span class="clickable-link">HR2DCS1R2H3O3B</span></td>
                <td>June 2024</td>
                <td>NELIOJU PRYAMKA</td>
                <td>2021-2022</td>
                <td>Phase-II</td>
              </tr>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><span class="clickable-link">HR2DCS1R2H3O3B</span></td>
                <td>December 2024</td>
                <td>NELIOJU PRYAMKA</td>
                <td>2021-2022</td>
                <td>Phase-II</td>
              </tr>
              <tr style="transition: background 0.3s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <td><span class="clickable-link">HR2DCS1R2H3O3B</span></td>
                <td>July 2025</td>
                <td>NELIOJU PRYAMKA</td>
                <td>2021-2022</td>
                <td>Phase-I</td>
              </tr>
            </tbody>
          </table>

          <div class="note-text">
            Note: Click on blue highlighted text to view [far] submit.
          </div>
        </div>
      `;
    }

    // Load Supervisor Profile
    function loadSupervisorProfile() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Supervisor Profile</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Supervisor profile information and settings.</p>
          </div>
        </div>`;
    }

    // Load Biometric Report
    function loadBiometricReport() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Biometric Report</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Biometric attendance and reporting system.</p>
          </div>
        </div>`;
    }

    // Load LPC
    function loadLPC() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">LPC</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Laboratory Practical Course management.</p>
          </div>
        </div>`;
    }

    // ==================== APPLICATION FORM FUNCTIONS ====================

    // Show Supervisor Change Form
    function showSupervisorChangeForm() {
      document.getElementById('applicationForm').innerHTML = `
        <div class="document-form">
          <div class="gitam-header">
            <div class="gitam-title">GANDHI INSTITUTE OF TECHNOLOGY AND MANAGEMENT (GITAM)</div>
            <div class="gitam-subtitle">(DEEMED TO BE UNIVERSITY)</div>
            <div class="gitam-subtitle">School of ______</div>
            <div class="gitam-accreditation">Accredited by NAAC with A+ Grade</div>
            <div class="gitam-address">Rudraram, Patancheru Mandal, Sangareddy (Dist) - 502 329, T.S., INDIA</div>
          </div>

          <div class="document-title">Request for Change/Addition of Supervisor(s)</div>

          <div class="form-section">
            <div class="form-section-title">Scholar Details</div>
            <div class="form-row">
              <div class="form-field">
                <label for="scholarName">Name of the Scholar</label>
                <input type="text" id="scholarName" value="Thirupathi XYZ">
              </div>
              <div class="form-field">
                <label for="department">Department</label>
                <input type="text" id="department" value="Computer Science">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="regdNo">Regd. No.</label>
                <input type="text" id="regdNo" value="1234567890">
              </div>
              <div class="form-field">
                <label for="joiningDate">Date of Joining</label>
                <input type="date" id="joiningDate" value="2023-08-15">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="programme">Programme (M.Phil/Ph.D)</label>
                <input type="text" id="programme" value="Ph.D">
              </div>
              <div class="form-field">
                <label for="category">Category</label>
                <select id="category">
                  <option value="FT">Full Time</option>
                  <option value="PT">Part Time</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="qualification">Basic Qualification</label>
                <input type="text" id="qualification" value="M.Tech">
              </div>
              <div class="form-field">
                <label for="researchArea">Broad Area of Research</label>
                <input type="text" id="researchArea" value="Machine Learning">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Existing Supervisor Details</div>
            <div class="form-row">
              <div class="form-field">
                <label for="currentSupervisor">Name of the Supervisor</label>
                <input type="text" id="currentSupervisor" value="Dr. Current Supervisor">
              </div>
              <div class="form-field">
                <label for="currentDesignation">Designation</label>
                <input type="text" id="currentDesignation" value="Professor">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="currentCoSupervisor">Name of the Co-Supervisor</label>
                <input type="text" id="currentCoSupervisor" value="Dr. Co-Supervisor">
              </div>
              <div class="form-field">
                <label for="currentCoDesignation">Designation</label>
                <input type="text" id="currentCoDesignation" value="Associate Professor">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Proposed Supervisor Details</div>
            <div class="form-row">
              <div class="form-field">
                <label for="proposedSupervisor">Name of the Supervisor</label>
                <input type="text" id="proposedSupervisor" placeholder="Enter name of proposed supervisor">
              </div>
              <div class="form-field">
                <label for="proposedCoSupervisor">Name of the Co-Supervisor</label>
                <input type="text" id="proposedCoSupervisor" placeholder="Enter name of proposed co-supervisor">
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="effectiveDate">Date of change with effect from:</label>
                <input type="date" id="effectiveDate">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Reason/Justification</div>
            <div class="form-row">
              <div class="form-field" style="flex: 1;">
                <textarea id="reason" placeholder="Please provide detailed reason and justification for the change" style="height: 120px;"></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Enclosures</div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosure1">
              <label for="enclosure1">Application form</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosure2">
              <label for="enclosure2">Admission Letter</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosure3">
              <label for="enclosure3">Previous fee receipts</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosure4">
              <label for="enclosure4">Bio-data of New supervisor / Co-supervisor in the specified format</label>
            </div>
          </div>

          <div class="signature-line">
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Signature of the Candidate</div>
            </div>
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Date</div>
            </div>
          </div>

          <div class="form-footer">
            <button class="submit-btn" onclick="submitForm('supervisorChange')">Submit Application</button>
            <button class="submit-btn" onclick="showApplicationsOptions()" style="background: #6c757d; margin-left: 10px;">Back to Options</button>
          </div>
        </div>
      `;
      document.getElementById('applicationForm').style.display = 'block';
    }

    // Show Pre-talk Form
    function showPreTalkForm() {
      document.getElementById('applicationForm').innerHTML = `
        <div class="document-form">
          <div class="gitam-header">
            <div class="gitam-title">GANDHI INSTITUTE OF TECHNOLOGY AND MANAGEMENT (GITAM)</div>
            <div class="gitam-subtitle">(DEEMED TO BE UNIVERSITY)</div>
            <div class="gitam-subtitle">GITAM School of Technology - Hyderabad</div>
            <div class="gitam-accreditation">Accredited by NAAC with A+ Grade</div>
            <div class="gitam-address">Rudraram, Patancheru Mandal, Sangareddy (Dist) - 502 329, T.S., INDIA</div>
          </div>

          <div class="form-v-header">
            <div class="document-title">Research Form -V</div>
            <div class="gitam-subtitle">Ph.D. Pre-Submission Talk Report</div>
          </div>

          <div class="form-section">
            <div class="part-title">Part A: To be filled in by the Research Scholar</div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="department2">Department</label>
                <input type="text" id="department2" value="Computer Science">
              </div>
              <div class="form-field">
                <label for="scholarName2">Name of Research Scholar</label>
                <input type="text" id="scholarName2" value="Thirupathi XYZ">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="regdNo2">Regd. No.</label>
                <input type="text" id="regdNo2" value="1234567890">
              </div>
              <div class="form-field">
                <label for="joiningDate2">Month and Year of Joining</label>
                <input type="text" id="joiningDate2" value="August 2023">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="supervisorDetails">Name of the Research Supervisor, Institute, Campus</label>
                <input type="text" id="supervisorDetails" value="Dr. Supervisor Name, GITAM, Hyderabad">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="researchArea2">Broad area of Research work</label>
                <input type="text" id="researchArea2" value="Machine Learning">
              </div>
              <div class="form-field">
                <label for="programCategory">Program Registration Category</label>
                <select id="programCategory">
                  <option value="FT">Full Time</option>
                  <option value="PT">Part Time</option>
                  <option value="Interdisciplinary">Interdisciplinary</option>
                  <option value="Extramural">Extramural</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="courseWork">Course work assigned and completed</label>
                <textarea id="courseWork" style="height: 80px;">Research Methodology, Technical Writing, Advanced Research Techniques</textarea>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="researchTopic">Topic of Research Work</label>
                <input type="text" id="researchTopic" value="Advanced Machine Learning Algorithms for Predictive Analytics">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="pretalkDate">Date of Pre-talk Seminar</label>
                <input type="date" id="pretalkDate">
              </div>
              <div class="form-field">
                <label for="pretalkTime">Time</label>
                <input type="time" id="pretalkTime">
              </div>
              <div class="form-field">
                <label for="pretalkVenue">Venue</label>
                <input type="text" id="pretalkVenue" value="Seminar Hall, Department of Computer Science">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="part-title">Details of Publications</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th>Publications</th>
                  <th>National</th>
                  <th>International</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conferences</td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="2" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>SCI Journals</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>Non SCI Journals with impact factor</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>Journals without impact factor</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section">
            <div class="part-title">Part B: Report of Department Research Committee on the Pre-Submission Talk</div>
            <div class="form-note">(To be filled by the Review Committee)</div>
            <p>The scholar submitted a draft report of the research work carried out by him / her and presented the to the DRC. The committee makes the following observations and recommendations.</p>
            
            <div class="part-title">1. Performance</div>
            <table class="evaluation-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Evaluation</th>
                  <th>Suggestions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Problem Identification</td>
                  <td>
                    <select style="width: 100%;">
                      <option>Proper</option>
                      <option>Improper</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Suggestions"></td>
                </tr>
                <tr>
                  <td>Literature survey</td>
                  <td>
                    <select style="width: 100%;">
                      <option>Sufficient</option>
                      <option>In-adequate</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Suggestions"></td>
                </tr>
                <tr>
                  <td>Contribution</td>
                  <td>
                    <select style="width: 100%;">
                      <option>Significant</option>
                      <option>Need to be improved</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Suggestions"></td>
                </tr>
                <tr>
                  <td>Results</td>
                  <td>
                    <select style="width: 100%;">
                      <option>Adequate</option>
                      <option>In-adequate</option>
                    </select>
                  </td>
                  <td><input type="text" placeholder="Suggestions"></td>
                </tr>
              </tbody>
            </table>
            
            <div class="part-title">2. Thesis Submission Recommendation</div>
            <div class="option-group">
              <input type="radio" id="adequate" name="thesisStatus">
              <label for="adequate">Adequate for the submission of the Ph.D. Thesis, incorporating the suggestions (if any) made in item 3, in consultation with the Ph.D. Supervisor.</label>
            </div>
            <div class="option-group">
              <input type="radio" id="inadequate" name="thesisStatus">
              <label for="inadequate">Inadequate for the submission of the Ph.D. Thesis in its present form and major modifications / additions / changes are required. The student must incorporate the improvements / modifications / changes suggested in item 3, and give the Pre-talk Seminar again.</label>
            </div>
            
            <div class="part-title">3. Comments / observations / recommendations of the panel</div>
            <textarea placeholder="Please write on a separate sheet and attach. The scholar must also be given a copy." style="width: 100%; height: 100px;"></textarea>
            
            <div class="part-title">4. Publications arising out of the Ph.D. Thesis to be submitted</div>
            <div class="form-note">(please attach separate sheets with complete bibliographic details and indicating whether published / accepted / communicated)</div>
            
            <div class="part-title">5. Other Recognition of the work done in the Ph.D. Thesis work</div>
            <div class="form-note">(please attach a separate sheet with complete details of patents / awards / etc.)</div>
          </div>

          <div class="form-section">
            <div class="part-title">Signatures</div>
            <div class="form-row">
              <div class="form-field">
                <label for="supervisorSignature">Name & Signature of the Research supervisor:</label>
                <div class="signature-space"></div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label>Names and Signatures with Date of all the DRC Members of the Pre-Submission Talk Panel:</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                  <div class="signature-space"></div>
                  <div class="signature-space"></div>
                  <div class="signature-space"></div>
                  <div class="signature-space"></div>
                  <div class="signature-space"></div>
                  <div class="signature-space"></div>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="convenerSignature">Remarks of Convener DRC:</label>
                <div class="signature-space"></div>
                <div>Signature of Convener- DRC</div>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button class="submit-btn" onclick="submitForm('pretalk')">Submit Application</button>
            <button class="submit-btn" onclick="showApplicationsOptions()" style="background: #6c757d; margin-left: 10px;">Back to Options</button>
          </div>
        </div>
      `;
      document.getElementById('applicationForm').style.display = 'block';
    }

    // Show Extension Form
    function showExtensionForm() {
      document.getElementById('applicationForm').innerHTML = `
        <div class="document-form">
          <div class="gitam-header">
            <div class="gitam-title">GANDHI INSTITUTE OF TECHNOLOGY AND MANAGEMENT (GITAM)</div>
            <div class="gitam-subtitle">(DEEMED TO BE UNIVERSITY)</div>
            <div class="gitam-subtitle">GITAM School of Technology - Hyderabad</div>
            <div class="gitam-accreditation">Accredited by NAAC with A+ Grade</div>
            <div class="gitam-address">Rudraram, Patancheru Mandal, Sangareddy (Dist) - 502 329, T.S., INDIA</div>
          </div>

          <div class="document-title">Ph. D Research Scholar data sheet for extension of Ph.D duration</div>

          <div class="form-section">
            <div class="form-section-title">1. (a) Research Scholar details</div>
            <table class="table-form">
              <tr>
                <td style="width: 30%;">Name of the Candidate</td>
                <td><input type="text" value="Thirupathi XYZ" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Date of Registration and Department</td>
                <td><input type="text" value="15-08-2023, Computer Science" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Program Registration Category</td>
                <td><input type="text" value="FT, PIN: 123456" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Phone No. & Email Id</td>
                <td><input type="text" value="9876543210, scholar@example.com" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Name of the Research Supervisor</td>
                <td><input type="text" value="Dr. Supervisor Name" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Work Place</td>
                <td><input type="text" value="GITAM Hyderabad" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Name of the Co-guide/s</td>
                <td><input type="text" value="Dr. Co-Supervisor" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Area of Research</td>
                <td><input type="text" value="Machine Learning" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Title of the Research work</td>
                <td><input type="text" value="Advanced Machine Learning Algorithms for Predictive Analytics" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>Dates on Departmental Research Review meetings attended</td>
                <td><input type="text" value="15-12-2023, 15-06-2024" style="width: 100%; border: none;"></td>
              </tr>
              <tr>
                <td>No. of papers published in National & International peer reviewed Journals</td>
                <td><input type="text" value="National: 1, International: 3" style="width: 100%; border: none;"></td>
              </tr>
            </table>
          </div>

          <div class="form-section">
            <div class="form-section-title">1 (b) Extension duration required details</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th>Registration Date</th>
                  <th>Duration Eligible</th>
                  <th>Required Extension till Date</th>
                  <th>Duration of Extension (Required in years or months)</th>
                  <th>No Due till Date (Yes/No)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="date" value="2023-08-15" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="3 years" style="width: 100%; border: none;"></td>
                  <td><input type="date" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="e.g., 6 months" style="width: 100%; border: none;"></td>
                  <td>
                    <select style="width: 100%; border: none;">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section">
            <div class="form-section-title">2. Subjects/ Courses taken and completed</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name of Subject</th>
                  <th>Result</th>
                  <th>Semester/ year of completion</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><input type="text" value="Research Methodology" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="A" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="Semester 1, 2023" style="width: 100%; border: none;"></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><input type="text" value="Technical Writing" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="A+" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="Semester 1, 2023" style="width: 100%; border: none;"></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td><input type="text" value="Advanced Research Techniques" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="B+" style="width: 100%; border: none;"></td>
                  <td><input type="text" value="Semester 2, 2024" style="width: 100%; border: none;"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section">
            <div class="form-section-title">3. Brief details of progress of Research Work</div>
            <textarea placeholder="Attach separate sheet bulleting the work done and quantum of work done duly signed by the Supervisor and Co-Supervisor" style="width: 100%; height: 100px;"></textarea>
          </div>

          <div class="form-section">
            <div class="form-section-title">4. Details of Publications</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th>Publications</th>
                  <th>National</th>
                  <th>International</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conferences</td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="2" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>SCI Journals</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>Non SCI Journals with impact factor</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>Journals without impact factor</td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section">
            <div class="form-section-title">5. Expected Timeline</div>
            <div class="form-row">
              <div class="form-field">
                <label for="milestones">When do you expect to reach your research milestones, deliver your pre-talk, and submit your thesis?</label>
                <textarea id="milestones" placeholder="Provide detailed timeline" style="height: 80px;"></textarea>
              </div>
            </div>
          </div>

          <div class="signature-line">
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Signature of the Candidate</div>
            </div>
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Signature of the Research Supervisor</div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Enclosures</div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureA">
              <label for="enclosureA">Copy of Admission letter.</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureB">
              <label for="enclosureB">Marks Memo of Course Work.</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureC">
              <label for="enclosureC">Permission letters if any:
                [1] Extension of time if taken earlier
                [2] Change of Title/Topic
                [3] Change of Supervisor/ Co-Supervisor</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureD">
              <label for="enclosureD">Copy of all Fee Receipts from date of joining onwards</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureE">
              <label for="enclosureE">Progress report</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureF">
              <label for="enclosureF">List of Publications in Journals</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="enclosureG">
              <label for="enclosureG">List of Publications in Conferences/Seminars along with certificates and abstracts.</label>
            </div>
          </div>

          <div class="form-footer">
            <button class="submit-btn" onclick="submitForm('extension')">Submit Application</button>
            <button class="submit-btn" onclick="showApplicationsOptions()" style="background: #6c757d; margin-left: 10px;">Back to Options</button>
          </div>
        </div>
      `;
      document.getElementById('applicationForm').style.display = 'block';
    }

    // Show Re-registration Form
    function showReRegistrationForm() {
      document.getElementById('applicationForm').innerHTML = `
        <div class="document-form">
          <div class="gitam-header">
            <div class="gitam-title">GITAM SCHOOL OF TECHNOLOGY</div>
            <div class="gitam-subtitle">GITAM (Deemed to be University)</div>
            <div class="gitam-accreditation">Accredited by NAAC with 'A' grade</div>
            <div class="gitam-subtitle">HYDERABAD</div>
            <div class="gitam-address">Rudraram, Patancheru Mandal, Sangareddy District - 502 329, T.S., India</div>
          </div>

          <div class="document-title">Ph.D (FT/PT) Re-Registration form</div>

          <div class="form-section">
            <div class="form-row">
              <div class="form-field">
                <label for="scholarName3">1. Name of the Scholar</label>
                <input type="text" id="scholarName3" value="Thirupathi XYZ">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="regdNo3">2. Reg. No.</label>
                <input type="text" id="regdNo3" value="1234567890">
              </div>
              <div class="form-field">
                <label for="joiningDate3">Date of Joining</label>
                <input type="date" id="joiningDate3" value="2023-08-15">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="deptSchool">3. Name of the Dept. & School</label>
                <input type="text" id="deptSchool" value="Computer Science, GST">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="mobile">4. Mobile No.</label>
                <input type="text" id="mobile" value="9876543210">
              </div>
              <div class="form-field">
                <label for="email">E-mail</label>
                <input type="email" id="email" value="scholar@example.com">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="programCategory2">5. Programme Category</label>
                <select id="programCategory2">
                  <option value="FT">Full Time</option>
                  <option value="PT">Part Time</option>
                  <option value="Interdisciplinary">Interdisciplinary</option>
                  <option value="Extramural">Extramural</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-field">
                <label for="researchArea3">6. Area of research work</label>
                <input type="text" id="researchArea3" value="Machine Learning">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">7. Fee payment details (Challan No. & Date of payment- From date of joining to till date & Copy to be enclosed)</div>
            <div class="form-row">
              <div class="form-field">
                <label for="academicYear">Academic Year</label>
                <select id="academicYear">
                  <option value="2018-19">2018-19</option>
                  <option value="2019-20">2019-20</option>
                  <option value="2020-21">2020-21</option>
                  <option value="2021-22">2021-22</option>
                  <option value="2022-23">2022-23</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25" selected>2024-25</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="challanNo">Challan No.</label>
                <input type="text" id="challanNo">
              </div>
              <div class="form-field">
                <label for="paymentDate">Date of Payment</label>
                <input type="date" id="paymentDate">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">8. Research Supervisor</div>
            <div class="form-row">
              <div class="form-field">
                <label for="supervisorName">a. Name</label>
                <input type="text" id="supervisorName" value="Dr. Supervisor Name">
              </div>
              <div class="form-field">
                <label for="supervisorDesignation">b. Designation</label>
                <input type="text" id="supervisorDesignation" value="Professor">
              </div>
              <div class="form-field">
                <label for="supervisorDept">c. Department</label>
                <input type="text" id="supervisorDept" value="Computer Science">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">9. Research Co-Supervisor, if any</div>
            <div class="form-row">
              <div class="form-field">
                <label for="coSupervisorName">a. Name</label>
                <input type="text" id="coSupervisorName" value="Dr. Co-Supervisor">
              </div>
              <div class="form-field">
                <label for="coSupervisorDesignation">b. Designation</label>
                <input type="text" id="coSupervisorDesignation" value="Associate Professor">
              </div>
              <div class="form-field">
                <label for="coSupervisorDept">c. Department</label>
                <input type="text" id="coSupervisorDept" value="Computer Science">
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">10. Details of Extension of Ph.D duration if any (Copy to be enclosed)</div>
            <textarea placeholder="Provide details of any previous extensions" style="width: 100%; height: 80px;"></textarea>
          </div>

          <div class="form-section">
            <div class="form-section-title">11. Comments by the Research Supervisor</div>
            <textarea placeholder="Supervisor's comments" style="width: 100%; height: 80px;"></textarea>
          </div>

          <div class="form-section">
            <div class="form-section-title">12. Recommended for Extension/re-registration (Yes/No)</div>
            <div class="form-row">
              <div class="form-field">
                <select>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">13. Status of the research work (Papers published in journals & conferences)</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name of the Journal</th>
                  <th>Published paper Details (Title, Author(s))</th>
                  <th>Vol. No., Issue. No., Pg. Nos, Year of Publication</th>
                  <th>Impact Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><input type="text" placeholder="Journal Name" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Paper Title, Authors" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Vol, Issue, Pages, Year" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Impact Factor" style="width: 100%; border: none;"></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><input type="text" placeholder="Journal Name" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Paper Title, Authors" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Vol, Issue, Pages, Year" style="width: 100%; border: none;"></td>
                  <td><input type="text" placeholder="Impact Factor" style="width: 100%; border: none;"></td>
                </tr>
              </tbody>
            </table>

            <div class="form-section-title" style="margin-top: 20px;">Research Papers Status</div>
            <table class="table-form">
              <thead>
                <tr>
                  <th rowspan="2">Research Papers</th>
                  <th colspan="2">Published</th>
                  <th colspan="2">Accepted</th>
                  <th colspan="2">Communicated</th>
                </tr>
                <tr>
                  <th>International</th>
                  <th>National</th>
                  <th>International</th>
                  <th>National</th>
                  <th>International</th>
                  <th>National</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Journals</td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
                <tr>
                  <td>Conferences</td>
                  <td><input type="number" value="2" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="1" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                  <td><input type="number" value="0" style="width: 100%; border: none; text-align: center;"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="signature-line">
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Signature of the Research Scholar</div>
            </div>
            <div class="signature-box">
              <div class="signature-space"></div>
              <div>Signature of the Research Supervisor(s)</div>
            </div>
          </div>

          <div class="form-footer">
            <button class="submit-btn" onclick="submitForm('reregistration')">Submit Application</button>
            <button class="submit-btn" onclick="showApplicationsOptions()" style="background: #6c757d; margin-left: 10px;">Back to Options</button>
          </div>
        </div>
      `;
      document.getElementById('applicationForm').style.display = 'block';
    }

    // Submit form function
    function submitForm(formType) {
      // Generate a random application ID
      const appId = 'APP' + Math.floor(100000 + Math.random() * 900000);
      
      alert(`Application submitted successfully!\nApplication ID: ${appId}\nType: ${formType}\nStatus: Under Review`);
      
      // Reset the form and show options
      document.getElementById('applicationForm').style.display = 'none';
      showApplicationsOptions();
    }

    function loadNoticeBoard() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Notice Board</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Important announcements and notices will appear here.</p>
          </div>
        </div>`;
    }

    function loadDigitalRepository() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Digital Repository</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Access research papers, theses, and other digital resources here.</p>
          </div>
        </div>`;
    }

    function loadSupport() {
      mainContent.innerHTML = `
        <div style="padding:20px;">
          <h2 style="color:#0b6a55; margin-bottom:25px; font-weight: 700; border-bottom: 2px solid #0b6a55; padding-bottom: 12px; position: relative;">Support</h2>
          <div style="background:#fff; padding:25px; border-radius:12px; border:1px solid #e1e5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <p>Get help and support for technical issues.</p>
          </div>
        </div>`;
    }
  </script>