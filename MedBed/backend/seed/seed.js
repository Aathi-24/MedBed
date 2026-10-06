const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

const coimbatoreHospitalsData = [
  {
    name: 'Ganga Hospital',
    address: '333, Mettupalayam Road, Saibaba Colony, Coimbatore, Tamil Nadu 641043',
    phone: '+91-422-248-5000',
    email: 'admin@gangahospital.com',
    location: { type: 'Point', coordinates: [76.9502, 11.0285] },
    emergencyOpen: true,
    beds: {
      general: { available: 85, total: 150 },
      acWard: { available: 40, total: 80 },
      private: { available: 20, total: 40 }
    },
    operationTheatre: { available: 4, total: 14, occupied: 10 },
    emergencyWard: { available: 18, total: 30, occupied: 12 },
    rating: 4.9,
    specialties: ['Orthopedics', 'Trauma & Spine Surgery', 'Plastic Surgery', 'Emergency Medicine', 'Reconstructive Microsurgery']
  },
  {
    name: 'Kovai Medical Center and Hospital (KMCH)',
    address: '99, Avinashi Rd, Civil Aerodrome Post, Peelamedu, Coimbatore, Tamil Nadu 641014',
    phone: '+91-422-432-3800',
    email: 'admin@kmch.in',
    location: { type: 'Point', coordinates: [77.0396, 11.0375] },
    emergencyOpen: true,
    beds: {
      general: { available: 120, total: 280 },
      acWard: { available: 65, total: 140 },
      private: { available: 30, total: 70 }
    },
    operationTheatre: { available: 6, total: 18, occupied: 12 },
    emergencyWard: { available: 22, total: 40, occupied: 18 },
    rating: 4.8,
    specialties: ['Cardiology', 'Organ Transplant', 'Oncology', 'Neurology', 'Gastroenterology', 'Emergency Medicine']
  },
  {
    name: 'PSG Hospitals',
    address: 'Peelamedu, Avinashi Road, Coimbatore, Tamil Nadu 641004',
    phone: '+91-422-257-0170',
    email: 'admin@psghospitals.com',
    location: { type: 'Point', coordinates: [77.0042, 11.0264] },
    emergencyOpen: true,
    beds: {
      general: { available: 140, total: 320 },
      acWard: { available: 50, total: 110 },
      private: { available: 25, total: 55 }
    },
    operationTheatre: { available: 5, total: 16, occupied: 11 },
    emergencyWard: { available: 20, total: 35, occupied: 15 },
    rating: 4.7,
    specialties: ['Cardiology', 'Neurology', 'Emergency Medicine', 'General Surgery', 'Pediatrics', 'Nephrology']
  },
  {
    name: 'Sri Ramakrishna Hospital',
    address: '395, Sarojini Naidu Rd, Sidhapudur, Coimbatore, Tamil Nadu 641044',
    phone: '+91-422-450-0000',
    email: 'admin@sriramakrishnahospital.com',
    location: { type: 'Point', coordinates: [76.9734, 11.0189] },
    emergencyOpen: true,
    beds: {
      general: { available: 90, total: 220 },
      acWard: { available: 45, total: 95 },
      private: { available: 18, total: 45 }
    },
    operationTheatre: { available: 3, total: 10, occupied: 7 },
    emergencyWard: { available: 14, total: 25, occupied: 11 },
    rating: 4.6,
    specialties: ['Cardiology', 'Oncology', 'General Surgery', 'Urology', 'Orthopedics']
  },
  {
    name: 'G. Kuppuswamy Naidu Memorial Hospital (GKNM)',
    address: 'Post Box No. 6327, P.N. Palayam, Coimbatore, Tamil Nadu 641037',
    phone: '+91-422-224-5000',
    email: 'admin@gknmhospital.org',
    location: { type: 'Point', coordinates: [76.9808, 11.0135] },
    emergencyOpen: true,
    beds: {
      general: { available: 110, total: 260 },
      acWard: { available: 48, total: 100 },
      private: { available: 22, total: 50 }
    },
    operationTheatre: { available: 4, total: 12, occupied: 8 },
    emergencyWard: { available: 16, total: 28, occupied: 12 },
    rating: 4.8,
    specialties: ['Cardiology', 'Pediatrics', 'Obstetrics & Gynecology', 'Oncology', 'Cardiothoracic Surgery']
  },
  {
    name: 'Royal Care Super Speciality Hospital',
    address: '1/520, L&T Bypass Road, Neelambur, Coimbatore, Tamil Nadu 641062',
    phone: '+91-422-222-7000',
    email: 'admin@royalcarehospital.in',
    location: { type: 'Point', coordinates: [77.0863, 11.0664] },
    emergencyOpen: true,
    beds: {
      general: { available: 75, total: 180 },
      acWard: { available: 38, total: 80 },
      private: { available: 16, total: 35 }
    },
    operationTheatre: { available: 3, total: 9, occupied: 6 },
    emergencyWard: { available: 12, total: 22, occupied: 10 },
    rating: 4.7,
    specialties: ['Emergency Medicine', 'Interventional Cardiology', 'Nephrology', 'Critical Care', 'Pulmonology']
  },
  {
    name: 'Coimbatore Medical College Hospital (CMCH)',
    address: 'Trichy Rd, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    phone: '+91-422-230-1393',
    email: 'admin@cmchcoimbatore.tn.gov.in',
    location: { type: 'Point', coordinates: [76.9685, 10.9995] },
    emergencyOpen: true,
    beds: {
      general: { available: 180, total: 450 },
      acWard: { available: 30, total: 60 },
      private: { available: 10, total: 20 }
    },
    operationTheatre: { available: 5, total: 15, occupied: 10 },
    emergencyWard: { available: 25, total: 50, occupied: 25 },
    rating: 4.4,
    specialties: ['Emergency Medicine', 'General Surgery', 'Internal Medicine', 'Trauma Care', 'Pediatrics']
  },
  {
    name: 'GEM Hospital & Research Centre',
    address: '45-A, Pankaja Mill Rd, Ramanathapuram, Coimbatore, Tamil Nadu 641045',
    phone: '+91-422-232-5100',
    email: 'admin@gemhospital.com',
    location: { type: 'Point', coordinates: [76.9936, 10.9967] },
    emergencyOpen: true,
    beds: {
      general: { available: 50, total: 120 },
      acWard: { available: 28, total: 60 },
      private: { available: 15, total: 30 }
    },
    operationTheatre: { available: 2, total: 8, occupied: 6 },
    emergencyWard: { available: 10, total: 18, occupied: 8 },
    rating: 4.8,
    specialties: ['Gastroenterology', 'Laparoscopic Surgery', 'Liver Care', 'GI Oncology', 'Endoscopy']
  },
  {
    name: 'KG Hospital',
    address: 'Govt Hospital Rd, Arts College, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    phone: '+91-422-221-2121',
    email: 'admin@kghospital.com',
    location: { type: 'Point', coordinates: [76.9698, 11.0021] },
    emergencyOpen: true,
    beds: {
      general: { available: 60, total: 140 },
      acWard: { available: 30, total: 65 },
      private: { available: 12, total: 28 }
    },
    operationTheatre: { available: 2, total: 7, occupied: 5 },
    emergencyWard: { available: 9, total: 16, occupied: 7 },
    rating: 4.5,
    specialties: ['Cardiology', 'Critical Care', 'Dialysis', 'Neurology', 'Accident & Trauma']
  },
  {
    name: 'Lotus Eye Hospital and Institute',
    address: '770/12, Avinashi Rd, Civil Aerodrome Post, Peelamedu, Coimbatore, Tamil Nadu 641014',
    phone: '+91-422-422-9900',
    email: 'admin@lotuseye.org',
    location: { type: 'Point', coordinates: [77.0267, 11.0312] },
    emergencyOpen: true,
    beds: {
      general: { available: 35, total: 70 },
      acWard: { available: 18, total: 35 },
      private: { available: 8, total: 15 }
    },
    operationTheatre: { available: 3, total: 6, occupied: 3 },
    emergencyWard: { available: 6, total: 10, occupied: 4 },
    rating: 4.6,
    specialties: ['Ophthalmology', 'Cataract & Lasik', 'Cornea', 'Retina Care', 'Eye Trauma']
  },
  {
    name: 'Rex Ortho Hospital',
    address: '43, Bharathi Park Rd, Saibaba Colony, Coimbatore, Tamil Nadu 641011',
    phone: '+91-422-244-4888',
    email: 'admin@rexortho.com',
    location: { type: 'Point', coordinates: [76.9442, 11.0221] },
    emergencyOpen: true,
    beds: {
      general: { available: 40, total: 85 },
      acWard: { available: 20, total: 45 },
      private: { available: 10, total: 20 }
    },
    operationTheatre: { available: 2, total: 5, occupied: 3 },
    emergencyWard: { available: 8, total: 14, occupied: 6 },
    rating: 4.7,
    specialties: ['Orthopedics', 'Joint Replacement', 'Arthroscopy', 'Sports Injury', 'Spine Care']
  },
  {
    name: 'Aravind Eye Hospital',
    address: 'Avinashi Rd, Opp. to Jaganatha Perumal Kovil, Peelamedu, Coimbatore, Tamil Nadu 641014',
    phone: '+91-422-436-0400',
    email: 'admin@aravind.org',
    location: { type: 'Point', coordinates: [77.0175, 11.0298] },
    emergencyOpen: false,
    beds: {
      general: { available: 80, total: 160 },
      acWard: { available: 35, total: 70 },
      private: { available: 15, total: 30 }
    },
    operationTheatre: { available: 4, total: 8, occupied: 4 },
    emergencyWard: { available: 10, total: 15, occupied: 5 },
    rating: 4.9,
    specialties: ['Ophthalmology', 'Glaucoma', 'Pediatric Ophthalmology', 'Retina', 'Cornea']
  }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/medbed';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing collections
    await User.deleteMany();
    await Hospital.deleteMany();
    await Doctor.deleteMany();
    console.log('🗑️  Cleared old records');

    // Insert Coimbatore Hospitals
    const hospitals = await Hospital.insertMany(coimbatoreHospitalsData);
    console.log(`✅ Seeded ${hospitals.length} Coimbatore hospitals into the database`);

    // Map IDs
    const gangaId = hospitals[0]._id;
    const kmchId = hospitals[1]._id;
    const psgId = hospitals[2]._id;
    const ramakrishnaId = hospitals[3]._id;
    const gknmId = hospitals[4]._id;
    const royalCareId = hospitals[5]._id;
    const cmchId = hospitals[6]._id;
    const gemId = hospitals[7]._id;
    const kgId = hospitals[8]._id;
    const lotusId = hospitals[9]._id;
    const rexId = hospitals[10]._id;
    const aravindId = hospitals[11]._id;

    // Insert 35+ Doctors across Coimbatore Hospitals
    const doctorsData = [
      // Ganga Hospital Doctors
      {
        name: 'Dr. S. Rajasekaran',
        specialty: 'Trauma & Spine Surgery',
        hospitalId: gangaId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-10001',
        qualification: 'MS (Ortho), MCh, FRCS, PhD',
        experience: 30
      },
      {
        name: 'Dr. S. Raja Sabapathy',
        specialty: 'Plastic Surgery',
        hospitalId: gangaId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-10002',
        qualification: 'MS, MCh (Plastic), DNB, FRCS',
        experience: 28
      },
      {
        name: 'Dr. J. Dheenadhayalan',
        specialty: 'Orthopedics',
        hospitalId: gangaId,
        available: false,
        shiftStart: '04:00 PM',
        shiftEnd: '12:00 AM',
        phone: '+91-98422-10003',
        qualification: 'MS (Ortho), DNB (Ortho)',
        experience: 22
      },
      {
        name: 'Dr. Ajoy Prasad Shetty',
        specialty: 'Spine Surgery',
        hospitalId: gangaId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '06:00 PM',
        phone: '+91-98422-10004',
        qualification: 'MS (Ortho), DNB, Spine Fellowship',
        experience: 20
      },
      {
        name: 'Dr. Harish K.',
        specialty: 'Emergency Medicine',
        hospitalId: gangaId,
        available: true,
        shiftStart: '07:00 AM',
        shiftEnd: '07:00 PM',
        phone: '+91-98422-10005',
        qualification: 'MD (Emergency Medicine)',
        experience: 11
      },

      // KMCH Doctors
      {
        name: 'Dr. Nalla G. Palaniswami',
        specialty: 'Internal Medicine',
        hospitalId: kmchId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-20001',
        qualification: 'MD, AB (USA), FACP',
        experience: 35
      },
      {
        name: 'Dr. Thomas Alexander',
        specialty: 'Cardiology',
        hospitalId: kmchId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-20002',
        qualification: 'MD, DM, FACC, FSCAI',
        experience: 26
      },
      {
        name: 'Dr. Mathew Cherian',
        specialty: 'Interventional Radiology',
        hospitalId: kmchId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-20003',
        qualification: 'MD, DMRD, DNB',
        experience: 24
      },
      {
        name: 'Dr. K. Senthil Kumar',
        specialty: 'Neurology',
        hospitalId: kmchId,
        available: false,
        shiftStart: '06:00 PM',
        shiftEnd: '02:00 AM',
        phone: '+91-98422-20004',
        qualification: 'MD, DM (Neurology)',
        experience: 16
      },
      {
        name: 'Dr. Archana Pillai',
        specialty: 'Oncology',
        hospitalId: kmchId,
        available: true,
        shiftStart: '10:00 AM',
        shiftEnd: '06:00 PM',
        phone: '+91-98422-20005',
        qualification: 'MD (RT), DNB (Medical Oncology)',
        experience: 14
      },

      // PSG Hospitals Doctors
      {
        name: 'Dr. J.S. Bhuvaneswaran',
        specialty: 'Cardiology',
        hospitalId: psgId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-30001',
        qualification: 'MD, DM (Cardio), FACC',
        experience: 25
      },
      {
        name: 'Dr. T. Pavithran',
        specialty: 'Emergency Medicine',
        hospitalId: psgId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '08:00 PM',
        phone: '+91-98422-30002',
        qualification: 'MBBS, MD (Emergency)',
        experience: 12
      },
      {
        name: 'Dr. S. Balaji',
        specialty: 'Nephrology',
        hospitalId: psgId,
        available: false,
        shiftStart: '02:00 PM',
        shiftEnd: '10:00 PM',
        phone: '+91-98422-30003',
        qualification: 'MD, DM (Nephro)',
        experience: 15
      },
      {
        name: 'Dr. R. Kannan',
        specialty: 'General Surgery',
        hospitalId: psgId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-30004',
        qualification: 'MS, DNB, FMAS',
        experience: 18
      },

      // Sri Ramakrishna Hospital Doctors
      {
        name: 'Dr. S. Manoharan',
        specialty: 'Cardiology',
        hospitalId: ramakrishnaId,
        available: true,
        shiftStart: '08:30 AM',
        shiftEnd: '04:30 PM',
        phone: '+91-98422-40001',
        qualification: 'MD, DM (Cardiology)',
        experience: 21
      },
      {
        name: 'Dr. P. Guhan',
        specialty: 'Oncology',
        hospitalId: ramakrishnaId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-40002',
        qualification: 'MD, DNB (Medical Oncology)',
        experience: 23
      },
      {
        name: 'Dr. V. Rajesh',
        specialty: 'Urology',
        hospitalId: ramakrishnaId,
        available: false,
        shiftStart: '05:00 PM',
        shiftEnd: '01:00 AM',
        phone: '+91-98422-40003',
        qualification: 'MS, MCh (Urology)',
        experience: 13
      },

      // GKNM Hospital Doctors
      {
        name: 'Dr. Rajan Srinivasan',
        specialty: 'Cardiothoracic Surgery',
        hospitalId: gknmId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-50001',
        qualification: 'MS, MCh (CTVS)',
        experience: 24
      },
      {
        name: 'Dr. Kalyani Menon',
        specialty: 'Pediatrics',
        hospitalId: gknmId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-50002',
        qualification: 'MD (Pediatrics), DCH',
        experience: 17
      },
      {
        name: 'Dr. Subhashini K.',
        specialty: 'Obstetrics & Gynecology',
        hospitalId: gknmId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-50003',
        qualification: 'DGO, DNB (OG)',
        experience: 19
      },

      // Royal Care Doctors
      {
        name: 'Dr. K. Madeswaran',
        specialty: 'Interventional Cardiology',
        hospitalId: royalCareId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-60001',
        qualification: 'MD, DM, FESC',
        experience: 27
      },
      {
        name: 'Dr. V. Paranthaman',
        specialty: 'Pulmonology',
        hospitalId: royalCareId,
        available: false,
        shiftStart: '04:00 PM',
        shiftEnd: '12:00 AM',
        phone: '+91-98422-60002',
        qualification: 'DTCD, MD (Pulmonology)',
        experience: 15
      },
      {
        name: 'Dr. S. Selvakumar',
        specialty: 'Emergency Medicine',
        hospitalId: royalCareId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '08:00 PM',
        phone: '+91-98422-60003',
        qualification: 'MEM, MD (Emergency)',
        experience: 9
      },

      // CMCH Doctors
      {
        name: 'Dr. R. Soundararajan',
        specialty: 'Emergency Medicine',
        hospitalId: cmchId,
        available: true,
        shiftStart: '07:00 AM',
        shiftEnd: '03:00 PM',
        phone: '+91-98422-70001',
        qualification: 'MBBS, MD',
        experience: 16
      },
      {
        name: 'Dr. M. Sasikumar',
        specialty: 'General Surgery',
        hospitalId: cmchId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-70002',
        qualification: 'MS (General Surgery)',
        experience: 14
      },

      // GEM Hospital Doctors
      {
        name: 'Dr. C. Palanivelu',
        specialty: 'Gastroenterology',
        hospitalId: gemId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-80001',
        qualification: 'MS, MCh, FACS, FRCS',
        experience: 32
      },
      {
        name: 'Dr. P. Senthilnathan',
        specialty: 'Laparoscopic Surgery',
        hospitalId: gemId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        phone: '+91-98422-80002',
        qualification: 'MS, DNB, FMAS',
        experience: 18
      },

      // KG Hospital Doctors
      {
        name: 'Dr. G. Bakthavathsalam',
        specialty: 'Cardiology',
        hospitalId: kgId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-90001',
        qualification: 'MS, FICS, FCCP, FAMS',
        experience: 38
      },
      {
        name: 'Dr. R. Murugan',
        specialty: 'Critical Care',
        hospitalId: kgId,
        available: true,
        shiftStart: '08:00 AM',
        shiftEnd: '08:00 PM',
        phone: '+91-98422-90002',
        qualification: 'MD (Anesthesia), IDCCM',
        experience: 11
      },

      // Lotus Eye Hospital Doctors
      {
        name: 'Dr. S.K. Sundaramoorthy',
        specialty: 'Ophthalmology',
        hospitalId: lotusId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-91001',
        qualification: 'DO, DNB, FRCS (Edin)',
        experience: 29
      },

      // Rex Ortho Hospital Doctors
      {
        name: 'Dr. C. Rex',
        specialty: 'Orthopedics',
        hospitalId: rexId,
        available: true,
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-92001',
        qualification: 'MS (Ortho), MCh, FRCS (Tr & Orth)',
        experience: 25
      },

      // Aravind Eye Hospital Doctors
      {
        name: 'Dr. V. Narendran',
        specialty: 'Ophthalmology',
        hospitalId: aravindId,
        available: false,
        shiftStart: '08:30 AM',
        shiftEnd: '05:00 PM',
        phone: '+91-98422-93001',
        qualification: 'DO, DNB, Retina Specialist',
        experience: 26
      }
    ];

    const seededDoctors = await Doctor.insertMany(doctorsData);
    console.log(`✅ Seeded ${seededDoctors.length} specialist doctors across Coimbatore hospitals`);

    // Create Coimbatore Demo Users
    const hashedPass = async (pass) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(pass, salt);
    };

    const usersData = [
      {
        name: 'Karthik (Citizen / Patient)',
        email: 'karthik@medbed.com',
        password: await hashedPass('user123'),
        role: 'user'
      },
      {
        name: 'Senthil (108 Ambulance Dispatcher)',
        email: 'driver@medbed.com',
        password: await hashedPass('driver123'),
        role: 'ambulance'
      },
      {
        name: 'Ganga Hospital Admin',
        email: 'ganga@medbed.com',
        password: await hashedPass('hospital123'),
        role: 'hospital',
        hospitalId: gangaId
      },
      {
        name: 'KMCH Admin',
        email: 'kmch@medbed.com',
        password: await hashedPass('hospital123'),
        role: 'hospital',
        hospitalId: kmchId
      },
      {
        name: 'PSG Hospitals Admin',
        email: 'psg@medbed.com',
        password: await hashedPass('hospital123'),
        role: 'hospital',
        hospitalId: psgId
      },
      {
        name: 'Sri Ramakrishna Admin',
        email: 'ramakrishna@medbed.com',
        password: await hashedPass('hospital123'),
        role: 'hospital',
        hospitalId: ramakrishnaId
      }
    ];

    const users = await User.insertMany(usersData, { validateBeforeSave: false });
    console.log(`✅ Seeded ${users.length} Coimbatore user & hospital admin accounts`);

    // Also export JSON backup for Firebase Firestore import
    const exportData = {
      hospitals: hospitals.map(h => h.toObject()),
      doctors: seededDoctors.map(d => d.toObject()),
      users: users.map(u => ({ ...u.toObject(), password: 'hashed' }))
    };

    const jsonPath = path.join(__dirname, 'coimbatore_seed_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));
    console.log(`💾 Exported Firestore/Firebase-ready database snapshot to ${jsonPath}`);

    console.log('\n🎉 Coimbatore Database Seed Completed Successfully!');
    console.log('──────────────────────────────────────────────────────');
    console.log('📍 Region: Coimbatore, Tamil Nadu (12 Major Hospitals)');
    console.log('👤 Patient User    → karthik@medbed.com / user123');
    console.log('🚑 108 Ambulance   → driver@medbed.com / driver123');
    console.log('🏥 Ganga Admin     → ganga@medbed.com / hospital123');
    console.log('🏥 KMCH Admin      → kmch@medbed.com / hospital123');
    console.log('🏥 PSG Admin       → psg@medbed.com / hospital123');
    console.log('🏥 Ramakrishna Ad. → ramakrishna@medbed.com / hospital123');
    console.log('──────────────────────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
