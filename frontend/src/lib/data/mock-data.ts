import { 
  University, 
  College,
  Department,
  Programme,
  ReportTypeConfig, 
  AcademicReport, 
  ReportTemplate, 
  ReferenceItem, 
  PaymentTransaction, 
  NotificationItem, 
  AdminAnalytics,
  User
} from '@/types';

export const MOCK_CURRENT_USER: User = {
  id: 'usr-101',
  name: 'Baraka John Msangi',
  email: 'baraka.msangi@udsm.ac.tz',
  phone: '+255 754 123 456',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  universityId: 'uni-udsm',
  universityName: 'University of Dar es Salaam',
  programmeId: 'prog-cs',
  programmeName: 'B.Sc. in Computer Science',
  yearOfStudy: 'Year 3',
  regNumber: '2023-04-08219',
  isEmailVerified: true,
  createdAt: '2025-09-15T10:00:00Z',
};

export const MOCK_ADMIN_USER: User = {
  id: 'usr-admin-01',
  name: 'Dr. Sarah K. Kimaro',
  email: 'admin@unireporttz.co.tz',
  phone: '+255 784 900 111',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  isEmailVerified: true,
  createdAt: '2025-01-01T08:00:00Z',
};

export const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'uni-udsm',
    name: 'University of Dar es Salaam',
    shortName: 'UDSM',
    location: 'Dar es Salaam, Tanzania',
    description: 'The oldest and premier public university in Tanzania, specializing in science, engineering, business, and humanities.',
    collegesCount: 11,
    reportTypes: ['field-training', 'internship', 'industrial-training', 'research-report', 'final-year-project', 'dissertation'],
    status: 'active',
    isVerified: true,
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'uni-udom',
    name: 'University of Dodoma',
    shortName: 'UDOM',
    location: 'Dodoma, Tanzania',
    description: 'Tanzania’s largest public university campus offering multidisciplinary research and training in ICT, Education, and Natural Sciences.',
    collegesCount: 7,
    reportTypes: ['field-training', 'internship', 'industrial-training', 'research-report', 'final-year-project', 'thesis'],
    status: 'active',
    isVerified: true,
    logoUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'uni-sua',
    name: 'Sokoine University of Agriculture',
    shortName: 'SUA',
    location: 'Morogoro, Tanzania',
    description: 'Premier national agricultural, forestry, and veterinary university producing research reports and practical field logs.',
    collegesCount: 5,
    reportTypes: ['field-training', 'practical-report', 'research-report', 'final-year-project', 'dissertation'],
    status: 'active',
    isVerified: true,
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'uni-mzumbe',
    name: 'Mzumbe University',
    shortName: 'MU',
    location: 'Morogoro & Dar es Salaam, Tanzania',
    description: 'Leading African institution for public administration, management, law, and business intelligence reporting.',
    collegesCount: 4,
    reportTypes: ['field-training', 'internship', 'research-report', 'seminar-report', 'final-year-project'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-ardhi',
    name: 'Ardhi University',
    shortName: 'ARU',
    location: 'Dar es Salaam, Tanzania',
    description: 'Specialist university in land administration, architecture, spatial planning, environmental science, and civil design.',
    collegesCount: 6,
    reportTypes: ['industrial-training', 'field-training', 'project-documentation', 'final-year-project', 'thesis'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-muhas',
    name: 'Muhimbili University of Health and Allied Sciences',
    shortName: 'MUHAS',
    location: 'Dar es Salaam, Tanzania',
    description: 'Pioneering medical and clinical research university for health sciences, nursing, pharmacy, and public health reports.',
    collegesCount: 5,
    reportTypes: ['practical-report', 'research-report', 'dissertation', 'thesis'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-nm-aist',
    name: 'Nelson Mandela African Institution of Science and Technology',
    shortName: 'NM-AIST',
    location: 'Arusha, Tanzania',
    description: 'Postgraduate institute of excellence in STEM disciplines, bio-engineering, computing, and high-impact scientific thesis papers.',
    collegesCount: 4,
    reportTypes: ['research-report', 'dissertation', 'thesis'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-out',
    name: 'Open University of Tanzania',
    shortName: 'OUT',
    location: 'Nationwide Campuses, Tanzania',
    description: 'Public distance-learning institution providing flexible academic degrees across mainland Tanzania and Zanzibar.',
    collegesCount: 6,
    reportTypes: ['field-training', 'research-report', 'final-year-project', 'seminar-report'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-cbe',
    name: 'College of Business Education',
    shortName: 'CBE',
    location: 'Dar es Salaam & Dodoma, Tanzania',
    description: 'Practical business education provider focusing on accountancy, marketing, procurement, and commerce practical reports.',
    collegesCount: 3,
    reportTypes: ['field-training', 'internship', 'practical-report', 'project-documentation'],
    status: 'active',
    isVerified: true,
  },
  {
    id: 'uni-ifm',
    name: 'Institute of Finance Management',
    shortName: 'IFM',
    location: 'Dar es Salaam, Tanzania',
    description: 'Leading financial services and computing institute in Tanzania.',
    collegesCount: 4,
    reportTypes: ['field-training', 'internship', 'final-year-project', 'research-report'],
    status: 'active',
    isVerified: true,
  }
];

export const MOCK_REPORT_TYPES: ReportTypeConfig[] = [
  {
    id: 'rt-1',
    slug: 'field-training',
    name: 'Field Practical Training Report',
    description: 'Comprehensive report summarizing hands-on industry experience, institutional attachment, daily logbook summaries, and practical tasks accomplished.',
    typicalUse: 'Mandatory 6-8 week practical field training completed by undergraduate students.',
    requiredInformation: ['Organization Name', 'Location', 'Field Supervisor', 'Duration & Dates', 'Technical Activities', 'Challenges & Solutions'],
    supportedUniversities: ['UDSM', 'UDOM', 'SUA', 'Mzumbe', 'ARU', 'OUT', 'CBE', 'IFM'],
    iconName: 'Briefcase',
    status: 'active'
  },
  {
    id: 'rt-2',
    slug: 'internship',
    name: 'Internship & Attachment Report',
    description: 'Professional workplace report focusing on corporate experience, project contributions, departmental workflow, and professional development.',
    typicalUse: 'Mid-programme or post-course industrial internship placement.',
    requiredInformation: ['Host Company', 'Department', 'Role Title', 'Key Deliverables', 'Skills Acquired', 'Organization Chart'],
    supportedUniversities: ['UDSM', 'UDOM', 'Mzumbe', 'CBE', 'IFM'],
    iconName: 'Building2',
    status: 'active'
  },
  {
    id: 'rt-3',
    slug: 'industrial-training',
    name: 'Industrial Training Report',
    description: 'Engineering and tech-focused report covering site inspections, equipment maintenance, safety compliance, and hands-on system operations.',
    typicalUse: 'Faculty of Engineering, Architecture & Built Environment students.',
    requiredInformation: ['Site Location', 'Project Description', 'Equipment & Machinery', 'Safety Procedures', 'Daily Duties'],
    supportedUniversities: ['UDSM', 'UDOM', 'ARU', 'SUA'],
    iconName: 'Wrench',
    status: 'active'
  },
  {
    id: 'rt-4',
    slug: 'research-report',
    name: 'Academic Research Report',
    description: 'Structured scientific research paper with problem statement, literature review, methodology, data analysis, findings, and conclusions.',
    typicalUse: 'Final year research modules, honours research, or master’s coursework.',
    requiredInformation: ['Research Title', 'Problem Statement', 'Objectives', 'Methodology', 'Sample Size', 'Data Analysis Tools'],
    supportedUniversities: ['UDSM', 'UDOM', 'SUA', 'Mzumbe', 'MUHAS', 'NM-AIST', 'OUT'],
    iconName: 'FileText',
    status: 'active'
  },
  {
    id: 'rt-5',
    slug: 'final-year-project',
    name: 'Final Year Project (FYP)',
    description: 'Comprehensive capstone project document detailing design, system implementation, experimentation, testing, and system analysis.',
    typicalUse: 'Graduating undergraduate students capstone requirement.',
    requiredInformation: ['Project Title', 'System Architecture', 'Functional Requirements', 'Testing Metrics', 'User Manual Summary'],
    supportedUniversities: ['UDSM', 'UDOM', 'SUA', 'Mzumbe', 'ARU', 'IFM'],
    iconName: 'GraduationCap',
    status: 'active'
  },
  {
    id: 'rt-6',
    slug: 'dissertation',
    name: 'Master’s Dissertation',
    description: 'Postgraduate research dissertation formatted according to university postgraduate directorate guidelines.',
    typicalUse: 'MSc, MBA, and MA degree candidates.',
    requiredInformation: ['Hypothesis/Research Questions', 'Theoretical Framework', 'Empirical Results', 'Ethical Approval'],
    supportedUniversities: ['UDSM', 'UDOM', 'SUA', 'Mzumbe', 'MUHAS', 'NM-AIST'],
    iconName: 'BookOpen',
    status: 'active'
  },
  {
    id: 'rt-7',
    slug: 'thesis',
    name: 'Doctoral / Master Thesis',
    description: 'High-level original contribution thesis document requiring strict university formatting, chapter division, and peer reference verification.',
    typicalUse: 'PhD and Research Master candidates.',
    requiredInformation: ['Original Contribution', 'Methodology Validation', 'Publication Extracts', 'Complete Bibliography'],
    supportedUniversities: ['UDSM', 'UDOM', 'NM-AIST', 'SUA', 'MUHAS'],
    iconName: 'Award',
    status: 'active'
  },
  {
    id: 'rt-8',
    slug: 'practical-report',
    name: 'Laboratory / Clinical Practical Report',
    description: 'Experimental and clinical lab record summarizing procedures, apparatus, observations, calculations, error analysis, and conclusions.',
    typicalUse: 'Science, Agricultural, and Health Science practical units.',
    requiredInformation: ['Experiment Title', 'Apparatus & Reagents', 'Step-by-Step Procedure', 'Observations & Calculations'],
    supportedUniversities: ['SUA', 'MUHAS', 'UDSM'],
    iconName: 'FlaskConical',
    status: 'active'
  }
];

export const MOCK_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tmpl-udsm-ft-2025',
    universityId: 'uni-udsm',
    universityName: 'University of Dar es Salaam (UDSM)',
    reportTypeSlug: 'field-training',
    reportTypeName: 'Field Practical Training Report',
    version: 'v2025.1',
    status: 'Verified',
    effectiveDate: '2025-01-10',
    sectionsCount: 6,
    formattingRules: {
      fontFamily: 'Times New Roman / Inter',
      fontSizeBody: '12pt',
      lineSpacing: '1.5 lines',
      margins: 'Top/Bottom/Right: 2.5cm, Left: 3.5cm (Binding)',
      citationStyle: 'IEEE',
    }
  },
  {
    id: 'tmpl-udom-fyp-2025',
    universityId: 'uni-udom',
    universityName: 'University of Dodoma (UDOM)',
    reportTypeSlug: 'final-year-project',
    reportTypeName: 'Final Year Project Documentation',
    version: 'v2025.2',
    status: 'Verified',
    effectiveDate: '2025-02-01',
    sectionsCount: 7,
    formattingRules: {
      fontFamily: 'Arial / Geist',
      fontSizeBody: '12pt',
      lineSpacing: '1.5 lines',
      margins: 'Standard 2.5cm',
      citationStyle: 'APA7',
    }
  },
  {
    id: 'tmpl-sua-rr-2024',
    universityId: 'uni-sua',
    universityName: 'Sokoine University of Agriculture (SUA)',
    reportTypeSlug: 'research-report',
    reportTypeName: 'Special Project & Research Report',
    version: 'v2024.4',
    status: 'Verified',
    effectiveDate: '2024-11-15',
    sectionsCount: 5,
    formattingRules: {
      fontFamily: 'Times New Roman',
      fontSizeBody: '12pt',
      lineSpacing: '2.0 lines',
      margins: 'Left: 4.0cm, Others: 2.5cm',
      citationStyle: 'Harvard',
    }
  },
  {
    id: 'tmpl-mzumbe-internship-2025',
    universityId: 'uni-mzumbe',
    universityName: 'Mzumbe University',
    reportTypeSlug: 'internship',
    reportTypeName: 'Practical Attachment & Internship Report',
    version: 'v2025.1',
    status: 'Needs Review',
    effectiveDate: '2025-03-01',
    sectionsCount: 6,
    formattingRules: {
      fontFamily: 'Georgia / Inter',
      fontSizeBody: '11pt',
      lineSpacing: '1.5 lines',
      margins: 'Standard 2.5cm',
      citationStyle: 'APA7',
    }
  }
];

export const MOCK_REPORTS: AcademicReport[] = [
  {
    id: 'rep-udsm-8821',
    title: 'Field Practical Training Report at Tanzania Telecommunications Corporation (TTCL)',
    studentId: 'usr-101',
    studentName: 'Baraka John Msangi',
    regNumber: '2023-04-08219',
    universityId: 'uni-udsm',
    universityName: 'University of Dar es Salaam',
    collegeName: 'College of Information and Communication Technologies (CoICT)',
    departmentName: 'Department of Computer Science & Engineering',
    programmeName: 'B.Sc. in Computer Science',
    yearOfStudy: 'Year 3',
    semester: 'Semester 2',
    academicYear: '2024/2025',
    academicSupervisor: 'Dr. Josephat M. Shirima',
    fieldSupervisor: 'Eng. Godfrey Mwakyusa (Senior Network Specialist)',
    reportTypeSlug: 'field-training',
    reportTypeName: 'Field Practical Training Report',
    status: 'Ready',
    completionPercentage: 100,
    missingFields: [],
    qualityScore: 94,
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
    writingPreferences: {
      academicTone: 'rigorous',
      languageVariant: 'en-TZ',
      reportLength: 'standard',
      citationStyle: 'IEEE',
      perspective: 'third-person',
    },
    evidenceFiles: [
      {
        id: 'ev-1',
        fileName: 'ttcl_server_room_inspection.jpg',
        fileSize: 2450000,
        fileType: 'image/jpeg',
        fileUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
        previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
        caption: 'Figure 1.1: Verification of fiber optic switches at TTCL Data Center.',
        uploadedAt: '2026-02-12T10:00:00Z',
      },
      {
        id: 'ev-2',
        fileName: 'weekly_logbook_signed.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        fileUrl: '#',
        caption: 'Stamped weekly field logbook record signed by field supervisor.',
        uploadedAt: '2026-02-15T11:20:00Z',
      }
    ],
    sections: [
      {
        id: 'sec-1',
        title: 'Executive Summary',
        order: 1,
        wordCount: 380,
        status: 'completed',
        content: `This report details eight weeks of Field Practical Training (FPT) conducted at the Tanzania Telecommunications Corporation (TTCL) Head Office in Dar es Salaam from July to September 2025. The practical attachment exposed the student to enterprise network administration, fiber optic backbone infrastructure, fiber splicing techniques, and software-defined network monitoring. Key achievements include participating in the deployment of modern VLAN topologies across 3 regional branch offices and configuring automated bandwidth monitoring scripts. The skills acquired significantly bridge classroom theoretical concepts in Computer Networks with real-world telecommunication deployments.`
      },
      {
        id: 'sec-2',
        title: 'Chapter 1: Introduction & Host Organization Profile',
        order: 2,
        wordCount: 850,
        status: 'completed',
        content: `### 1.1 Background of the Attachment
Field Practical Training (FPT) is an integral component of the Bachelor of Science in Computer Science degree programme at the University of Dar es Salaam (UDSM). It equips students with hands-on industrial exposure, professional work ethics, and application of modern technologies.

### 1.2 Profile of TTCL Corporation
Tanzania Telecommunications Corporation (TTCL) is the national telecommunications provider in Tanzania. 
* **Mission:** To provide high quality, reliable, and affordable ICT infrastructure services across Tanzania.
* **Organizational Structure:** TTCL operates under five main directorates: Network Operations, IT & Software Systems, Commercial Services, Finance, and Human Resources.

The student was attached to the **Network Infrastructure & Cybersecurity Division** under direct supervision of Eng. Godfrey Mwakyusa.`
      },
      {
        id: 'sec-3',
        title: 'Chapter 2: Technical Activities & Practical Tasks',
        order: 3,
        wordCount: 1420,
        status: 'completed',
        content: `### 2.1 Optical Fiber Splicing & Maintenance
During Week 2 and Week 3, the student assisted the field engineering team in diagnosing signal degradation on the Metropolitan Area Network (MAN) link between Kijitonyama and City Center. 
1. **OTDR Testing:** Utilized Optical Time-Domain Reflectometers (OTDR) to identify attenuation points at 14.2 km.
2. **Fusion Splicing:** Performed single-mode fiber fusion splicing achieving insertion loss below 0.02 dB.

### 2.2 Network Switch Configuration & VLAN Segmentation
Configured Cisco Catalyst 3850 Series Layer 3 switches to isolate guest traffic from administrative enterprise subnets. Applied Access Control Lists (ACLs) and IEEE 802.1Q tagging.`
      },
      {
        id: 'sec-4',
        title: 'Chapter 3: Challenges, Solutions & Skills Acquired',
        order: 4,
        wordCount: 650,
        status: 'completed',
        content: `### 3.1 Technical Challenges Encountered
* **Legacy Equipment Compatibility:** Integrating older legacy PDH multiplexers with modern IP-MPLS routers required custom transceiver adapters.
* **Intermittent Power Fluctuations:** Field measurements were occasionally interrupted by unexpected power outages prior to UPS installation.

### 3.2 Skills & Professional Knowledge Acquired
1. Advanced CLI syntax for enterprise routing protocols (OSPF, BGP).
2. Fiber optic cable troubleshooting and splice tray management.
3. Collaborative teamwork and technical report writing in compliance with UDSM standards.`
      },
      {
        id: 'sec-5',
        title: 'Chapter 4: Conclusions & Recommendations',
        order: 5,
        wordCount: 410,
        status: 'completed',
        content: `### 4.1 Conclusion
The 8-week field practical training at TTCL successfully met all learning objectives set by the Department of Computer Science & Engineering. 

### 4.2 Recommendations
* **To UDSM:** Expand industrial partnership agreements to facilitate early attachment placement for second-year students.
* **To TTCL:** Upgrade legacy laboratory testing rigs to include virtualized network simulation software like GNS3 and EVE-NG for intern practice.`
      }
    ]
  },
  {
    id: 'rep-udom-9042',
    title: 'AI-Powered Crop Disease Detection System for Tanzanian Smallholder Farmers',
    studentId: 'usr-101',
    studentName: 'Baraka John Msangi',
    regNumber: '2023-04-08219',
    universityId: 'uni-udom',
    universityName: 'University of Dodoma',
    collegeName: 'College of Informatics and Virtual Education (CIVE)',
    departmentName: 'Department of Computer Science',
    programmeName: 'B.Sc. in Software Engineering',
    yearOfStudy: 'Year 4',
    semester: 'Semester 2',
    academicYear: '2025/2026',
    academicSupervisor: 'Prof. Emmanuel A. Lugoma',
    reportTypeSlug: 'final-year-project',
    reportTypeName: 'Final Year Project Documentation',
    status: 'Draft',
    completionPercentage: 75,
    missingFields: ['Field Supervisor Name', 'Ethics Approval Code'],
    qualityScore: 82,
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-04T16:20:00Z',
    writingPreferences: {
      academicTone: 'formal',
      languageVariant: 'en-US',
      reportLength: 'extended',
      citationStyle: 'APA7',
      perspective: 'third-person',
    },
    evidenceFiles: [],
    sections: [
      {
        id: 'sec-udom-1',
        title: 'Abstract',
        order: 1,
        wordCount: 260,
        status: 'completed',
        content: 'This project presents a lightweight mobile deep learning model designed to detect cassava brown streak disease and maize streak virus in rural Tanzania offline without active internet connectivity.'
      },
      {
        id: 'sec-udom-2',
        title: 'Chapter 1: Statement of Problem & Objectives',
        order: 2,
        wordCount: 620,
        status: 'draft',
        content: 'Agricultural yield losses in central Tanzania due to delayed pest diagnosis exceed 35% annually...'
      }
    ]
  }
];

export const MOCK_REFERENCES: ReferenceItem[] = [
  {
    id: 'ref-1',
    reportId: 'rep-udsm-8821',
    citationKey: '[1]',
    title: 'Optical Fiber Telecommunications VII: Systems and Networks',
    authors: 'A. Willner, T. Li, and E. Ip',
    publisherOrJournal: 'Academic Press IEEE Communications Standards',
    year: 2021,
    doiOrUrl: 'https://doi.org/10.1016/C2018-0-02314-8',
    status: 'Verified',
    verificationNotes: 'DOI confirmed in IEEE Xplore database. Matches academic citation guidelines.'
  },
  {
    id: 'ref-2',
    reportId: 'rep-udsm-8821',
    citationKey: '[2]',
    title: 'National ICT Policy of Tanzania: Expanding Rural Broadband',
    authors: 'Ministry of Information, Communication and Information Technology (MICIT)',
    publisherOrJournal: 'Government Printer, Dar es Salaam',
    year: 2023,
    doiOrUrl: 'https://www.mawasiliano.go.tz/policies/ict2023.pdf',
    status: 'Verified',
    verificationNotes: 'Verified official public policy document.'
  },
  {
    id: 'ref-3',
    reportId: 'rep-udsm-8821',
    citationKey: '[3]',
    title: 'Software-Defined Networking in Sub-Saharan Enterprise Architectures',
    authors: 'J. M. Shirima and K. N. Mvungi',
    publisherOrJournal: 'Tanzania Journal of Science & ICT',
    year: 2024,
    doiOrUrl: 'https://tjs.udsm.ac.tz/index.php/tjs/article/view/891',
    status: 'Needs Review',
    verificationNotes: 'Journal volume verified; volume pagination details pending library index check.'
  }
];

export const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-901',
    transactionId: 'MPESA-TZ-8849201',
    reportId: 'rep-udsm-8821',
    reportTitle: 'Field Practical Training Report at TTCL',
    studentId: 'usr-101',
    studentName: 'Baraka John Msangi',
    amountTzs: 15000,
    amountUsd: 5.80,
    paymentMethod: 'M-PESA',
    phoneNumber: '+255 754 123 456',
    status: 'Successful',
    createdAt: '2026-03-02T10:15:00Z',
    completedAt: '2026-03-02T10:15:42Z'
  },
  {
    id: 'pay-902',
    transactionId: 'TIGO-TZ-3310492',
    reportId: 'rep-udom-9042',
    reportTitle: 'AI Crop Disease Detection System',
    studentId: 'usr-101',
    studentName: 'Baraka John Msangi',
    amountTzs: 25000,
    amountUsd: 9.60,
    paymentMethod: 'TIGO-PESA',
    phoneNumber: '+255 713 999 888',
    status: 'Pending',
    createdAt: '2026-03-04T16:22:00Z'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Report Verified & Ready',
    message: 'Your Field Training Report at TTCL has passed university format checks with a 94% quality rating.',
    category: 'Report',
    isRead: false,
    createdAt: '2026-03-02T11:00:00Z',
    linkUrl: '/dashboard/reports/rep-udsm-8821'
  },
  {
    id: 'notif-2',
    title: 'Payment Successful',
    message: 'Payment of TZS 15,000 via M-Pesa was confirmed. PDF & DOCX downloads are now unlocked.',
    category: 'Payment',
    isRead: true,
    createdAt: '2026-03-02T10:16:00Z',
    linkUrl: '/dashboard/payments/rep-udsm-8821'
  },
  {
    id: 'notif-3',
    title: 'Template Update: UDSM 2026 Guidelines',
    message: 'The Department of Computer Science updated citation rules to IEEE 2026 format.',
    category: 'System',
    isRead: false,
    createdAt: '2026-03-01T08:30:00Z',
    linkUrl: '/dashboard/templates'
  }
];

