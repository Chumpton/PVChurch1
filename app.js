// PV Raise & CRM Application Logic (Redesign Phase)

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Mock Database
  if (window.PVDB) {
    window.PVDB.init();
  } else {
    printError("Database seed module not loaded.");
  }

  // State Management
  let donors = window.PVDB.getDonors();
  let teachers = window.PVDB.getTeachers();
  let classes = window.PVDB.getClasses();

  // Scroll Header Effect
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // -------------------------------------------------------------
  // 2. Public Raising Progress & Milestones Tracker
  // -------------------------------------------------------------
  const GOAL_TARGET = 2500000;
  
  const MILESTONE_DETAILS = {
    "500000": {
      title: "Stage 1: Property Option Contract ($500K)",
      body: "PV secures the exclusive purchase option for the historic 2100 5th Ave facility, preventing commercial redevelopment. Initiates neighborhood design sessions and architectural drafts for the garden extensions."
    },
    "1200000": {
      title: "Stage 2: Core Purchase Acquisition ($1.2M)",
      body: "Title transfer finalized. PV acquires the full 15,000 sq ft historic church facility in Ivy Hill, securing a permanent physical sanctuary for ecological ministry, holistic education, and local food networks."
    },
    "1800000": {
      title: "Stage 3: Culinary Renovations & Gardens ($1.8M)",
      body: "Restoring the social hall and building out the 400 sq ft prep space into a certified commercial-grade kitchen. Seeding external vertical cultivation systems, sound healing chambers, and youth nature circles."
    },
    "2500000": {
      title: "Stage 4: Full Launch & Operating Capital ($2.5M)",
      body: "PV launches at full capacity. We activate all 10 classrooms, launch the online Skool network courses, fund teacher recruitment programs, and establish weekly farm-to-table culinary dinners."
    }
  };

  function updateRaiseProgress() {
    // Calculate total raised
    const totalRaised = donors.reduce((sum, item) => sum + Number(item.amount), 0);
    const percent = Math.min(Math.round((totalRaised / GOAL_TARGET) * 100), 100);

    // Update DOM counters
    document.getElementById("stat-total-raised").textContent = `$${totalRaised.toLocaleString()}`;
    document.getElementById("stat-percent-funded").textContent = `${percent}%`;
    document.getElementById("progress-bar-fill").style.width = `${percent}%`;

    // Also update CRM dashboard metric if visible
    const crmTotalRaised = document.getElementById("crm-val-total-raised");
    const crmDonorCount = document.getElementById("crm-val-donor-count");
    if (crmTotalRaised) crmTotalRaised.textContent = `$${totalRaised.toLocaleString()}`;
    if (crmDonorCount) crmDonorCount.textContent = donors.length;

    // Evaluate nodes active status
    const nodes = document.querySelectorAll(".milestone-node");
    let activeAssigned = false;

    // We sort nodes by amount to assess progression
    const sortedNodes = Array.from(nodes).sort((a, b) => Number(a.dataset.amount) - Number(b.dataset.amount));

    sortedNodes.forEach((node) => {
      const amt = Number(node.dataset.amount);
      node.classList.remove("completed", "active");

      if (totalRaised >= amt) {
        node.classList.add("completed");
      } else if (!activeAssigned) {
        node.classList.add("active");
        activeAssigned = true;
        // Auto-populate milestone details with current active stage
        displayMilestoneDetails(amt);
      }
    });

    // If fully raised, set last node to active
    if (!activeAssigned && sortedNodes.length > 0) {
      sortedNodes[sortedNodes.length - 1].classList.add("active");
      displayMilestoneDetails(Number(sortedNodes[sortedNodes.length - 1].dataset.amount));
    }
  }

  function displayMilestoneDetails(amount) {
    const details = MILESTONE_DETAILS[amount];
    if (details) {
      document.getElementById("milestone-title").textContent = details.title;
      document.getElementById("milestone-body").textContent = details.body;
    }
  }

  // Setup click listeners for milestone nodes
  document.querySelectorAll(".milestone-node").forEach((node) => {
    node.addEventListener("click", () => {
      // De-active others, mark this clicked one active for review
      document.querySelectorAll(".milestone-node").forEach((n) => n.classList.remove("active"));
      node.classList.add("active");
      displayMilestoneDetails(Number(node.dataset.amount));
    });
  });

  // -------------------------------------------------------------
  // 3. Space Showcase Interactive Grid
  // -------------------------------------------------------------
  const SPACE_DATA = {
    property: {
      title: "2100 5th Ave: Adaptive Landmark Reuse",
      desc: "Located in Oakland's vibrant Ivy Hill neighborhood, this historical 15,000 sq ft church space is being transformed from a traditional religious site into a multi-dimensional platform for regional resilience.",
      bullets: ["15,000 Sq Ft Total Space", "6 Multi-stall Restrooms", "Transit Oriented (I-580 / BART)", "Ivy Hill Corner Lot Location"]
    },
    sanctuary: {
      title: "The PV Sanctuary",
      desc: "A large, double-height assembly hall designed for nature-themed gatherings, spiritual reflection, performance arts, and sound healing ceremonies. Moving beyond dogma, this space celebrates ecological connection.",
      bullets: ["Acoustically Treated Hall", "Capacity for 300+ Attendees", "Nature-Inspired Altar & Art", "Flexible Seating Layout"]
    },
    kitchen: {
      title: "Commercial Prep Kitchen",
      desc: "A certified 400-square-foot kitchen that serves as an incubator for local culinary start-ups, a workspace for zero-waste food preparation, and the teaching lab for Chef Steve Constantine's classes.",
      bullets: ["Commercial Hood & Ranges", "Prep Tables & Coolers", "Certified Health Permit Ready", "Incubator Operating Hours"]
    },
    social: {
      title: "Social & Culinary Hall",
      desc: "A 3,000+ square-foot open social hall linked to the commercial kitchen. It acts as our neighborhood community cafe, farm-to-table banquet hall, and distribution node for local urban agriculture networks.",
      bullets: ["3,000+ Sq Ft Gathering Hall", "Banquet and Cafe Seating", "Community Fridge Location", "Weekly Farm-to-Table Meals"]
    },
    gardens: {
      title: "Regenerative Urban Gardens",
      desc: "Activating the 0.38-acre exterior lot. Includes vertical gardening towers, compost facilities, rainwater harvesting beds, and honeybee boxes. A hands-on training ground for permaculture students.",
      bullets: ["Permaculture Design Layout", "Vertical Cultivation Towers", "Organic Compost Hub", "Rainwater Capture Systems"]
    }
  };

  document.querySelectorAll(".space-panel-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".space-panel-button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.space;
      const data = SPACE_DATA[key];

      if (data) {
        document.getElementById("viewed-space-title").textContent = data.title;
        document.getElementById("viewed-space-desc").textContent = data.desc;

        const bulletContainer = document.getElementById("viewed-space-bullets");
        bulletContainer.innerHTML = "";
        data.bullets.forEach((bullet) => {
          const li = document.createElement("li");
          li.textContent = bullet;
          bulletContainer.appendChild(li);
        });
      }
    });
  });

  // -------------------------------------------------------------
  // 4. Investment Tiers & Calculator Logic
  // -------------------------------------------------------------
  // Shortcut triggers in investment cards to open pledge modal with prefilled amounts
  document.querySelectorAll(".calc-trigger-shortcut").forEach((btn) => {
    btn.addEventListener("click", () => {
      const amt = btn.dataset.amt;
      const amountInput = document.getElementById("invest-amount");
      if (amountInput) {
        amountInput.value = amt;
      }
      showModal(investModal);
    });
  });

  // Hero Explore Tiers scroll trigger
  const heroCalcBtn = document.getElementById("hero-calc-btn");
  if (heroCalcBtn) {
    heroCalcBtn.addEventListener("click", () => {
      const tiersSection = document.getElementById("investment-tiers");
      if (tiersSection) {
        tiersSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // -------------------------------------------------------------
  // 5. Classes & Dynamic Tuition Split Rendering
  // -------------------------------------------------------------
  function renderClasses() {
    const grid = document.getElementById("classes-grid-display");
    grid.innerHTML = "";

    const activeClasses = classes.filter(c => c.status === "Active");

    if (activeClasses.length === 0) {
      grid.innerHTML = "<p style='grid-column: span 3; text-align:center;'>No classes scheduled yet. Create one in the admin panel!</p>";
      return;
    }

    activeClasses.forEach((cls) => {
      // Find teacher
      const teacher = teachers.find(t => t.id === cls.teacherId);
      const teacherName = teacher ? teacher.name : "TBD Instructor";

      const card = document.createElement("div");
      card.className = "class-card";
      card.innerHTML = `
        <div class="class-card-top">
          <span class="badge badge-green" style="margin-bottom:0.75rem;">Community Class</span>
          <h4>${cls.name}</h4>
          <div class="class-teacher">Instructor: ${teacherName}</div>
          <p class="class-desc">Structured hands-on coursework. Limited capacity. Integrates with virtual forum communities.</p>
        </div>
        <div class="class-card-bottom">
          <div class="class-tuition">$${cls.tuition}</div>
          <div class="class-enrollment">${cls.enrollment}/${cls.maxEnrollment} Enrolled</div>
          <button class="btn btn-outline register-class-btn" data-class-id="${cls.id}" style="padding:0.4rem 0.8rem; font-size:0.8rem;">Register</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Register buttons
    document.querySelectorAll(".register-class-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const classId = btn.dataset.classId;
        simulateEnrollment(classId);
      });
    });
  }

  function simulateEnrollment(classId) {
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      if (cls.enrollment >= cls.maxEnrollment) {
        alert("This class cohort is currently full!");
        return;
      }
      cls.enrollment += 1;
      window.PVDB.saveClasses(classes);
      renderClasses();
      syncCRMData();
      alert(`Success! Simulated enrollment completed for class: "${cls.name}".`);
    }
  }

  // -------------------------------------------------------------
  // 6. Modals Operations (Invest, Teach, Class Proposals)
  // -------------------------------------------------------------
  const investModal = document.getElementById("modal-invest");
  const teachModal = document.getElementById("modal-teach");
  const classModal = document.getElementById("modal-class");

  const closeInvestBtn = document.getElementById("modal-invest-close");
  const cancelInvestBtn = document.getElementById("modal-invest-cancel");
  const closeTeachBtn = document.getElementById("modal-teach-close");
  const cancelTeachBtn = document.getElementById("modal-teach-cancel");
  const closeClassBtn = document.getElementById("modal-class-close");
  const cancelClassBtn = document.getElementById("modal-class-cancel");

  // Open buttons
  document.getElementById("nav-invest-btn").addEventListener("click", () => showModal(investModal));
  document.getElementById("hero-invest-btn").addEventListener("click", () => showModal(investModal));

  document.getElementById("edu-teach-btn").addEventListener("click", () => showModal(teachModal));
  document.getElementById("edu-propose-btn").addEventListener("click", () => {
    populateTeacherSelect();
    showModal(classModal);
  });

  // Close buttons
  closeInvestBtn.addEventListener("click", () => hideModal(investModal));
  cancelInvestBtn.addEventListener("click", () => hideModal(investModal));
  closeTeachBtn.addEventListener("click", () => hideModal(teachModal));
  cancelTeachBtn.addEventListener("click", () => hideModal(teachModal));
  closeClassBtn.addEventListener("click", () => hideModal(classModal));
  cancelClassBtn.addEventListener("click", () => hideModal(classModal));

  function showModal(modal) {
    modal.style.display = "flex";
  }

  function hideModal(modal) {
    modal.style.display = "none";
  }

  // Close modals clicking backdrop
  window.addEventListener("click", (e) => {
    if (e.target === investModal) hideModal(investModal);
    if (e.target === teachModal) hideModal(teachModal);
    if (e.target === classModal) hideModal(classModal);
  });

  // Form Submissions
  document.getElementById("invest-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("invest-name").value;
    const email = document.getElementById("invest-email").value;
    const amount = Number(document.getElementById("invest-amount").value);
    const note = document.getElementById("invest-note").value;

    let tier = "Seedling";
    if (amount >= 100000) tier = "Visionary";
    else if (amount >= 25000) tier = "Pillar";
    else if (amount >= 5000) tier = "Grove";
    else if (amount >= 1000) tier = "Harvest";
    else if (amount >= 500) tier = "Sprout";

    const newDonor = {
      id: "d_" + Date.now(),
      name,
      email,
      amount,
      tier,
      date: new Date().toISOString().split("T")[0],
      note
    };

    donors.push(newDonor);
    window.PVDB.saveDonors(donors);
    
    // Updates
    updateRaiseProgress();
    syncCRMData();
    hideModal(investModal);
    document.getElementById("invest-form").reset();

    alert(`Thank you, ${name}! Your investment pledge of $${amount.toLocaleString()} has been committed. Check the progress bar!`);
  });

  document.getElementById("teach-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("teach-name").value;
    const email = document.getElementById("teach-email").value;
    const specialty = document.getElementById("teach-specialty").value;
    const bio = document.getElementById("teach-bio").value;

    const newTeacher = {
      id: "t_" + Date.now(),
      name,
      email,
      specialty,
      bio,
      status: "Pending"
    };

    teachers.push(newTeacher);
    window.PVDB.saveTeachers(teachers);

    syncCRMData();
    hideModal(teachModal);
    document.getElementById("teach-form").reset();

    alert(`Thank you for applying, ${name}. Your educator request is under review by the leadership team in the CRM.`);
  });

  document.getElementById("class-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("class-name").value;
    const teacherId = document.getElementById("class-teacher-select").value;
    const tuition = Number(document.getElementById("class-tuition").value);
    const date = document.getElementById("class-date").value;

    const newClass = {
      id: "c_" + Date.now(),
      name,
      teacherId,
      tuition,
      enrollment: 0,
      maxEnrollment: 30,
      date,
      status: "Active"
    };

    classes.push(newClass);
    window.PVDB.saveClasses(classes);

    renderClasses();
    syncCRMData();
    hideModal(classModal);
    document.getElementById("class-form").reset();

    alert(`Success! Class "${name}" has been scheduled.`);
  });

  // Populate teacher drop-down list
  function populateTeacherSelect() {
    const select = document.getElementById("class-teacher-select");
    select.innerHTML = "";

    const approvedTeachers = teachers.filter(t => t.status === "Approved");
    if (approvedTeachers.length === 0) {
      select.innerHTML = "<option value=''>No Approved Teachers Available</option>";
      return;
    }

    approvedTeachers.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.specialty})`;
      select.appendChild(opt);
    });
  }

  // -------------------------------------------------------------
  // 7. Backend CRM Dashboard Controller
  // -------------------------------------------------------------
  const adminPanel = document.getElementById("admin-crm-panel");
  const openAdminBtn = document.getElementById("nav-admin-btn");
  const closeAdminBtn = document.getElementById("admin-crm-close-btn");

  // Open & Close CRM
  openAdminBtn.addEventListener("click", () => {
    syncCRMData();
    adminPanel.style.display = "flex";
  });
  closeAdminBtn.addEventListener("click", () => {
    adminPanel.style.display = "none";
  });

  // CRM Tab Navigation
  document.querySelectorAll(".crm-nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".crm-nav-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const tabId = item.dataset.tab;
      document.querySelectorAll(".crm-tab-view").forEach((view) => view.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Dashboard Manual Shortcuts
  document.getElementById("crm-dash-add-donor").addEventListener("click", () => {
    showModal(investModal);
  });
  document.getElementById("crm-dash-add-class").addEventListener("click", () => {
    populateTeacherSelect();
    showModal(classModal);
  });
  document.getElementById("dashboard-refresh-btn").addEventListener("click", () => {
    syncCRMData();
  });

  // Synchronization Method to update all tables & graphs in CRM
  function syncCRMData() {
    // Reload state
    donors = window.PVDB.getDonors();
    teachers = window.PVDB.getTeachers();
    classes = window.PVDB.getClasses();

    // Sum totals
    const totalRaised = donors.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalEnrollments = classes.reduce((sum, item) => sum + Number(item.enrollment), 0);
    
    // Tuition revenues
    let totalGrossRevenue = 0;
    classes.forEach(c => {
      totalGrossRevenue += (c.tuition * c.enrollment);
    });

    const teacherPayoutsSum = Math.round(totalGrossRevenue * 0.70);
    const sanctuaryPayoutsSum = Math.round(totalGrossRevenue * 0.30);

    // Update Counters
    document.getElementById("crm-val-total-raised").textContent = `$${totalRaised.toLocaleString()}`;
    document.getElementById("crm-val-donor-count").textContent = donors.length;
    document.getElementById("crm-val-enrollment-count").textContent = totalEnrollments;
    document.getElementById("crm-val-space-revenue").textContent = `$${sanctuaryPayoutsSum.toLocaleString()}`;
    document.getElementById("crm-val-teacher-split-sum").textContent = `$${teacherPayoutsSum.toLocaleString()}`;
    document.getElementById("crm-val-church-split-sum").textContent = `$${sanctuaryPayoutsSum.toLocaleString()}`;

    // Render Sub-sections
    renderCRMDonorsTable();
    renderCRMTeachersTable();
    renderCRMClassesTable();
    renderCRMCharts(donors);
  }

  // Render Table: Donors Ledger
  function renderCRMDonorsTable() {
    const tbody = document.getElementById("crm-donors-table-body");
    tbody.innerHTML = "";

    if (donors.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No donors in database.</td></tr>";
      return;
    }

    donors.forEach((donor) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${donor.name}</strong></td>
        <td>${donor.email}</td>
        <td style="color:var(--color-olive-dark); font-weight:600;">$${Number(donor.amount).toLocaleString()}</td>
        <td><span class="badge ${donor.amount >= 5000 ? 'badge-yellow' : 'badge-green'}">${donor.tier}</span></td>
        <td>${donor.date}</td>
        <td>
          <button class="table-act-btn table-act-btn-reject delete-donor-btn" data-id="${donor.id}">Remove</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Delete donor listeners
    document.querySelectorAll(".delete-donor-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to delete this investor record? The progress bar will update immediately.")) {
          donors = donors.filter(d => d.id !== id);
          window.PVDB.saveDonors(donors);
          updateRaiseProgress();
          syncCRMData();
        }
      });
    });
  }

  // Render Table: Teacher applications
  function renderCRMTeachersTable() {
    const tbody = document.getElementById("crm-teachers-table-body");
    tbody.innerHTML = "";

    if (teachers.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No teacher requests.</td></tr>";
      return;
    }

    teachers.forEach((teacher) => {
      const isPending = teacher.status === "Pending";
      const statusBadge = isPending 
        ? `<span class="badge badge-yellow">${teacher.status}</span>`
        : `<span class="badge badge-green">${teacher.status}</span>`;

      const actions = isPending 
        ? `<button class="table-act-btn table-act-btn-approve approve-teacher-btn" data-id="${teacher.id}">Approve</button>
           <button class="table-act-btn table-act-btn-reject reject-teacher-btn" data-id="${teacher.id}">Reject</button>`
        : `<span style="color:var(--text-muted); font-size:0.85rem;">No actions pending</span>`;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${teacher.name}</strong></td>
        <td>${teacher.email}</td>
        <td>${teacher.specialty}</td>
        <td style="max-width:250px; font-size:0.85rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${teacher.bio}">${teacher.bio}</td>
        <td>${statusBadge}</td>
        <td>${actions}</td>
      `;
      tbody.appendChild(tr);
    });

    // Approve / Reject Listeners
    document.querySelectorAll(".approve-teacher-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const teach = teachers.find(t => t.id === id);
        if (teach) {
          teach.status = "Approved";
          window.PVDB.saveTeachers(teachers);
          syncCRMData();
        }
      });
    });

    document.querySelectorAll(".reject-teacher-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (confirm("Reject this applicant request?")) {
          teachers = teachers.filter(t => t.id !== id);
          window.PVDB.saveTeachers(teachers);
          syncCRMData();
        }
      });
    });
  }

  // Render Table: Classes payouts & schedules
  function renderCRMClassesTable() {
    const tbody = document.getElementById("crm-classes-table-body");
    tbody.innerHTML = "";

    if (classes.length === 0) {
      tbody.innerHTML = "<tr><td colspan='8' style='text-align:center;'>No classes scheduled.</td></tr>";
      return;
    }

    classes.forEach((cls) => {
      const teacher = teachers.find(t => t.id === cls.teacherId);
      const teacherName = teacher ? teacher.name : "Unassigned";

      const gross = cls.tuition * cls.enrollment;
      const tShare = Math.round(gross * 0.70);
      const cShare = Math.round(gross * 0.30);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${cls.name}</strong></td>
        <td>${teacherName}</td>
        <td>$${cls.tuition}</td>
        <td>${cls.enrollment}/${cls.maxEnrollment}</td>
        <td style="color:var(--text-dark); font-weight:700;">$${gross.toLocaleString()}</td>
        <td style="color:var(--color-olive-dark);">$${tShare.toLocaleString()}</td>
        <td style="color:var(--color-gold-dark); font-weight:600;">$${cShare.toLocaleString()}</td>
        <td>${cls.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render SVG Charts in CRM Dashboard (Earth & Light Styled)
  function renderCRMCharts(donorData) {
    const chartContainer = document.getElementById("crm-svg-bar-chart-container");
    chartContainer.innerHTML = "";

    // Aggregate raise per tier
    const tierBuckets = {
      Seedling: 0,
      Sprout: 0,
      Harvest: 0,
      Grove: 0,
      Pillar: 0,
      Visionary: 0
    };

    donorData.forEach(d => {
      if (tierBuckets.hasOwnProperty(d.tier)) {
        tierBuckets[d.tier] += Number(d.amount);
      }
    });

    const categories = Object.keys(tierBuckets);
    const values = Object.values(tierBuckets);
    const maxVal = Math.max(...values, 1000); // Prevent divide by zero

    // Build a responsive, gorgeous SVG Bar Chart
    let barsSvg = `<svg width="100%" height="200" viewBox="0 0 500 200" style="background:transparent;">`;

    categories.forEach((cat, index) => {
      const val = values[index];
      // Normalize height to max 120px
      const barHeight = Math.round((val / maxVal) * 120);
      const x = 30 + (index * 75);
      const y = 150 - barHeight;

      // Gradients coloring: Olive for low, Gold for high values
      const color = val > 20000 ? "var(--color-gold-dark)" : "var(--color-olive)";

      barsSvg += `
        <!-- Bar rect -->
        <rect x="${x}" y="${y}" width="40" height="${barHeight}" rx="4" fill="${color}" opacity="0.85" style="transition: all 0.5s ease;"></rect>
        
        <!-- Text Value above bar -->
        <text x="${x + 20}" y="${y - 8}" font-family="var(--font-heading)" font-size="9" fill="var(--color-olive-deep)" text-anchor="middle" font-weight="700">$${formatShortValue(val)}</text>
        
        <!-- Category Label -->
        <text x="${x + 20}" y="170" font-family="var(--font-sub)" font-size="8" fill="var(--text-muted)" font-weight="700" text-anchor="middle" style="text-transform:uppercase;">${cat}</text>
      `;
    });

    barsSvg += `
      <!-- Base Line -->
      <line x1="15" y1="152" x2="485" y2="152" stroke="var(--border-color)" stroke-width="2"></line>
    </svg>`;

    chartContainer.innerHTML = barsSvg;
  }

  function formatShortValue(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  }

  function printError(msg) {
    console.error(msg);
  }

  // -------------------------------------------------------------
  // 8. Run App Initializations
  // -------------------------------------------------------------
  updateRaiseProgress();
  renderClasses();
  syncCRMData();

  // Schedule class propose teacher loader helper trigger
  document.getElementById("crm-schedule-class-btn").addEventListener("click", () => {
    populateTeacherSelect();
    showModal(classModal);
  });
});
