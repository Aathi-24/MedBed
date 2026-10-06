# 🏥 MedBed — Smart Hospital Bed Management & Doctor Availability System
### 📍 Exclusively Powered for the Coimbatore Region, Tamil Nadu

Real-time hospital bed availability, Operation Theatre (OT) slots, Emergency Ward status, specialist doctor rosters, and turn-by-turn navigation for patients, 108 ambulance paramedic crews, and hospital administrators.

---

## ✨ Key Features & Capabilities

### 👤 Patients & Citizens
- **Zero Hardcoded Data**: All hospital bed numbers, emergency states, and doctor lists are dynamically loaded from the database.
- **Coimbatore Hospital Directory**: Automatically maps and calculates live driving distance (GPS-powered with Coimbatore Central fallback).
- **Search & Multi-filter**: Filter by hospital name, locality (Peelamedu, Saibaba Colony, RS Puram, Ramanathapuram, Neelambur), or specialty (Cardiology, Orthopaedics, Oncology, Neurology, Gastroenterology, Ophthalmology, etc.).
- **Live Bed Inventory**: Real-time breakdown of General Ward, AC Ward, and Private Suite bed availability.
- **Doctor Rosters & Schedules**: Filter specialists and check live **On Duty** status.
- **Interactive OpenStreetMap**: Integrated OpenStreetMap view + 1-click turn-by-turn navigation to Coimbatore hospitals.
- **Emergency Hotline**: Direct 1-click phone dialer for hospital casualty and reception desks.

### 🚑 Ambulance Paramedic Crews (108 Emergency)
- **Emergency Radar View**: Real-time **Operation Theatre (OT)** slot availability (Priority 1).
- **Trauma & Emergency Ward (EW)** triage capacity (Priority 2).
- **Emergency Intake Indicators**: Visual pulse indicators showing whether emergency intake is active or paused.
- **Instant Route Directions**: Direct driving directions with live distance in kilometers.

### 🏥 Hospital Administrators
- **Unified Admin Console**: Tailored management panel for Ganga, KMCH, PSG, Sri Ramakrishna, GKNM, Royal Care, CMCH, GEM, KG Hospital, Lotus Eye, Rex Ortho, and Aravind Eye Hospital.
- **Bed Inventory Controls**: Interactive `+`/`−` counters with safety constraints (`available <= total`).
- **Live Emergency & OT Management**: Instant publishing of available OT slots and Emergency Ward triage beds.
- **Emergency Intake Switch**: One-click toggle for 24/7 casualty status.
- **Doctor Roster CRUD**:
  - Add new doctors with specialty, qualification, experience, and shift hours.
  - Edit doctor details in real-time.
  - Quick toggle for On-Duty / Off-Duty status.
  - Remove doctor records with confirmation.
- **Hospital Profile Editor**: Update hospital contact info, address, and specialty tags.

---

## 🏥 Seeded Coimbatore Hospitals (12 Major Facilities)

