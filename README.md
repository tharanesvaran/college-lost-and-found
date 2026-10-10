# College Lost & Found System — Dr. Mahalingam College of Engineering and Technology (MCET)

A production-grade, responsive institutional web application built with **React**, **Tailwind CSS**, and **Firebase** (Google Sign-In, Firestore, and Cloud Functions). Features an interactive campus map specifically modeled on **Dr. Mahalingam College of Engineering and Technology (MCET)** in Pollachi, Tamil Nadu, referencing campus landmarks like **Block B**, **Nachimuthu Polytechnic College (NPTC)**, **Indian Bank & ATM**, and the **Central Library**.

---

## 🌟 Key System Capabilities

### 1. Login & Roles
- **Google Sign-In Only**: No insecure email/password credentials.
- **Two Roles on Same Login Page**: Student and Administrator.
- **Admin Verification via Database Allowlist**:
  - Admin usernames must strictly end with `.admin` (e.g. `office1.admin`).
  - System verifies that the Google account is mapped to the pre-approved username in the `adminAllowlist` collection.
  - Non-allowlisted users are strictly refused admin rights.
- **Mandatory First-Time Student Profile**:
  - First-time Google sign-ins are required to complete a profile (Full Name, Roll Number, auto-filled Gmail, Phone Number, Year of Study, and Department).
  - The student cannot access or browse the portal until this is saved.
- **Privacy Rule**:
  - Only administrators can view or search student profiles.
  - Students can view only their own personal profile.

### 2. Administrator Features
1. **Single Intake Point**: Centrally records all belongings physically handed in to the College Admin Office.
2. **Item Logging Form**: Category, public description, hidden private notes (serial numbers, wallpapers, marks), campus map pin, date found, finder roll number/name, storage number.
3. **Holding Period Countdown**: Visual countdown badges based on configurable holding periods (default 45 days, configurable 30–60 days).
4. **Secure Storage Tracking**: Numbered shelves and slots, with an automatic **"Locked Cabinet"** flag suggested for valuables (phones, wallets, laptops, jewelry).
5. **Handover Log**: Permanent, append-only audit register recording student roll number, timestamp, releasing staff, and physical College ID verification check.
6. **Student Search**: Admins can search student records by roll number or name and view full profiles.
7. **Claim Management**: Review student answers against office custody records; advance claims through `Requested` → `Approved` → `Ready for Pickup` → `Collected`.
8. **Sensitive Items Quarantine**: ID cards, ATM cards, and certificates are never listed publicly. Prompts admins with direct call and email shortcuts.
9. **Smart Auto-Matching Engine**: Compares student lost reports against found articles (category, keyword similarity, campus location, date) with match percentage score.
10. **Auto-Expiry Management**: Unclaimed articles beyond the holding period are flagged as Expired, with options to mark as Donated, Disposed, or sent to the MCET Welfare Fund.
11. **Weekly Batch Digest**: Aggregates all new unclaimed items into one weekly summary notification/email instead of sending individual alerts.
12. **Monthly Reports & Analytics**: Interactive charts showing top lost categories and campus loss hotspots, with export options to CSV and printable PDF.

### 3. Student Features
1. **Report a Found Item**: Text details only (**NO image upload** per privacy rules), category, time, and interactive Dr. MCET campus map pin.
2. **Browse Found Items**: Filterable grid of unclaimed items showing category, general location, and date. Sensitive details and sensitive items (ID cards) are hidden.
3. **Report a Lost Item**: Form with description, location map pin, and date lost (feeds into the auto-matching engine).
4. **Claim Request ("This is Mine")**: Student answers 1-2 ownership challenge questions set by the admin.
5. **Real-time Status Tracking**: Visual 4-step timeline (`Requested` → `Approved` → `Ready for Pickup` → `Collected`) with office pickup instructions.
6. **Notifications**: In-app alerts for claim approvals, auto-matches, and weekly digests.

---

## 🗺️ Campus Map (Dr. Mahalingam College Reference)

Based directly on the satellite and layout view of the campus:
- **Nachimuthu Polytechnic College (NPTC)**: Situated on the western campus sector.
- **Dr. MCET Main Academic Block**: Central administrative and engineering tower (`10.6629° N, 77.0105° E`).
- **INDIAN BANK & ATM**: On-campus banking branch and ATM (`10.6618° N, 77.0102° E`).
- **Block B**: Prominent academic building situated directly south of Indian Bank (`10.6612° N, 77.0103° E`).
- **Highway NH 83 / Udumalai Road**: Northern boundary featuring the main gate and public transit bus stop.
- **Centenary Central Library**: Eastern academic zone (`10.6635° N, 77.0112° E`).
- **Student Amenities & Canteen**: South-eastern dining area (`10.6620° N, 77.0118° E`).

