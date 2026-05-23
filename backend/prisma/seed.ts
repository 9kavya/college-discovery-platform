import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const collegeCount = await prisma.college.count();
  if (collegeCount > 0) {
    console.log(`Database already has ${collegeCount} colleges. Skipping seed.`);
    return;
  }

  console.log('Seeding default user...');
  const hashedPassword = await bcrypt.hash('change_this_immediately', 10);
  const defaultUser = await prisma.user.upsert({
    where: {
      email: 'trisha@gmail.com',
    },
    update: {
      name: 'Trisha',
      password: hashedPassword,
    },
    create: {
      name: 'Trisha',
      email: 'trisha@gmail.com',
      password: hashedPassword,
    },
  });
  console.log(`Default user created: ${defaultUser.email}`);

  console.log('Seeding colleges...');

  const collegesData = [
    // --- KARNATAKA (15 colleges) ---
    {
      name: 'Indian Institute of Science (IISc), Bangalore',
      description: 'IISc is a premier public research university for higher education and scientific research in Bangalore. Established in 1909 with active support from Jamsetji Tata, it is ranked among the finest academic institutions in the world.',
      location: 'Bangalore, Karnataka',
      fees: 45000,
      placementRate: 98.5,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.iisc.ac.in',
      email: 'admissions@iisc.ac.in',
      phone: '+91 80 2293 2004',
      established: 1909,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Research Labs', 'Supercomputing Center', 'Auditorium'],
      courses: {
        create: [
          { name: 'Bachelor of Science (Research)', duration: 4, fees: 45000 },
          { name: 'M.Tech Computer Science & Engineering', duration: 2, fees: 60000 },
          { name: 'M.Tech Microelectronics & VLSI Design', duration: 2, fees: 60000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Undoubtedly the best research environment in India. Extremely helpful faculty and peers.', userName: 'Satish Dhawan' }
        ]
      }
    },
    {
      name: 'National Institute of Technology Karnataka (NITK), Surathkal',
      description: 'NITK Surathkal is a premier public engineering university located in Mangalore, Karnataka. It has its own private beach and boasts excellent placement statistics, particularly in Computer Science and Core Engineering fields.',
      location: 'Surathkal, Karnataka',
      fees: 145000,
      placementRate: 93.4,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.nitk.ac.in',
      email: 'admissions@nitk.edu.in',
      phone: '+91 82 4247 4000',
      established: 1960,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Private Beach', 'Sports Complex', 'Computing Center'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 145000 },
          { name: 'B.Tech Electronics & Comm. Engineering', duration: 4, fees: 145000 },
          { name: 'B.Tech Information Technology', duration: 4, fees: 145000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Life at NITK is unmatched. The beach is a great place to relax, and the coding culture is elite.', userName: 'Nikhil Gowda' }
        ]
      }
    },
    {
      name: 'Manipal Institute of Technology (MIT), Manipal',
      description: 'MIT Manipal is a leading private engineering college situated in the university town of Manipal, Karnataka. It offers world-class infrastructure, a highly active student culture, and excellent corporate relationships.',
      location: 'Manipal, Karnataka',
      fees: 335000,
      placementRate: 85.0,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://manipal.edu/mit.html',
      email: 'admissions@manipal.edu',
      phone: '+91 92 4048 2000',
      established: 1957,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Indoor Sports Complex', 'Food Court', 'Innovation Center'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 335000 },
          { name: 'B.Tech Data Science & Artificial Intelligence', duration: 4, fees: 335000 },
          { name: 'B.Tech Computer & Communication Engineering', duration: 4, fees: 335000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Premium facilities and very diverse student crowd. Hostels are super comfortable.', userName: 'Varun Sen' }
        ]
      }
    },
    {
      name: 'RV College of Engineering (RVCE), Bangalore',
      description: 'RVCE is a private technical co-educational college in Bangalore, Karnataka. Known for having one of the highest placement records among private colleges in Karnataka, particularly in computer science specialities.',
      location: 'Bangalore, Karnataka',
      fees: 250000,
      placementRate: 90.2,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://rvce.edu.in',
      email: 'principal@rvce.edu.in',
      phone: '+91 80 6717 8021',
      established: 1963,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Sports Arena', 'Industrial Labs', 'Auditorium'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 250000 },
          { name: 'B.E. Information Science & Engineering', duration: 4, fees: 250000 },
          { name: 'B.E. Electronics & Communication', duration: 4, fees: 230000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Placements are at par with newer NITs. The campus is compact but fully functional.', userName: 'Sneha Hegde' }
        ]
      }
    },
    {
      name: 'PES University (PESU), Bangalore',
      description: 'PES University is a prominent private university in Bangalore, Karnataka, focusing on science, technology, management, and law. Its academic curriculum is rigorously updated to meet industry standards.',
      location: 'Bangalore, Karnataka',
      fees: 380000,
      placementRate: 88.5,
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://pes.edu',
      email: 'admissions@pes.edu',
      phone: '+91 80 2672 1983',
      established: 1972,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Basketball Court', 'Cafeteria', 'Digital Studios'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 380000 },
          { name: 'B.Tech Electronics & Comm. Engineering', duration: 4, fees: 360000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Very strict academic curriculum and exams, but placements are great if you clear cutoffs.', userName: 'Pavan Kumar' }
        ]
      }
    },
    {
      name: 'BMS College of Engineering (BMSCE), Bangalore',
      description: 'BMSCE is a government-aided private engineering college located in Basavanagudi, Bangalore. Established in 1946, it is the first private initiative in technical education in India.',
      location: 'Bangalore, Karnataka',
      fees: 220000,
      placementRate: 86.4,
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://bmsce.ac.in',
      email: 'info@bmsce.ac.in',
      phone: '+91 80 2662 2130',
      established: 1946,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Indoor Sports Complex', 'Seminar Halls'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 220000 },
          { name: 'B.E. Mechanical Engineering', duration: 4, fees: 200000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Located in the heart of Bangalore. Very friendly faculty and active student clubs.', userName: 'Rahul K.' }
        ]
      }
    },
    {
      name: 'M.S. Ramaiah Institute of Technology (MSRIT), Bangalore',
      description: 'MSRIT is an autonomous private engineering college affiliated with VTU, located in Bangalore, Karnataka. It has earned excellent rankings for engineering education and industry collaborations.',
      location: 'Bangalore, Karnataka',
      fees: 240000,
      placementRate: 85.8,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://msrit.edu',
      email: 'admissions@msrit.edu',
      phone: '+91 80 2360 0822',
      established: 1962,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Research Center', 'Sports Complex', 'Auditorium'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 240000 },
          { name: 'B.E. Civil Engineering', duration: 4, fees: 200000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Great peer learning. Ramaiah brand has strong value across South India.', userName: 'Aravind Swamy' }
        ]
      }
    },
    {
      name: 'International Institute of Information Technology (IIIT), Bangalore',
      description: 'IIIT Bangalore is a registered public-private partnership graduate school in Bangalore, Karnataka. It is highly selective and renowned for post-graduate education and elite research output in computing fields.',
      location: 'Bangalore, Karnataka',
      fees: 320000,
      placementRate: 95.0,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.iiitb.ac.in',
      email: 'admissions@iiitb.ac.in',
      phone: '+91 80 4140 7777',
      established: 1999,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'High-end Computing Labs', 'Startup Hub'],
      courses: {
        create: [
          { name: 'Integrated M.Tech Computer Science & Engineering', duration: 5, fees: 320000 },
          { name: 'M.Tech Electronics & Communication', duration: 2, fees: 320000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Stellar placements and top-notch coding environment. The research labs are top-class.', userName: 'Preeti Deshpande' }
        ]
      }
    },
    {
      name: 'Visvesvaraya Technological University (VTU), Belagavi',
      description: 'VTU is one of the largest technological universities in India, located in Belagavi, Karnataka. It coordinates technical education and grants degrees across all engineering colleges in Karnataka.',
      location: 'Belagavi, Karnataka',
      fees: 65000,
      placementRate: 76.2,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://vtu.ac.in',
      email: 'registrar@vtu.ac.in',
      phone: '+91 83 1249 8100',
      established: 1998,
      facilities: ['Hostel', 'Library', 'Sports Arena', 'Computer Labs', 'Administrative Block'],
      courses: {
        create: [
          { name: 'M.Tech Computer Science & Engineering', duration: 2, fees: 65000 },
          { name: 'B.Tech Mechanical Engineering', duration: 4, fees: 60000 },
        ]
      },
      reviews: {
        create: [
          { rating: 3, comment: 'Government university campus. Good infrastructure but administrative processes can be slow.', userName: 'Basavaraj M.' }
        ]
      }
    },
    {
      name: 'University Visvesvaraya College of Engineering (UVCE), Bangalore',
      description: 'UVCE is a historic government college located in K.R. Circle, Bangalore, Karnataka. Established in 1917 by Bharat Ratna Sir M. Visvesvaraya, it is one of the oldest engineering institutions in India.',
      location: 'Bangalore, Karnataka',
      fees: 40000,
      placementRate: 81.5,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://uvce.ac.in',
      email: 'info@uvce.ac.in',
      phone: '+91 80 2221 0694',
      established: 1917,
      facilities: ['Hostel', 'Library', 'Historical Campus', 'Basic Labs', 'Sports Ground'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 40000 },
          { name: 'B.E. Electrical & Electronics Engineering', duration: 4, fees: 40000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Extremely low fees and great placements. The campus building is very old but has heritage value.', userName: 'Devika P.' }
        ]
      }
    },
    {
      name: 'Siddaganga Institute of Technology (SIT), Tumkur',
      description: 'SIT Tumkur is a private engineering college in Tumkur, Karnataka, managed by the Siddaganga Sri Sree Shivakumara Swamiji. It offers affordable quality engineering education.',
      location: 'Tumkur, Karnataka',
      fees: 180000,
      placementRate: 78.4,
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://sit.ac.in',
      email: 'principal@sit.ac.in',
      phone: '+91 81 6228 2696',
      established: 1963,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Temples', 'Mess Hall'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 180000 },
          { name: 'B.E. Chemical Engineering', duration: 4, fees: 160000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Disciplined lifestyle, green campus, and good academic training.', userName: 'Mallikarjun S.' }
        ]
      }
    },
    {
      name: 'National Institute of Engineering (NIE), Mysore',
      description: 'NIE Mysore is a highly reputed private engineering college located in Mysore, Karnataka. It has produced many prominent leaders including legendary engineer N.R. Narayana Murthy.',
      location: 'Mysore, Karnataka',
      fees: 210000,
      placementRate: 82.0,
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://nie.ac.in',
      email: 'info@nie.ac.in',
      phone: '+91 82 1248 0475',
      established: 1946,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Sports Arena', 'CAD Labs'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 210000 },
          { name: 'B.E. Electronics & Communication', duration: 4, fees: 200000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Strong alumni network and very good placement connections. peaceful city life.', userName: 'Niranjan H.' }
        ]
      }
    },
    {
      name: 'KLS Gogte Institute of Technology (GIT), Belagavi',
      description: 'GIT Belagavi is a premier engineering institution in Northern Karnataka. It has excellent facilities, research focus, and student chapters in robotics and aerospace fields.',
      location: 'Belagavi, Karnataka',
      fees: 150000,
      placementRate: 75.5,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://git.edu',
      email: 'admissions@git.edu',
      phone: '+91 83 1240 5500',
      established: 1979,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Aeronautical Labs', 'Sports Ground'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 150000 },
          { name: 'B.E. Aeronautical Engineering', duration: 4, fees: 160000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Excellent lab equipment and helpful instructors. Best engineering college in Belgaum.', userName: 'Vinayak Patil' }
        ]
      }
    },
    {
      name: 'Nitte Meenakshi Institute of Technology (NMIT), Bangalore',
      description: 'NMIT is an autonomous private engineering college in Bangalore, Karnataka. It has achieved excellent progress in satellite development, robotics, and multi-disciplinary research.',
      location: 'Bangalore, Karnataka',
      fees: 230000,
      placementRate: 80.2,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://nmit.ac.in',
      email: 'admissions@nmit.ac.in',
      phone: '+91 80 2204 1800',
      established: 2001,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Satellite Labs', 'Auditorium'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 230000 },
          { name: 'B.E. Information Science & Engineering', duration: 4, fees: 230000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Dynamic environment. The college lets students work on actual nanosatellite projects.', userName: 'Priyanka R.' }
        ]
      }
    },
    {
      name: 'Alliance University, Bangalore',
      description: 'Alliance University is a private university located in Anekal, Bangalore, Karnataka. It has a beautiful lush green campus and is recognized for its business, law, and engineering streams.',
      location: 'Bangalore, Karnataka',
      fees: 420000,
      placementRate: 84.1,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.alliance.edu.in',
      email: 'admissions@alliance.edu.in',
      phone: '+91 80 4607 5400',
      established: 2010,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Food Court', 'Amphitheatre', 'Residential Halls'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 420000 },
          { name: 'MBA Marketing', duration: 2, fees: 750000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Lush green campus, world class classrooms, and awesome student amenities.', userName: 'Deepak Nair' }
        ]
      }
    },

    // --- ANDHRA PRADESH (10 colleges) ---
    {
      name: 'Andhra University College of Engineering (AUCE), Visakhapatnam',
      description: 'AUCE is an autonomous college of Andhra University located in Visakhapatnam, Andhra Pradesh. Established in 1946, it is widely respected for its chemical, computer engineering, and naval architecture programs.',
      location: 'Visakhapatnam, Andhra Pradesh',
      fees: 50000,
      placementRate: 82.3,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://andhrauniversity.edu.in',
      email: 'admissions@andhrauniversity.edu.in',
      phone: '+91 89 1284 4000',
      established: 1946,
      facilities: ['Hostel', 'Library', 'Naval Lab', 'Sports Grounds', 'Auditorium'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Systems Engineering', duration: 4, fees: 50000 },
          { name: 'B.Tech Chemical Engineering', duration: 4, fees: 45000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Legendary state university. Tuition fees are minimal and local placement is solid.', userName: 'Sai Kumar' }
        ]
      }
    },
    {
      name: 'Indian Institute of Technology (IIT), Tirupati',
      description: 'IIT Tirupati is a second-generation public engineering institute established by the Government of India in 2015. It has established modern research labs and hosts prime placement drives.',
      location: 'Tirupati, Andhra Pradesh',
      fees: 220000,
      placementRate: 90.1,
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://iittp.ac.in',
      email: 'admissions@iittp.ac.in',
      phone: '+91 87 7250 3000',
      established: 2015,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Modern Research Labs', 'Mess Hall'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 220000 },
          { name: 'B.Tech Civil & Environmental Engineering', duration: 4, fees: 200000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Excellent transit campus and supportive professors. Placements are scaling up rapidly.', userName: 'Anil Prasad' }
        ]
      }
    },
    {
      name: 'National Institute of Technology (NIT), Tadepalligudem',
      description: 'NIT Andhra Pradesh is the youngest NIT in the country, established in 2015. Located in Tadepalligudem, it has developed a massive permanent campus with excellent facilities.',
      location: 'Tadepalligudem, Andhra Pradesh',
      fees: 135000,
      placementRate: 81.2,
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://nitandhra.ac.in',
      email: 'admissions@nitandhra.ac.in',
      phone: '+91 88 1828 4710',
      established: 2015,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Mess Halls', 'Seminar Rooms'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 135000 },
          { name: 'B.Tech Mechanical Engineering', duration: 4, fees: 135000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'New campus and buildings look awesome. Infrastructure is almost fully complete.', userName: 'Nageswara Rao' }
        ]
      }
    },
    {
      name: 'Indian Institute of Information Technology (IIIT), Sri City',
      description: 'IIIT Sri City is an Institute of National Importance located in Sri City SEZ, Andhra Pradesh. It has robust industry ties and offers excellent curriculum focus in AI, Machine Learning, and VLSI.',
      location: 'Sri City, Andhra Pradesh',
      fees: 280000,
      placementRate: 89.5,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.iiits.ac.in',
      email: 'admissions@iiits.in',
      phone: '+91 73 0643 4752',
      established: 2013,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'SEZ Collaborations', 'Computer Labs'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 280000 },
          { name: 'B.Tech Electronics & Communication', duration: 4, fees: 280000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Location inside Sri City SEZ is helpful for internship opportunities and guest lectures.', userName: 'Chaitanya Reddy' }
        ]
      }
    },
    {
      name: 'Koneru Lakshmaiah Education Foundation (KL University), Guntur',
      description: 'KL University is a massive private deemed university located in Guntur, Andhra Pradesh. Known for its strict academic guidelines and massive campus placement success.',
      location: 'Guntur, Andhra Pradesh',
      fees: 260000,
      placementRate: 88.0,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://kluniversity.in',
      email: 'admissions@kluniversity.in',
      phone: '+91 86 3239 9999',
      established: 1980,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Indoor Sports Complex', 'Smart Classrooms', 'Cafeterias'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 260000 },
          { name: 'B.Tech Biotechnology', duration: 4, fees: 220000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Excellent campus life. The placement training provided here is highly effective.', userName: 'Harish T.' }
        ]
      }
    },
    {
      name: 'GITAM Deemed University, Visakhapatnam',
      description: 'GITAM is a premium private deemed university located overlooking the sea in Visakhapatnam, Andhra Pradesh. It offers quality multidisciplinary education in engineering, medicine, and business.',
      location: 'Visakhapatnam, Andhra Pradesh',
      fees: 290000,
      placementRate: 84.2,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://gitam.edu',
      email: 'admissions@gitam.edu',
      phone: '+91 89 1279 0101',
      established: 1980,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Sea View Campus', 'Sports Complex'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 290000 },
          { name: 'B.Tech Aerospace Engineering', duration: 4, fees: 290000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Beautiful campus next to the beach. Student fests are amazing and placements are good.', userName: 'Pooja Reddy' }
        ]
      }
    },
    {
      name: 'JNTU College of Engineering, Kakinada',
      description: 'JNTUK is a public university located in Kakinada, Andhra Pradesh. Originally established in 1946, it has trained generations of engineers in Andhra Pradesh.',
      location: 'Kakinada, Andhra Pradesh',
      fees: 45000,
      placementRate: 79.5,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://jntuk.edu.in',
      email: 'admissions@jntuk.edu.in',
      phone: '+91 88 4230 0900',
      established: 1946,
      facilities: ['Hostel', 'Library', 'Sports Arena', 'Core Engineering Labs'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 45000 },
          { name: 'B.Tech Petroleum Engineering', duration: 4, fees: 40000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Historical college. Great professors for core branches like civil, mechanical, and petroleum.', userName: 'Venkatesh Babu' }
        ]
      }
    },
    {
      name: 'Sri Venkateswara University College of Engineering (SVUCE), Tirupati',
      description: 'SVUCE is a state university engineering college in Tirupati, Andhra Pradesh. Located in the temple town, it offers quality technical training and active research output.',
      location: 'Tirupati, Andhra Pradesh',
      fees: 42000,
      placementRate: 78.6,
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://svuniversity.edu.in',
      email: 'principal@svuce.edu.in',
      phone: '+91 87 7228 9561',
      established: 1959,
      facilities: ['Hostel', 'Library', 'Lush Green Campus', 'Basic Labs', 'Sports Facility'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 42000 },
          { name: 'B.Tech Electronics & Electrical Engineering', duration: 4, fees: 42000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Very peaceful campus at the foot of Tirumala hills. Low fees and decent placements.', userName: 'Krishna Murthy' }
        ]
      }
    },
    {
      name: 'Velagapudi Ramakrishna Siddhartha Engineering College, Vijayawada',
      description: 'VRSEC is a private autonomous engineering college in Vijayawada, Andhra Pradesh. It is the first private engineering college established in united Andhra Pradesh in 1977.',
      location: 'Vijayawada, Andhra Pradesh',
      fees: 110000,
      placementRate: 80.5,
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://vrsiddhartha.ac.in',
      email: 'principal@vrsiddhartha.ac.in',
      phone: '+91 86 6258 2333',
      established: 1977,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Collaborative Labs', 'Seminar Halls'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 110000 },
          { name: 'B.Tech Information Technology', duration: 4, fees: 110000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'One of the best private engineering colleges in AP. Good faculty and campus discipline.', userName: 'Ramanjaneyulu' }
        ]
      }
    },
    {
      name: 'Gayatri Vidya Parishad College of Engineering, Visakhapatnam',
      description: 'GVPCE is a self-financed autonomous engineering college located in Madhurawada, Visakhapatnam, Andhra Pradesh. It is highly sought-after by students in coastal Andhra.',
      location: 'Visakhapatnam, Andhra Pradesh',
      fees: 115000,
      placementRate: 81.0,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://gvpce.ac.in',
      email: 'admissions@gvpce.ac.in',
      phone: '+91 89 1273 9507',
      established: 1996,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Sports Arena', 'Computing Labs'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 115000 },
          { name: 'B.Tech Electrical & Electronics Engineering', duration: 4, fees: 115000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Best placement stats in Vizag after Andhra University. Highly dedicated faculty.', userName: 'Suresh Kumar' }
        ]
      }
    },

    // --- HYDERABAD (5 colleges) ---
    {
      name: 'International Institute of Information Technology (IIIT), Hyderabad',
      description: 'IIIT Hyderabad is a top-tier private deemed university in Hyderabad, Telangana. Highly reputed for its coding culture, research publications, and having some of the highest package placements in India.',
      location: 'Hyderabad, Telangana',
      fees: 360000,
      placementRate: 99.2,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://www.iiit.ac.in',
      email: 'admissions@iiit.ac.in',
      phone: '+91 40 6653 1000',
      established: 1998,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'AI Research Labs', 'Startup Incubator', 'Sports Complex'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 360000 },
          { name: 'B.Tech Electronics & Comm. Engineering', duration: 4, fees: 360000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Coding culture is legendary. Average placements are higher than almost all IITs. Highly research-oriented.', userName: 'Tarun Reddy' }
        ]
      }
    },
    {
      name: 'Indian Institute of Technology (IIT), Hyderabad',
      description: 'IIT Hyderabad is a top-tier public engineering university located in Kandi, Sangareddy near Hyderabad, Telangana. Known for its strong academic relationship with Japan and high-impact research output.',
      location: 'Hyderabad, Telangana',
      fees: 220000,
      placementRate: 94.8,
      imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://iith.ac.in',
      email: 'admissions@iith.ac.in',
      phone: '+91 40 2301 6033',
      established: 2008,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Japanese Collaboration Labs', 'Sports Ground'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 220000 },
          { name: 'B.Tech Biomedical Engineering', duration: 4, fees: 220000 },
        ]
      },
      reviews: {
        create: [
          { rating: 5, comment: 'Phenomenal architecture and academic freedom. Extremely good tech research ecosystem.', userName: 'Satya Murthy' }
        ]
      }
    },
    {
      name: 'JNTUH College of Engineering, Hyderabad',
      description: 'JNTUH UCEH is a premier public university college located in Kukatpally, Hyderabad, Telangana. Established in 1965, it has been a center of excellence in engineering education in Telangana.',
      location: 'Hyderabad, Telangana',
      fees: 60000,
      placementRate: 83.5,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://jntuhceh.ac.in',
      email: 'support@jntuhceh.ac.in',
      phone: '+91 40 2315 8661',
      established: 1965,
      facilities: ['Hostel', 'Library', 'Sports Arena', 'Technical Labs', 'Canteen'],
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', duration: 4, fees: 60000 },
          { name: 'B.Tech Mechanical Engineering', duration: 4, fees: 60000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'JNTUH brand name carries immense weight in Telangana. Placements are solid.', userName: 'Vijay Kumar' }
        ]
      }
    },
    {
      name: 'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
      description: 'CBIT is one of the premier private engineering institutes in Hyderabad, Telangana. Established in 1979 in Gandipet, it has built an outstanding reputation for discipline and quality placements.',
      location: 'Hyderabad, Telangana',
      fees: 140000,
      placementRate: 82.0,
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://cbit.ac.in',
      email: 'admissions@cbit.ac.in',
      phone: '+91 40 2419 3276',
      established: 1979,
      facilities: ['WiFi', 'Hostel', 'Gym', 'Library', 'Research Center', 'Sports Ground'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 140000 },
          { name: 'B.E. Civil Engineering', duration: 4, fees: 140000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Premium campus environment in Gandipet. Good placement record for CSE and IT streams.', userName: 'Siddharth Rao' }
        ]
      }
    },
    {
      name: 'Osmania University College of Engineering (UCEOU), Hyderabad',
      description: 'UCEOU is a historic autonomous public engineering college located in Hyderabad, Telangana. Established in 1929, it is the 6th oldest engineering college in India.',
      location: 'Hyderabad, Telangana',
      fees: 50000,
      placementRate: 81.2,
      imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=60',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=60',
      website: 'https://uceou.edu',
      email: 'admissions@uceou.edu',
      phone: '+91 40 2709 8254',
      established: 1929,
      facilities: ['Hostel', 'Library', 'Heritage Campus', 'Basic Labs', 'Playground'],
      courses: {
        create: [
          { name: 'B.E. Computer Science & Engineering', duration: 4, fees: 50000 },
          { name: 'B.E. Mining Engineering', duration: 4, fees: 45000 },
        ]
      },
      reviews: {
        create: [
          { rating: 4, comment: 'Vintage building and premium academics. Very proud to be an Osmania alumnus.', userName: 'Madhavi Latha' }
        ]
      }
    }
  ];

  for (const col of collegesData) {
    const createdCollege = await prisma.college.create({
      data: col,
      include: {
        reviews: true
      }
    });

    // Update average rating
    const ratings = createdCollege.reviews.map(r => r.rating);
    const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    const finalAvg = parseFloat(avg.toFixed(1));

    await prisma.college.update({
      where: { id: createdCollege.id },
      data: { rating: finalAvg }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
