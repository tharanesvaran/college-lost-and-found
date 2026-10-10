/**
 * Dr. Mahalingam College of Engineering & Technology (MCET)
 * Campus Map Coordinates and Landmark Data
 * Calibrated against the provided Google Maps campus screenshot.
 */

export const MCET_CAMPUS_CENTER = {
  lat: 10.6629,
  lng: 77.0105,
  zoom: 17
};

export const MCET_CAMPUS_BOUNDS = [
  [10.6600, 77.0075], // Southwest corner
  [10.6655, 77.0135]  // Northeast corner
];

export const CAMPUS_LANDMARKS = [
  {
    id: "block-b",
    name: "Block B (South Quadrangle)",
    tamilName: "பிளாக் பி",
    category: "Academic",
    lat: 10.6612,
    lng: 77.0103,
    description: "Engineering departments, classrooms & laboratories directly south of Indian Bank.",
    icon: "🏢",
    prominent: true
  },
  {
    id: "indian-bank",
    name: "INDIAN BANK & ATM Branch",
    tamilName: "இந்திய வங்கி",
    category: "Banking",
    lat: 10.6618,
    lng: 77.0102,
    description: "MCET on-campus branch & 24/7 ATM counter.",
    icon: "🏦",
    prominent: true
  },
  {
    id: "mcet-main",
    name: "Dr. Mahalingam College of Engineering and Technology (MCET)",
    tamilName: "டாக்டர். மகாலிங்கம் பொறியியல் மற்றும் தொழில்நுட்பக் கல்லூரி",
    category: "Administrative",
    lat: 10.6629,
    lng: 77.0105,
    description: "Main administrative tower, Dean & Principal offices.",
    icon: "🎓",
    prominent: true
  },
  {
    id: "nptc",
    name: "Nachimuthu Polytechnic College (NPTC)",
    tamilName: "நாச்சிமுத்து பாலிடெக்னிக் கல்லூரி",
    category: "Institution",
    lat: 10.6626,
    lng: 77.0084,
    description: "Sister polytechnic campus on the western flank.",
    icon: "🏛️",
    prominent: true
  },
  {
    id: "library",
    name: "Centenary Central Library",
    category: "Academic",
    lat: 10.6635,
    lng: 77.0112,
    description: "Central library, digital reading rooms, and reference collection.",
    icon: "📚",
    prominent: false
  },
  {
    id: "canteen",
    name: "Student Amenities & Canteen",
    category: "Dining",
    lat: 10.6620,
    lng: 77.0118,
    description: "Main student food court and cafeteria.",
    icon: "☕",
    prominent: false
  },
  {
    id: "mech-complex",
    name: "Mechanical Science Complex",
    category: "Workshops",
    lat: 10.6631,
    lng: 77.0094,
    description: "Mechanical workshops and CAD/CAM research laboratories.",
    icon: "⚙️",
    prominent: false
  },
  {
    id: "admin-lost-found",
    name: "Admin Office (Lost & Found Intake Desk)",
    category: "Intake",
    lat: 10.6627,
    lng: 77.0104,
    description: "Ground Floor Room 102 — Single Intake Point for all found property.",
    icon: "🗄️",
    prominent: true
  },
  {
    id: "sports-ground",
    name: "Athletic Ground & Sports Pavilion",
    category: "Sports",
    lat: 10.6605,
    lng: 77.0092,
    description: "Outdoor cricket ground, athletic track, and indoor sports hall.",
    icon: "🏃",
    prominent: false
  },
  {
    id: "main-gate",
    name: "Main Entrance Gate & NH 83 Bus Stop",
    category: "Transit",
    lat: 10.6645,
    lng: 77.0095,
    description: "Highway entrance from Udumalai Road with public bus stop shelter.",
    icon: "🚌",
    prominent: true
  }
];
