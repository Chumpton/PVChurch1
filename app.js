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
  // 2. Public Raising Progress & Milestones Tracker (Mockup Layout)
  // -------------------------------------------------------------
  const GOAL_TARGET = 2500000;

  const FOCUS_STAGES_DATA = [
    {
      title: "Option Contract Acquisition",
      desc: "Securing the exclusive option to purchase 2100 5th Ave in Ivy Hill. Initiating neighborhood designs, surveys, and architectural layouts.",
      image: "2100-5th-Ave-Oakland-CA-Primary-Photo-1-Large.jpg",
      goalLabel: "STAGE 1 GOAL",
      goalValue: "$500K",
      icon: "🤝",
      bullets: [
        "🤝 Option Agreement Signed",
        "📋 Architectural Feasibility",
        "📐 Site Survey Drafting",
        "🏡 Community Feedback Sessions"
      ],
      calcProgress: (raised) => Math.min(100, Math.round((raised / 500000) * 100))
    },
    {
      title: "Core Purchase Title Transfer",
      desc: "Securing ownership of the 15,000 sq ft historic church landmark. Securing the physical sanctuary and starting ground renovations.",
      image: "2100-5th-Ave-Oakland-CA-Primary-Photo-1-Large.jpg",
      goalLabel: "STAGE 2 GOAL",
      goalValue: "$1.2M",
      icon: "🏛️",
      bullets: [
        "🏛️ Deed & Title Finalization",
        "⛪ Sanctuary Interior Cleanup",
        "🏗️ Core Plumbing & Electrical",
        "📝 Landmark Permits Filed"
      ],
      calcProgress: (raised) => raised < 500000 ? 0 : Math.min(100, Math.round(((raised - 500000) / 700000) * 100))
    },
    {
      title: "Culinary Renovations & Gardens",
      desc: "Transforming 400 sq ft of prep space into a certified commercial kitchen and creating healing gardens, vertical food systems, and youth nature spaces.",
      image: "2100-5th-Ave-Oakland-CA-Primary-Photo-1-Large.jpg",
      goalLabel: "STAGE 3 GOAL",
      goalValue: "$1.8M",
      icon: "🍳",
      bullets: [
        "🍳 Commercial Kitchen",
        "🌱 Vertical Food Systems",
        "💚 Healing Chambers",
        "🌳 Youth Nature Spaces"
      ],
      calcProgress: (raised) => raised < 1200000 ? 0 : Math.min(100, Math.round(((raised - 1200000) / 600000) * 100))
    },
    {
      title: "Full Sanctuary Operating Launch",
      desc: "Activating all 10 classrooms at full capacity, launching the digital Skool network online, and establishing weekly community farm-to-table banquet dinners.",
      image: "2100-5th-Ave-Oakland-CA-Primary-Photo-1-Large.jpg",
      goalLabel: "STAGE 4 GOAL",
      goalValue: "$2.5M",
      icon: "🌱",
      bullets: [
        "🏫 10 Active Classrooms",
        "💻 Digital Skool Portal",
        "🥗 Weekly Community Banquets",
        "💰 Year 1 Operating Reserves"
      ],
      calcProgress: (raised) => raised < 1800000 ? 0 : Math.min(100, Math.round(((raised - 1800000) / 700000) * 100))
    }
  ];

  function formatRaisedLarge(amt) {
    if (amt >= 1000000) {
      return `$${(amt / 1000000).toFixed(2)}M`;
    } else {
      return `$${(amt / 1000).toFixed(0)}K`;
    }
  }

  function updateRaiseProgress() {
    // Calculate total raised
    const totalRaised = donors.reduce((sum, item) => sum + Number(item.amount), 0);
    const percent = Math.min(Math.round((totalRaised / GOAL_TARGET) * 100), 100);

    // Update circular progress funded percentage
    const radialPercentText = document.getElementById("radial-percent-funded");
    if (radialPercentText) radialPercentText.textContent = `${percent}%`;

    // Circular progress SVG fill
    const radialFill = document.getElementById("radial-progress-fill");
    if (radialFill) {
      const circumference = 364.4;
      const offset = circumference - (percent / 100) * circumference;
      radialFill.style.strokeDashoffset = offset;
    }

    // Main stats row values
    const mainRaisedAmount = document.getElementById("main-raised-amount");
    if (mainRaisedAmount) mainRaisedAmount.textContent = formatRaisedLarge(totalRaised);

    const horizontalFill = document.getElementById("horizontal-progress-fill");
    if (horizontalFill) horizontalFill.style.width = `${percent}%`;

    const statsDonorsCount = document.getElementById("stats-donors-count");
    if (statsDonorsCount) statsDonorsCount.textContent = 335 + donors.length;

    const statsRemainingAmount = document.getElementById("stats-remaining-amount");
    if (statsRemainingAmount) {
      const remaining = Math.max(0, GOAL_TARGET - totalRaised);
      statsRemainingAmount.textContent = formatRaisedLarge(remaining);
    }

    // Also update CRM dashboard metrics
    const crmTotalRaised = document.getElementById("crm-val-total-raised");
    const crmDonorCount = document.getElementById("crm-val-donor-count");
    if (crmTotalRaised) crmTotalRaised.textContent = `$${totalRaised.toLocaleString()}`;
    if (crmDonorCount) crmDonorCount.textContent = donors.length;

    // Evaluate milestone node statuses
    // Stage 1 ($500K), Stage 2 ($1.2M), Stage 3 ($1.8M), Stage 4 ($2.5M)
    const stageAmounts = [500000, 1200000, 1800000, 2500000];
    let activeStageIndex = 0;
    let foundActive = false;

    stageAmounts.forEach((amt, index) => {
      const nodeElement = document.getElementById(`stage-node-${index}`);
      const markerElement = document.getElementById(`node-marker-${index}`);
      const statusTextElement = document.getElementById(`node-status-text-${index}`);

      if (nodeElement && markerElement && statusTextElement) {
        nodeElement.classList.remove("completed", "active");

        if (totalRaised >= amt) {
          // Completed
          nodeElement.classList.add("completed");
          markerElement.textContent = "✓";
          statusTextElement.textContent = "COMPLETED";
          statusTextElement.className = "node-status-text completed";
        } else if (!foundActive) {
          // In Progress
          nodeElement.classList.add("active");
          markerElement.textContent = "☉";
          statusTextElement.textContent = "IN PROGRESS";
          statusTextElement.className = "node-status-text in-progress";
          activeStageIndex = index;
          foundActive = true;
        } else {
          // Upcoming
          markerElement.textContent = "○";
          statusTextElement.textContent = "UPCOMING";
          statusTextElement.className = "node-status-text upcoming";
        }
      }
    });

    // If fully funded
    if (!foundActive) {
      activeStageIndex = 3;
      const lastNode = document.getElementById(`stage-node-3`);
      if (lastNode) lastNode.classList.add("active");
    }

    // Update milestone progress line fill
    const milestoneFill = document.getElementById("new-milestone-line-fill");
    let linePercent = 0;
    if (activeStageIndex === 0) {
      linePercent = (totalRaised / 500000) * 25; // Symmetrical mapping
    } else if (activeStageIndex === 1) {
      linePercent = 25 + ((totalRaised - 500000) / 700000) * 25;
    } else if (activeStageIndex === 2) {
      linePercent = 50 + ((totalRaised - 1200000) / 600000) * 25;
    } else {
      linePercent = 75 + ((totalRaised - 1800000) / 700000) * 25;
    }
    
    linePercent = Math.min(100, Math.max(0, linePercent));
    if (milestoneFill) milestoneFill.style.width = `${linePercent}%`;

    // Populate active focus stage details
    updateFocusSection(activeStageIndex, totalRaised);
  }

  function updateFocusSection(stageIndex, currentRaised) {
    const raised = (typeof currentRaised === 'number') 
      ? currentRaised 
      : donors.reduce((sum, item) => sum + Number(item.amount), 0);

    const data = FOCUS_STAGES_DATA[stageIndex];
    if (!data) return;

    // Title & Description
    const titleEl = document.getElementById("focus-section-title");
    const descEl = document.getElementById("focus-section-description");
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;

    // Header Card
    const goalLabelEl = document.getElementById("focus-goal-label");
    const goalValEl = document.getElementById("focus-goal-value");
    const goalHeaderIconEl = document.getElementById("focus-goal-header-icon");
    if (goalLabelEl) goalLabelEl.textContent = data.goalLabel;
    if (goalValEl) goalValEl.textContent = data.goalValue;
    if (goalHeaderIconEl) goalHeaderIconEl.textContent = data.icon;

    // Bullets list
    const builtListEl = document.getElementById("focus-built-list");
    if (builtListEl) {
      builtListEl.innerHTML = "";
      data.bullets.forEach((bullet) => {
        const li = document.createElement("li");
        const parts = bullet.split(" ");
        const icon = parts[0];
        const text = parts.slice(1).join(" ");
        li.innerHTML = `<span class="built-bullet">${icon}</span> ${text}`;
        builtListEl.appendChild(li);
      });
    }

    // Progress footer calculations
    const progressLabelEl = document.getElementById("focus-progress-label");
    const progressPercentEl = document.getElementById("focus-progress-percent");
    const progressFillEl = document.getElementById("focus-progress-bar-fill");

    const stagePercent = data.calcProgress(raised);

    if (progressLabelEl) progressLabelEl.textContent = `${data.goalLabel.replace("GOAL", "PROGRESS")}`;
    if (progressPercentEl) progressPercentEl.textContent = `${stagePercent}%`;
    if (progressFillEl) progressFillEl.style.width = `${stagePercent}%`;

    // Highlight the active focus node in the milestone list
    document.querySelectorAll(".new-milestone-node").forEach((node, idx) => {
      node.classList.remove("active-focus");
      if (idx === stageIndex) {
        node.classList.add("active-focus");
      }
    });
  }

  // Click listeners for the new milestone nodes to view stage details on demand
  document.querySelectorAll(".new-milestone-node").forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.index, 10);
      updateFocusSection(idx);
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
        window.updatePaymentTierVisuals(amt);
      }
      showModal(investModal);
    });
  });

  // Centered Invest Button inside fundraiser area
  const fundraiserInvestBtn = document.getElementById("fundraiser-invest-btn");
  if (fundraiserInvestBtn) {
    fundraiserInvestBtn.addEventListener("click", () => {
      const amountInput = document.getElementById("invest-amount");
      if (amountInput) {
        amountInput.value = 5000; // Default to Grove Tier
        window.updatePaymentTierVisuals(5000);
      }
      showModal(investModal);
    });
  }

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

  // Global functions for split payment modal window
  window.selectPaymentTier = function(amount) {
    const amountInput = document.getElementById("invest-amount");
    if (amountInput) {
      amountInput.value = amount;
      window.updatePaymentTierVisuals(amount);
    }
  };

  window.updatePaymentTierVisuals = function(amountVal) {
    const amount = Number(amountVal) || 0;
    
    // Deactivate all cards in the modal sidebar
    const cardIds = [
      "pay-tier-seedling",
      "pay-tier-sprout",
      "pay-tier-harvest",
      "pay-tier-grove",
      "pay-tier-pillar",
      "pay-tier-visionary"
    ];
    cardIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("active-tier");
    });

    let activeId = "";
    let tierName = "None";
    let isGoldTier = false;

    if (amount >= 100 && amount < 500) {
      activeId = "pay-tier-seedling";
      tierName = "Seedling Tier";
    } else if (amount >= 500 && amount < 1000) {
      activeId = "pay-tier-sprout";
      tierName = "Sprout Tier";
    } else if (amount >= 1000 && amount < 5000) {
      activeId = "pay-tier-harvest";
      tierName = "Harvest Tier";
    } else if (amount >= 5000 && amount < 25000) {
      activeId = "pay-tier-grove";
      tierName = "Grove Tier";
      isGoldTier = true;
    } else if (amount >= 25000 && amount < 100000) {
      activeId = "pay-tier-pillar";
      tierName = "Pillar Tier";
      isGoldTier = true;
    } else if (amount >= 100000) {
      activeId = "pay-tier-visionary";
      tierName = "Visionary Tier";
      isGoldTier = true;
    }

    // Activate matching card in sidebar
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) el.classList.add("active-tier");
    }

    // Update alert badge dynamically
    const alertBox = document.getElementById("active-tier-alert");
    if (alertBox) {
      if (tierName !== "None") {
        alertBox.style.display = "flex";
        alertBox.textContent = `🎉 Active Benefit: ${tierName}`;
        if (isGoldTier) {
          alertBox.style.backgroundColor = "var(--color-gold-soft)";
          alertBox.style.color = "var(--color-gold-dark)";
        } else {
          alertBox.style.backgroundColor = "var(--color-olive-soft)";
          alertBox.style.color = "var(--color-olive-dark)";
        }
      } else {
        alertBox.style.display = "none";
      }
    }
  };

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