1. **Ganga Hospital** (Mettupalayam Rd, Saibaba Colony) — Orthopaedics, Trauma & Plastic Surgery
2. **Kovai Medical Center and Hospital (KMCH)** (Avinashi Rd, Peelamedu) — Multi-Specialty & Organ Transplant
3. **PSG Hospitals** (Avinashi Rd, Peelamedu) — Super-Specialty Tertiary Care & Research
4. **Sri Ramakrishna Hospital** (Sarojini Naidu Rd, Siddhapudur) — Oncology, Cardiology & Nephrology
5. **G. Kuppuswamy Naidu Memorial Hospital (GKNM)** (P.N. Palayam) — Cardiology, Cardiothoracic & Pediatrics
6. **Royal Care Super Speciality Hospital** (L&T Bypass Rd, Neelambur) — Interventional Pulmonology & Critical Care
7. **Coimbatore Medical College Hospital (CMCH)** (Trichy Rd, Gopalapuram) — 24/7 Govt. Emergency Trauma Care
8. **GEM Hospital & Research Centre** (Pankaja Mill Rd, Ramanathapuram) — Gastroenterology & Laparoscopic Surgery
9. **KG Hospital** (Arts College Rd) — Dialysis, Cardiac Catheterization & Eye Bank
10. **Lotus Eye Hospital and Institute** (Avinashi Rd, Civil Aerodrome Post) — Ophthalmology & Lasik
11. **Rex Ortho Hospital** (Bharathi Park 2nd Cross, Saibaba Colony) — Joint Replacement & Sports Medicine
12. **Aravind Eye Hospital** (Avinashi Rd, Peelamedu) — Comprehensive Eye Care & Retina Clinic

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Glassmorphism Design System |
| **3D Animations** | Three.js, React Three Fiber, Drei |
| **Motion Effects** | Framer Motion |
| **Maps & Navigation** | Leaflet / OpenStreetMap + External Directions Integration |
| **Backend API** | Node.js + Express.js |
| **Database** | MongoDB (Fullstack) / Client-side DB Sync + Firebase Firestore |
| **Authentication** | JWT (JSON Web Tokens) with Role-Based Access Control |
| **Hosting Compatibility** | Firebase Hosting Ready (`firebase.json` SPA routing) |

---

## 📁 Project Structure

```
medbed/
├── firebase.json             # Firebase Hosting rewrite & deployment config
├── .firebaserc               # Firebase project mapping
├── package.json              # Monorepo root scripts
│
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (patient / ambulance / hospital)
│   │   ├── Hospital.js       # Hospital schema with geo-coordinates & beds
│   │   └── Doctor.js         # Doctor schema with shifts & specialties
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Me endpoints
│   │   ├── hospitals.js      # Filtered search, details, bed & OT updates
│   │   ├── doctors.js        # Doctor CRUD & availability toggles
│   │   └── beds.js           # Bed data routes
│   ├── middleware/
│   │   └── authMiddleware.js # Token authentication & role authorization
│   ├── seed/
│   │   ├── seed.js           # Coimbatore region seed script
│   │   └── coimbatore_seed_data.json # Database snapshot
│   ├── .env                  # Environment configuration
│   └── server.js             # Express API entry point
│
└── frontend/
    ├── public/               # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── common/       # Navbar, PageTransition, LoadingSpinner
    │   │   ├── three/        # Interactive 3D medical scene
    │   │   ├── hospital/     # HospitalCard, HospitalMap, DoctorCard
    │   │   └── admin/        # BedCounter, AdminDoctorRow
    │   ├── context/          # AuthContext, LocationContext
    │   ├── data/             # coimbatoreDatabase.json
    │   ├── hooks/            # useHospitals, useDoctors
    │   ├── pages/            # LandingPage, HospitalsPage, HospitalDetailPage, AdminPage, etc.
    │   ├── services/
    │   │   ├── api.js        # Axios instance
    │   │   ├── db.js         # Unified Database adapter (API + LocalDB fallback)
    │   │   ├── firebase.js   # Firebase Client SDK & Firestore instance
    │   │   └── hospitalService.js # Hospital service layer
    │   └── utils/            # Formatting & distance helpers
    ├── dist/                 # Production build bundle for Firebase Hosting
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment (Optional for Local MongoDB)
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medbed
JWT_SECRET=medbed_super_secret_key_2024
NODE_ENV=development
```

### 3. Seed Coimbatore Database
```bash
npm run seed
```

### 4. Start Development Servers
```bash
npm run start
# Or start individually:
npm run dev:backend   # Express API on http://localhost:5000
npm run dev:frontend  # Vite React App on http://localhost:5173
```

---

## 🔥 Step-by-Step Guide: How to Host on Firebase

Firebase Hosting provides fast, secure hosting for the MedBed Single-Page Application (SPA) with automated SSL certificates and global CDN delivery.

### Step 1: Install Firebase CLI
If you don't already have Firebase CLI installed on your computer, open your terminal / PowerShell and run:
```bash
npm install -g firebase-tools
```

### Step 2: Log in to Firebase
Authenticate with your Google/Firebase account:
```bash
firebase login
```
*(This opens a browser window for you to select and authorize your Google account).*

