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

  const TIERS_DATA = [
    {
      name: "Seedling",
      amount: 1,
      badge: "Grassroots",
      desc: "PV Digital membership credentials, community newsletter & project updates.",
      kit: "None",
      digital: "PV Digital Membership Badge, monthly newsletter access.",
      physical: "Community voting on general initiatives."
    },
    {
      name: "Friend",
      amount: 5,
      badge: "Grassroots",
      desc: "Unlock the member portal and private discussion forums.",
      kit: "None",
      digital: "Access to private Discord & Skool forums.",
      physical: "Priority presale ticket access to PV physical ceremonies & classes."
    },
    {
      name: "Advocate",
      amount: 15,
      badge: "Grassroots",
      desc: "Receive digital resource packages and public wall acknowledgment.",
      kit: "None",
      digital: "Digital Contributor Wall listing & digital resource pack (holistic guides & printables).",
      physical: "5% discount on physical events."
    },
    {
      name: "Earth Guardian",
      amount: 25,
      badge: "Grassroots Contributor",
      desc: "Immediate physical connection kit and digital wall listing.",
      kit: "Nature Connection Kit: Native wildflower seed bombs & PV custom sticker set.",
      digital: "Digital Contributor Wall listing & Discord/Skool forum access.",
      physical: "5% discount on physical events."
    },
    {
      name: "Rooted Member",
      amount: 50,
      badge: "Grassroots Contributor",
      desc: "Immediate physical starter kit and local class discounts.",
      kit: "PV Starter Kit: Custom organic canvas tote bag & custom PV botanical decals.",
      digital: "Digital Contributor Wall listing & Discord/Skool forum access.",
      physical: "10% discount on physical classes."
    },
    {
      name: "Grounded Steward",
      amount: 150,
      badge: "Grassroots Contributor",
      desc: "Immediate physical stewardship kit and community lunch rewards.",
      kit: "PV Stewardship Kit: PV ceramic mug, custom organic herbal tea blend, canvas tote bag.",
      digital: "Premium online portal guides & meditation audio downloads.",
      physical: "10% discount on physical classes + 1 free ticket to a community lunch banquet."
    },
    {
      name: "Regenerative Patron",
      amount: 250,
      badge: "Grassroots Contributor",
      desc: "Support local food loops. Includes 1 month of organic vegetable boxes.",
      kit: "PV Farm Basket: 1-Month Organic Seasonal Farm Box, custom PV ceramic mug, tea blend, canvas tote bag.",
      digital: "Premium online portal guides & meditation audio downloads.",
      physical: "10% discount on physical classes + 2 free tickets to community lunch banquets."
    },
    {
      name: "Sacred Supporter",
      amount: 500,
      badge: "Sanctuary Contributor",
      desc: "Receive a 3-month farm box subscription and organic custom t-shirt.",
      kit: "PV Harvest Kit: 3-Month Organic Seasonal Farm Box subscription & PV logo organic cotton t-shirt + mug & tea.",
      digital: "Full member portal privileges & priority class registrations.",
      physical: "15% discount on physical classes + 1 free workshop ticket."
    },
    {
      name: "Sanctuary Patron",
      amount: 1000,
      badge: "Sanctuary Contributor",
      desc: "Permanent Living Donor Wall engraving and banquet dinner invitations.",
      kit: "PV Patron Kit: Harvest Kit (3-Mo Farm Box + T-shirt) + limited-edition custom PV hoodie + mug & tea.",
      digital: "Name engraved on the physical & digital Living Donor Wall.",
      physical: "Lifetime 15% class discount + Invites to seasonal farm-to-table banquet dinners."
    },
    {
      name: "Healing Circle Member",
      amount: 3000,
      badge: "Sanctuary Contributor",
      desc: "VIP sacred ceremony access and custom olive wood journal.",
      kit: "Sacred Spaces Kit: Custom PV hoodie, custom PV olive wood journal, aromatherapy essential oil set.",
      digital: "Name engraved on the physical & digital Living Donor Wall.",
      physical: "Lifetime 20% class discount + VIP invitation to sacred ceremonies & music events."
    },
    {
      name: "Anchor Patron",
      amount: 10000,
      badge: "Aligned Supporter",
      desc: "Lifetime VIP access, dedicational room plaque, and private dinner with founders.",
      kit: "PV VIP Anchor Box: Custom engraved wood plaque, olive wood journal, custom hoodie, VIP kit.",
      digital: "Name on Living Donor Wall & permanent classroom/room dedicational plaque rights.",
      physical: "Lifetime VIP free access to all ceremonies + private farm-to-table dinner with founders + 20% room rental discount."
    },
    {
      name: "Pillar Partner",
      amount: 25000,
      badge: "Stakeholder",
      desc: "For commercial stakeholders. Kitchen hours, space revenue splits, and board options.",
      kit: "None (Commercial agreement)",
      digital: "Shared-space rental dividend tracking dashboard access.",
      physical: "10 hours/month of commercial kitchen usage + 10% space revenue splits + Board Seat option."
    },
    {
      name: "Keystone Partner",
      amount: 50000,
      badge: "Stakeholder",
      desc: "Enhanced commercial space operations, 15% revenue splits.",
      kit: "None (Commercial agreement)",
      digital: "Shared-space rental dividend tracking dashboard access.",
      physical: "20 hours/month of commercial kitchen usage + 15% space revenue splits + custom room dedicational plaque + Board Seat option."
    },
    {
      name: "Visionary Partner",
      amount: 100000,
      badge: "Stakeholder",
      desc: "Sanctuary naming rights, 20% space revenue splits, Advisory Board Seat.",
      kit: "None (Commercial agreement)",
      digital: "Full dividend dashboard & priority Joint Venture agreement terms.",
      physical: "Naming rights for classroom/hall + 20% space revenue splits + Advisory Board Seat + custom JV terms."
    },
    {
      name: "Sanctuary Trustee",
      amount: 250000,
      badge: "Trustee",
      desc: "Ultimate sanctuary legacy naming rights, 25% revenue splits, and lifetime seat on the Board of Trustees.",
      kit: "PV Legacy Chest: Cedar chest with all custom physical gear (hoodies, mugs, teas, journals) + a gold-plated key to the sanctuary.",
      digital: "Full Trustee dividend dashboard & permanent naming rights acknowledgment on website header.",
      physical: "Lifetime Board of Trustees Seat + 25% space revenue splits + Sanctuary assembly hall naming rights + unlimited VIP family access."
    }
  ];

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
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-3-Large.jpg",
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
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-25-LargeHighDefinition.jpg",
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
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-4-LargeHighDefinition.jpg",
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

    // Update milestone progress line fill to match overall raised percentage
    const milestoneFill = document.getElementById("new-milestone-line-fill");
    if (milestoneFill) milestoneFill.style.width = `${percent}%`;

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

    // Image Swap
    const imageEl = document.getElementById("focus-section-image");
    if (imageEl && data.image) {
      imageEl.src = data.image;
    }

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
      bullets: ["15,000 Sq Ft Total Space", "6 Multi-stall Restrooms", "Transit Oriented (I-580 / BART)", "Ivy Hill Corner Lot Location"],
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-2-Large.jpg"
    },
    sanctuary: {
      title: "The PV Sanctuary",
      desc: "A large, double-height assembly hall designed for nature-themed gatherings, spiritual reflection, performance arts, and sound healing ceremonies. Moving beyond dogma, this space celebrates ecological connection.",
      bullets: ["Acoustically Treated Hall", "Capacity for 300+ Attendees", "Nature-Inspired Altar & Art", "Flexible Seating Layout"],
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-4-LargeHighDefinition.jpg"
    },
    kitchen: {
      title: "Commercial Prep Kitchen",
      desc: "A certified 400-square-foot kitchen that serves as an incubator for local culinary start-ups, a workspace for zero-waste food preparation, and the teaching lab for Chef Steve Constantine's classes.",
      bullets: ["Commercial Hood & Ranges", "Prep Tables & Coolers", "Certified Health Permit Ready", "Incubator Operating Hours"],
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-15-LargeHighDefinition.jpg"
    },
    social: {
      title: "Social & Culinary Hall",
      desc: "A 3,000+ square-foot open social hall linked to the commercial kitchen. It acts as our neighborhood community cafe, farm-to-table banquet hall, and distribution node for local urban agriculture networks.",
      bullets: ["3,000+ Sq Ft Gathering Hall", "Banquet and Cafe Seating", "Community Fridge Location", "Weekly Farm-to-Table Meals"],
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-5-LargeHighDefinition.jpg"
    },
    gardens: {
      title: "Regenerative Urban Gardens",
      desc: "Activating the 0.38-acre exterior lot. Includes vertical gardening towers, compost facilities, rainwater harvesting beds, and honeybee boxes. A hands-on training ground for permaculture students.",
      bullets: ["Permaculture Design Layout", "Vertical Cultivation Towers", "Organic Compost Hub", "Rainwater Capture Systems"],
      image: "2100-5th-Ave-Oakland-CA-Building-Photo-25-LargeHighDefinition.jpg"
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

        const spacePhoto = document.getElementById("active-space-photo");
        if (spacePhoto && data.image) {
          spacePhoto.src = data.image;
        }

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
  // 4. Investment Tiers & Slider Explorer Logic
  // -------------------------------------------------------------
  // Render landing page Tiers Explorer details
  function renderTiersExplorer(index) {
    const tier = TIERS_DATA[index];
    if (!tier) return;

    // Badges & Labels
    const badgeEl = document.getElementById("explorer-tier-badge");
    const nameEl = document.getElementById("explorer-tier-name");
    const amountEl = document.getElementById("explorer-tier-amount");
    const descEl = document.getElementById("explorer-tier-description");

    if (badgeEl) {
      badgeEl.textContent = `${tier.badge} Tier`;
      badgeEl.className = tier.amount >= 5000 ? "badge badge-yellow" : "badge badge-green";
    }
    if (nameEl) nameEl.textContent = tier.name;
    if (amountEl) amountEl.textContent = `$${tier.amount.toLocaleString()}`;
    if (descEl) descEl.textContent = tier.desc;

    // Rewards
    const rewardKitEl = document.getElementById("explorer-reward-kit");
    const rewardDigitalEl = document.getElementById("explorer-reward-digital");
    const rewardPhysicalEl = document.getElementById("explorer-reward-physical");

    const cardKit = document.getElementById("reward-card-kit");

    if (rewardKitEl) rewardKitEl.textContent = tier.kit;
    if (rewardDigitalEl) rewardDigitalEl.textContent = tier.digital;
    if (rewardPhysicalEl) rewardPhysicalEl.textContent = tier.physical;

    // Hide or show immediate kit reward card if none exists
    if (cardKit) {
      if (tier.kit === "None") {
        cardKit.style.display = "none";
      } else {
        cardKit.style.display = "flex";
      }
    }

    // Set CTA contribute button action
    const contributeBtn = document.getElementById("explorer-contribute-btn");
    if (contributeBtn) {
      contributeBtn.textContent = `💰 Contribute $${tier.amount.toLocaleString()}`;
      contributeBtn.onclick = () => {
        const amountInput = document.getElementById("invest-amount");
        if (amountInput) {
          amountInput.value = tier.amount;
          window.updatePaymentTierVisuals(tier.amount);
        }
        showModal(investModal);
      };
    }
  }

  // Tiers Explorer range slider listener
  const tiersSlider = document.getElementById("tiers-range-slider");
  if (tiersSlider) {
    tiersSlider.addEventListener("input", () => {
      const index = parseInt(tiersSlider.value, 10);
      renderTiersExplorer(index);
      highlightTick(index);
    });
  }

  // Snapping functions
  window.snapSliderTo = function(index) {
    const slider = document.getElementById("tiers-range-slider");
    if (slider) {
      slider.value = index;
      renderTiersExplorer(index);
      highlightTick(index);
    }
  };

  function highlightTick(activeIndex) {
    document.querySelectorAll(".tick-label").forEach((label, idx) => {
      label.classList.remove("active-tick");
      if (idx === activeIndex) {
        label.classList.add("active-tick");
      }
    });
  }

  // Render modal sidebar tiers list dynamically
  function renderModalTiersList() {
    const container = document.getElementById("payment-tiers-modal-list");
    if (!container) return;
    container.innerHTML = "";

    TIERS_DATA.forEach((t) => {
      const isGold = t.amount >= 5000;
      const badgeClass = isGold ? "badge-yellow" : "badge-green";
      
      const card = document.createElement("div");
      card.className = "payment-tier-item-card";
      card.id = `pay-tier-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
      card.onclick = () => {
        window.selectPaymentTier(t.amount);
      };

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge ${badgeClass}">${t.name} ($${t.amount.toLocaleString()})</span>
          <span class="tier-select-circle"></span>
        </div>
        <p class="payment-tier-desc" style="font-size:0.8rem; margin-top:0.5rem; color:var(--text-grey);">${t.desc}</p>
      `;
      container.appendChild(card);
    });
  }

  // Fundraiser Centered Invest/Contribute Button inside fundraiser card
  const fundraiserInvestBtn = document.getElementById("fundraiser-invest-btn");
  if (fundraiserInvestBtn) {
    fundraiserInvestBtn.addEventListener("click", () => {
      const amountInput = document.getElementById("invest-amount");
      if (amountInput) {
        amountInput.value = 250; // Default to Regenerative Patron ($250)
        window.updatePaymentTierVisuals(250);
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

  // Global functions for split payment modal window selector
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
    TIERS_DATA.forEach(t => {
      const id = `pay-tier-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
      const el = document.getElementById(id);
      if (el) el.classList.remove("active-tier");
    });

    let selectedTier = null;
    for (let i = TIERS_DATA.length - 1; i >= 0; i--) {
      if (amount >= TIERS_DATA[i].amount) {
        selectedTier = TIERS_DATA[i];
        break;
      }
    }

    if (selectedTier) {
      const id = `pay-tier-${selectedTier.name.toLowerCase().replace(/\s+/g, "-")}`;
      const el = document.getElementById(id);
      if (el) el.classList.add("active-tier");

      // Auto-scroll inside the sidebar stack if needed
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      const isGold = selectedTier.amount >= 5000;
      const alertBox = document.getElementById("active-tier-alert");
      if (alertBox) {
        alertBox.style.display = "flex";
        alertBox.textContent = `🎉 Active Benefit: ${selectedTier.name} Tier`;
        if (isGold) {
          alertBox.style.backgroundColor = "var(--color-gold-soft)";
          alertBox.style.color = "var(--color-gold-dark)";
        } else {
          alertBox.style.backgroundColor = "var(--color-olive-soft)";
          alertBox.style.color = "var(--color-olive-dark)";
        }
      }
    } else {
      const alertBox = document.getElementById("active-tier-alert");
      if (alertBox) alertBox.style.display = "none";
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

    let selectedTier = TIERS_DATA[0]; // Fallback
    for (let i = TIERS_DATA.length - 1; i >= 0; i--) {
      if (amount >= TIERS_DATA[i].amount) {
        selectedTier = TIERS_DATA[i];
        break;
      }
    }
    const tier = selectedTier.name;

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

    // Aggregate raise per tier group
    const tierBuckets = {
      "Grassroots": 0,    // $1 - $15
      "Contributor": 0,   // $25 - $250
      "Sanctuary": 0,     // $500 - $3,000
      "Anchor": 0,        // $10,000
      "Partner": 0        // $25,000+
    };

    donorData.forEach(d => {
      const amt = Number(d.amount) || 0;
      if (amt < 25) {
        tierBuckets["Grassroots"] += amt;
      } else if (amt < 500) {
        tierBuckets["Contributor"] += amt;
      } else if (amt < 10000) {
        tierBuckets["Sanctuary"] += amt;
      } else if (amt < 25000) {
        tierBuckets["Anchor"] += amt;
      } else {
        tierBuckets["Partner"] += amt;
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
      const x = 35 + (index * 90); // Adjusted spacing for 5 categories
      const y = 150 - barHeight;

      // Gradients coloring: Olive for low, Gold for high values
      const color = val > 50000 ? "var(--color-gold-dark)" : "var(--color-olive)";

      barsSvg += `
        <!-- Bar rect -->
        <rect x="${x}" y="${y}" width="45" height="${barHeight}" rx="4" fill="${color}" opacity="0.85" style="transition: all 0.5s ease;"></rect>
        
        <!-- Text Value above bar -->
        <text x="${x + 22.5}" y="${y - 8}" font-family="var(--font-heading)" font-size="9" fill="var(--color-olive-deep)" text-anchor="middle" font-weight="700">$${formatShortValue(val)}</text>
        
        <!-- Category Label -->
        <text x="${x + 22.5}" y="170" font-family="var(--font-sub)" font-size="8" fill="var(--text-muted)" font-weight="700" text-anchor="middle" style="text-transform:uppercase;">${cat}</text>
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

  // Initialize Tiers Explorer & Modal Sidebar
  renderModalTiersList();
  renderTiersExplorer(6); // Default snapshot is $250 Regenerative Patron
  highlightTick(6);

  // -------------------------------------------------------------
  // Hero Carousel Control Logic
  // -------------------------------------------------------------
  const slides = document.querySelectorAll(".hero-carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  
  let currentSlide = 0;
  let carouselInterval = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active");
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, 5000); // 5s Auto-rotation
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
    }
  }

  if (slides.length > 0) {
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startCarousel();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const slideIndex = parseInt(dot.dataset.slide, 10);
        showSlide(slideIndex);
        startCarousel();
      });
    });

    startCarousel();

    // Pause on hover
    const carouselContainer = document.querySelector(".hero-carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", stopCarousel);
      carouselContainer.addEventListener("mouseleave", startCarousel);
    }
  }

  // Schedule class propose teacher loader helper trigger
  document.getElementById("crm-schedule-class-btn").addEventListener("click", () => {
    populateTeacherSelect();
    showModal(classModal);
  });
});