export const MOCK_ADMIN_ANALYTICS: AdminAnalytics = {
  totalStudents: 14280,
  activeStudents: 9640,
  reportsGenerated: 38920,
  reportsCompleted: 34100,
  totalRevenueTzs: 485500000, // ~485.5 Million TZS
  successfulPaymentsCount: 32360,
  aiTokenUsage: 145800000,
  popularUniversities: [
    { name: 'University of Dar es Salaam (UDSM)', count: 12450 },
    { name: 'University of Dodoma (UDOM)', count: 9800 },
    { name: 'Mzumbe University', count: 6200 },
    { name: 'Sokoine University of Agriculture (SUA)', count: 5400 },
    { name: 'Ardhi University (ARU)', count: 3200 }
  ],
  popularReportTypes: [
    { name: 'Field Practical Training Report', count: 16800 },
    { name: 'Final Year Project Documentation', count: 11200 },
    { name: 'Academic Research Report', count: 6400 },
    { name: 'Internship Attachment Report', count: 4500 }
  ]
};

export const MOCK_COLLEGES: College[] = [
  { id: 'col-coict', universityId: 'uni-udsm', name: 'College of Information and Communication Technologies', code: 'CoICT', departmentsCount: 3 },
  { id: 'col-coet', universityId: 'uni-udsm', name: 'College of Engineering and Technology', code: 'CoET', departmentsCount: 5 },
  { id: 'col-conas', universityId: 'uni-udsm', name: 'College of Natural and Applied Sciences', code: 'CONAS', departmentsCount: 4 },
  { id: 'col-udom-cive', universityId: 'uni-udom', name: 'College of Informatics and Virtual Education', code: 'CIVE', departmentsCount: 3 },
  { id: 'col-udom-[#1]', universityId: 'uni-udom', name: 'College of Natural and Mathematical Sciences', code: 'CNMS', departmentsCount: 4 },
  { id: 'col-sua-coa', universityId: 'uni-sua', name: 'College of Agriculture', code: 'CoA', departmentsCount: 4 },
  { id: 'col-mzumbe-foc', universityId: 'uni-mzumbe', name: 'Faculty of Commerce and Management', code: 'FCM', departmentsCount: 3 },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-cs', collegeId: 'col-coict', name: 'Department of Computer Science & Engineering', code: 'CSE' },
  { id: 'dept-te', collegeId: 'col-coict', name: 'Department of Telecommunication Engineering', code: 'TE' },
  { id: 'dept-udom-cs', collegeId: 'col-udom-cive', name: 'Department of Computer Science', code: 'CS' },
  { id: 'dept-udom-is', collegeId: 'col-udom-cive', name: 'Department of Information Systems', code: 'IS' },
  { id: 'dept-sua-agri', collegeId: 'col-sua-coa', name: 'Department of Agricultural Economics', code: 'DAE' },
];

export const MOCK_PROGRAMMES: Programme[] = [
  { id: 'prog-cs', departmentId: 'dept-cs', name: 'B.Sc. in Computer Science', code: 'BSc.CS', degreeType: 'BSc' },
  { id: 'prog-bit', departmentId: 'dept-cs', name: 'B.Sc. in Business Information Technology', code: 'BSc.BIT', degreeType: 'BSc' },
  { id: 'prog-te', departmentId: 'dept-te', name: 'B.Sc. in Telecommunication Engineering', code: 'BSc.TE', degreeType: 'BSc' },
  { id: 'prog-udom-se', departmentId: 'dept-udom-cs', name: 'B.Sc. in Software Engineering', code: 'BSc.SE', degreeType: 'BSc' },
];