### Step 3: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or **Create a Project**).
3. Name your project (e.g., `medbed-coimbatore`).
4. Disable or enable Google Analytics (optional), then click **Create Project**.

### Step 4: Link Your Project to Firebase
In the root directory (`a:/medbed_app/medbed`), initialize or link your Firebase project:
```bash
firebase use --add
```
Select the project you created in Step 3, or set an alias name such as `default`.

> **Note:** The repository already contains a configured `firebase.json` with Single-Page Application rewrites:
> ```json
> {
>   "hosting": {
>     "public": "frontend/dist",
>     "ignore": [
>       "firebase.json",
>       "**/.*",
>       "**/node_modules/**"
>     ],
>     "rewrites": [
>       {
>         "source": "**",
>         "destination": "/index.html"
>       }
>     ]
>   }
> }
> ```

### Step 5: Build the Production Bundle
Compile the optimized frontend build:
```bash
npm run build
```
This generates the production-ready distribution files inside `frontend/dist/`.

### Step 6: Deploy to Firebase Hosting
Run the deploy command:
```bash
firebase deploy --only hosting
```

### Step 7: View Your Live Application! 🎉
Upon successful deployment, Firebase CLI outputs your live hosting URL:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/medbed-coimbatore/overview
Hosting URL: https://medbed-coimbatore.web.app
```
Open that URL in any browser or mobile device to test your live Coimbatore MedBed application.

---

## 🔐 1-Click Coimbatore Demo Logins

The application includes built-in 1-click demo accounts on the Login page and Landing page:

| Role | Email | Password | Access & Permissions |
|---|---|---|---|
| 👤 **Patient User** | `karthik@medbed.com` | `user123` | Search Coimbatore hospitals, view beds & doctors |
| 🚑 **108 Ambulance** | `driver@medbed.com` | `driver123` | Priority OT & Emergency triage radar view |
| 🏥 **Ganga Admin** | `ganga@medbed.com` | `hospital123` | Manage Ganga Hospital bed counts & doctor roster |
| 🏥 **KMCH Admin** | `kmch@medbed.com` | `hospital123` | Manage KMCH Avinashi Rd bed inventory & doctors |
| 🏥 **PSG Admin** | `psg@medbed.com` | `hospital123` | Manage PSG Hospitals Peelamedu operations |
| 🏥 **Ramakrishna Admin** | `ramakrishna@medbed.com` | `hospital123` | Manage Sri Ramakrishna Hospital console |

---

## 🔌 API Reference Summary

### Authentication
- `POST /api/auth/register` — Register user / ambulance / hospital admin (with hospital binding)
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Hospitals
- `GET /api/hospitals` — List Coimbatore hospitals with filter queries (`lat`, `lng`, `search`, `specialty`, `emergencyOnly`)
- `GET /api/hospitals/:id` — Get single hospital details, bed inventory, and OT status
- `PUT /api/hospitals/:id/beds` — Update General, AC, and Private bed counts (Admin only)
- `PUT /api/hospitals/:id/ot` — Update Operation Theatre slots (Admin only)
- `PUT /api/hospitals/:id/emergency` — Update Emergency Ward triage capacity (Admin only)
- `PUT /api/hospitals/:id/emergency-status` — Toggle emergency intake active/paused (Admin only)
- `PUT /api/hospitals/:id/info` — Update hospital contact details and specialty tags (Admin only)

### Doctors
- `GET /api/doctors` — List doctors with query filters (`hospitalId`, `specialty`, `availableOnly`)
- `GET /api/doctors/:id` — Retrieve single doctor schedule & details
- `POST /api/doctors` — Create new doctor record (Admin only)
- `PUT /api/doctors/:id` — Update doctor profile and qualifications (Admin only)
- `PUT /api/doctors/:id/availability` — Toggle doctor on-duty status & shift times (Admin only)
- `DELETE /api/doctors/:id` — Remove doctor record from roster (Admin only)

---

## 📄 License
MIT License — Free to use, customize, and deploy.
