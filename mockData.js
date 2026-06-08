// Mock Database Seeds for PV Raise Site & CRM (Redesign Phase)
const INITIAL_DONORS = [
  { id: "d1", name: "Elena Rostova", email: "elena.r@example.com", amount: 120000, tier: "Visionary Partner", date: "2026-05-12", note: "Reserved naming rights for the Culinary Social Hall." },
  { id: "d2", name: "Marcus Chen", email: "m.chen@example.com", amount: 35000, tier: "Pillar Partner", date: "2026-05-18", note: "Excited about commercial kitchen access for food network prep." },
  { id: "d3", name: "Sarah Jenkins", email: "sjenkins@example.com", amount: 5000, tier: "Healing Circle Member", date: "2026-06-01", note: "Private dinner booking with Campton and Chef Steve." },
  { id: "d4", name: "David K.", email: "d.k@example.com", amount: 1000, tier: "Sanctuary Patron", date: "2026-06-03", note: "Keen to get name on the Living Donor Wall." },
  { id: "d5", name: "Aria Sterling", email: "aria.s@example.com", amount: 500, tier: "Sacred Supporter", date: "2026-06-05", note: "Veggie box recipient, interested in urban gardening." },
  { id: "d6", name: "Tobias Vance", email: "t.vance@example.com", amount: 150, tier: "Grounded Steward", date: "2026-06-06", note: "Digital member support." },
  { id: "d7", name: "Oakland Community Fund", email: "info@oakfund.org", amount: 1250000, tier: "Sanctuary Trustee", date: "2026-05-01", note: "Major matching grant for urban agriculture and skilling initiative." }
];

const INITIAL_TEACHERS = [
  { id: "t1", name: "Susie Raymond", email: "susie@example.com", bio: "Catalyst Life Coach and Reiki Master. Spiritual growth and emotional intelligence.", specialty: "Reiki & Coaching", status: "Approved" },
  { id: "t2", name: "Blujae", email: "blujae@example.com", bio: "Music songwriting, vocal channeling, and energetic sound bath experiences.", specialty: "Sound Healing", status: "Approved" },
  { id: "t3", name: "Chef Steve Constantine", email: "steve@pvchurch.org", bio: "CEO and head culinary educator. Private Traveling Chef specializing in zero-waste gastronomy.", specialty: "Gastronomy & Culinary", status: "Approved" },
  { id: "t4", name: "GG Freee", email: "gg.freee@example.com", bio: "Children's Book Author and youth nature circle guide.", specialty: "Youth Mentorship", status: "Approved" },
  { id: "t5", name: "Luis Rincon", email: "luis@example.com", bio: "Creative partner and digital experience designer.", specialty: "Creative Design", status: "Approved" },
  { id: "t6", name: "Campton Wilkins", email: "campton@pvchurch.org", bio: "Visionary speaker and ecological theologian guiding the Nature Church.", specialty: "Spiritual Sovereignty", status: "Approved" }
];

const INITIAL_CLASSES = [
  { id: "c1", name: "Permaculture & Vertical Gardening", teacherId: "t6", tuition: 150, enrollment: 24, maxEnrollment: 30, date: "2026-07-10", status: "Active" },
  { id: "c2", name: "Zero-Waste Gastronomy Academy", teacherId: "t3", tuition: 250, enrollment: 16, maxEnrollment: 20, date: "2026-07-15", status: "Active" },
  { id: "c3", name: "Sound Bath Channeling & Energy Work", teacherId: "t2", tuition: 80, enrollment: 32, maxEnrollment: 40, date: "2026-07-22", status: "Active" },
  { id: "c4", name: "Reiki Masterclass & Self-Healing", teacherId: "t1", tuition: 180, enrollment: 12, maxEnrollment: 15, date: "2026-07-28", status: "Active" }
];

// Initialize database in localStorage (overwrite if needed or keep existing)
function initializeDatabase() {
  if (!localStorage.getItem("pv_donors_v2")) {
    localStorage.setItem("pv_donors_v2", JSON.stringify(INITIAL_DONORS));
  }
  // For the redesign, let's always reload the teachers and classes to align with the new lightworkers profiles
  localStorage.setItem("pv_teachers", JSON.stringify(INITIAL_TEACHERS));
  localStorage.setItem("pv_classes", JSON.stringify(INITIAL_CLASSES));
}

// Export database operations
window.PVDB = {
  init: initializeDatabase,
  getDonors: () => JSON.parse(localStorage.getItem("pv_donors_v2") || "[]"),
  saveDonors: (donors) => localStorage.setItem("pv_donors_v2", JSON.stringify(donors)),
  getTeachers: () => JSON.parse(localStorage.getItem("pv_teachers") || "[]"),
  saveTeachers: (teachers) => localStorage.setItem("pv_teachers", JSON.stringify(teachers)),
  getClasses: () => JSON.parse(localStorage.getItem("pv_classes") || "[]"),
  saveClasses: (classes) => localStorage.setItem("pv_classes", JSON.stringify(classes))
};