Users can drop pins directly on the map, and the system automatically determines the nearest campus quadrant and auto-fills location details.

---

## 🚀 How to Run Immediately

The web app is completely self-contained in `index.html`. It runs immediately in any modern browser without needing Node.js or build steps!

### Option A: Direct Open in Browser
Double-click `index.html` or open it with your web browser (Chrome, Edge, Firefox, Safari).

### Option B: Local HTTP Server (Python / PowerShell)
Using Python:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🔑 Test Credentials (Pre-seeded Accounts)

You can use the 1-click test buttons on the login screen or enter these credentials:

| Role | Username / Identity | Google Email | Notes |
|---|---|---|---|
| **Office Admin** | `office1.admin` | `admin@mcet.in` | Pre-approved in `adminAllowlist`. Full administrative access. |
| **Estate Admin** | `estate.admin` | `estate@mcet.in` | Pre-approved in `adminAllowlist`. Campus custodian access. |
| **Student 1** | Priya S | `priya.s@mcet.in` | Roll: `727622BCS042` (CSE 3rd Yr). Has active claim for Milton Bottle. |
| **Student 2** | Karthik R | `karthik.r@mcet.in` | Roll: `727621BME019` (Mech 4th Yr). Has active lost report in Block B. |
| **New Student** | First-Time Login | `fresh.student@mcet.in` | Demonstrates the mandatory first-time profile form. |

---

## ☁️ Firebase & Google Sign-In Setup Guide

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `mcet-lost-found`.
3. Disable or enable Google Analytics as desired, then click **Create project**.

### 2. Enable Google Sign-In Authentication
1. In the Firebase console sidebar, navigate to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google**.
4. Enable the Google provider.
5. Set the **Support email for project** to your administrator email.
6. Click **Save**.
7. Under **Authorized domains**, ensure `localhost` and your production domain are listed.

### 3. Create Cloud Firestore Database
1. In the sidebar, navigate to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose your database location (e.g., `asia-south1` for Mumbai / India).
4. Start in **Production mode**.
5. Click **Create**.

### 4. Deploy Firestore Security Rules
Deploy the included [`firestore.rules`](./firestore.rules) file using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
Or paste the contents of `firestore.rules` directly into the Firebase Console (**Firestore Database > Rules** tab) and click **Publish**.

#### Key Security Constraints in `firestore.rules`:
- **Student Profile Privacy**: Students can read and update only their own document (`users/{uid}`). Admins have read access to all profiles.
- **Sensitive Items Quarantine**: Public items query filters out `isSensitive == true` and sensitive categories.
- **Permanent Handover Logs**: Handover log documents (`handoverLogs/{id}`) can only be created by admins and are strictly append-only (`allow update, delete: if false;`).

### 5. Deploy Cloud Functions
The functions in [`functions/index.js`](./functions/index.js) provide scheduled tasks and event triggers:
- `weeklyUnclaimedDigest`: Scheduled pub/sub function (runs every Monday at 9:00 AM IST) that aggregates unclaimed items from the past 7 days into a batch digest notification.
- `checkItemExpiry`: Daily scheduled function that marks unclaimed items older than `holdingPeriodDays` (default 45 days) as `Expired`.
- `onLostReportCreated`: Trigger that executes auto-matching scoring when a student files a lost report.

Deploy functions:
```bash
cd functions
npm install
firebase deploy --only functions
```

### 6. Import Sample Seed Data
To populate Firestore with the sample seed data in [`seed-data.json`](./seed-data.json):
```bash
# Using Firebase Admin SDK script or firestore-import-export CLI:
npx -p node-firestore-import-export firestore-import -a serviceAccountKey.json -b seed-data.json
```

---

## 📁 Project Structure

```
college-lost-found/
├── index.html                   # Complete responsive React + Tailwind application
├── firestore.rules              # Production Firestore security rules
├── seed-data.json               # Seed dataset with admins, students, items, claims
├── package.json                 # Dependencies for Vite / React modular development
├── campus-map-reference.jpg     # Calibrated reference screenshot of MCET campus
├── src/
│   ├── firebase.js              # Modular Firebase client configuration
│   └── campusMapData.js         # Landmark coordinates & campus boundaries
├── functions/
│   ├── package.json             # Cloud Functions dependencies
│   └── index.js                 # Scheduled weekly digest, expiry & auto-match triggers
└── README.md                    # Documentation & setup guide
```

---

## 🛡️ Privacy & Compliance Notice

- **Photo-Free Student Submissions**: In compliance with college privacy policies, student submissions are text-only to prevent unauthorized photography inside campus academic zones.
- **Sensitive Document Protection**: Personal identifiers such as ATM numbers and official certificates are strictly quarantined from public student feeds.
- **Permanent Handover Accountability**: All physical releases require staff username signatures, verified roll numbers, and physical College ID checks, recorded in an append-only log.
