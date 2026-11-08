import { Profile, Project, Achievement, TimelineEvent, WorkspaceTask, WorkspaceNote } from '../types';

export const PROFILES_DATA: Record<'sreesh' | 'mrithula', Profile> = {
  sreesh: {
    id: 'sreesh',
    name: 'Sreesh M',
    title: 'Computer Science Engineer & System Architect',
    tagline: 'Bridging Full-Stack Systems, Autonomous AI, and High-Craft Digital Interfaces.',
    bio: 'Passionate software engineer and systems architect focusing on agentic AI pipelines, spatial 3D interactions, robust full-stack infrastructure, and high-performance developer tooling.',
    focusAreas: [
      'Autonomous Agent AI & Cognitive Graph Traversal',
      'Full-Stack Architecture & Reactive Distributed Systems',
      'Creative WebGL / Three.js 3D Interactive Environments',
      'Zero-Trust Security, Credential Isolation & CI/CD Pipelines',
      '0-to-1 Product Strategy & High-Throughput APIs'
    ],
    education: {
      institution: 'Computer Science Engineering',
      degree: 'Bachelor of Technology (B.Tech / B.E.)',
      period: '2023 — Present',
      details: 'Specialization in Data Structures, Distributed Computing, Algorithm Design, and Artificial Intelligence.'
    },
    email: 'sreesh716@gmail.com',
    location: 'Bengaluru, India',
    githubUrl: 'https://github.com/sreesh',
    linkedinUrl: 'https://linkedin.com/in/sreesh-m',
    twitterUrl: 'https://twitter.com/sreesh',
    accentColor: '#3E5463', // Slate Obsidian
    stats: [
      { label: 'Shipped Systems', value: '15+', sub: 'Enterprise & Open Source' },
      { label: 'Core Disciplines', value: '4', sub: 'AI, Full-Stack, UI, Cloud' },
      { label: 'Graph Latency', value: '<10ms', sub: 'Deterministic Traversal' },
      { label: 'Code Craft', value: '60 FPS', sub: 'Optimized Rendering' }
    ],
    skills: [
      {
        category: 'Artificial Intelligence & Systems',
        items: [
          { name: 'Agentic AI Workflows', level: 'Expert', verified: true },
          { name: 'RAG & Vector Search', level: 'Expert', verified: true },
          { name: 'SQLite Associative Graphs', level: 'Expert', verified: true },
          { name: 'Python 3.12 / FastAPI', level: 'Expert', verified: true }
        ]
      },
      {
        category: 'Full-Stack & Languages',
        items: [
          { name: 'TypeScript / React 19', level: 'Expert', verified: true },
          { name: 'Node.js & Express', level: 'Proficient', verified: true },
          { name: 'Java & Object-Oriented Design', level: 'Proficient', verified: true },
          { name: 'C++ Systems Programming', level: 'Proficient', verified: true },
          { name: 'PostgreSQL & Supabase', level: 'Proficient', verified: true }
        ]
      },
      {
        category: 'UI/UX & Creative Engineering',
        items: [
          { name: 'Three.js & WebGL 2.0', level: 'Proficient', verified: true },
          { name: 'Tailwind CSS & Token Systems', level: 'Expert', verified: true },
          { name: 'Figma-to-Code Architecture', level: 'Expert', verified: true },
          { name: 'WCAG 2.1 AA Accessibility', level: 'Expert', verified: true }
        ]
      },
      {
        category: 'DevOps & Tooling',
        items: [
          { name: 'Git & GitHub Actions CI/CD', level: 'Expert', verified: true },
          { name: 'Docker & Containerization', level: 'Proficient', verified: true },
          { name: 'PowerShell & Bash Automation', level: 'Expert', verified: true },
          { name: 'Vercel & Cloud Deployment', level: 'Expert', verified: true }
        ]
      }
    ]
  },

  mrithula: {
    id: 'mrithula',
    name: 'Mrithula',
    title: 'Digital Product Designer & Creative Technologist',
    tagline: 'Crafting Human-Centered Interfaces, Intuitive Systems, and Brand Experiences.',
    bio: 'Product designer and creative technologist specializing in design systems, user experience research, accessible interaction models, and cross-disciplinary digital products.',
    focusAreas: [
      'UI/UX Design Systems & Design Token Architecture',
      'User Research, Information Architecture & Prototyping',
      'Accessible Digital Experiences & Interaction Design',
      'Frontend Prototyping & Design-Engineering Handover',
      'Brand Identity & Creative Direction'
    ],
    education: {
      institution: 'Undergraduate Program [Pending Mrithula Input]',
      degree: 'Bachelors Degree [Pending Mrithula Input]',
      period: '2023 — Present',
      details: 'Curriculum focused on digital design, cognitive ergonomics, and modern web interfaces.'
    },
    email: 'contact@sreeshmrithula.com',
    location: 'Bengaluru, India',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    accentColor: '#7A3B4D', // Warm Rose Burgundy
    stats: [
      { label: 'Design Systems', value: '10+', sub: 'Component Libraries' },
      { label: 'A11y Rating', value: 'AA+', sub: 'Accessible Standards' },
      { label: 'Figma Components', value: '500+', sub: 'Atomic Hierarchy' },
      { label: 'Collaborations', value: '5+', sub: 'Shared Products' }
    ],
    skills: [
      {
        category: 'Design & Prototyping',
        items: [
          { name: 'Figma & Design Systems', level: 'Expert', verified: true },
          { name: 'Wireframing & User Journey Mapping', level: 'Expert', verified: true },
          { name: 'High-Fidelity Interactive Prototypes', level: 'Expert', verified: true },
          { name: 'Micro-Interactions & Animation Specs', level: 'Proficient', verified: true }
        ]
      },
      {
        category: 'UI Engineering & Frontend',
        items: [
          { name: 'Modern CSS & Tailwind CSS', level: 'Proficient', verified: true },
          { name: 'HTML5 Semantic Architecture', level: 'Expert', verified: true },
          { name: 'React Component Architecture', level: 'Familiar', verified: true },
          { name: 'Responsive Mobile-First Grids', level: 'Expert', verified: true }
        ]
      },
      {
        category: 'Research & Strategy',
        items: [
          { name: 'Usability Testing & User Interviews', level: 'Proficient', verified: true },
          { name: 'Information Architecture (IA)', level: 'Expert', verified: true },
          { name: 'WCAG Accessibility Auditing', level: 'Proficient', verified: true },
          { name: 'Design Tokens Management', level: 'Expert', verified: true }
        ]
      }
    ]
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'antigravity-neural-os',
    slug: 'antigravity-neural-os',
    title: 'Antigravity Neural OS',
    tagline: 'Autonomous Multi-Agent Cognitive Architecture & Associative Graph Engine',
    description: 'A dual-layer multi-agent cognitive architecture featuring temporal memory decay, learned relationship weights, and an SQLite-backed neural associative graph. Orchestrates multi-agent pipelines with zero-trust local isolation.',
    category: 'ai',
    author: 'sreesh',
    featured: true,
    year: 2026,
    tags: ['Agentic AI', 'Python 3.12', 'SQLite Index', 'Knowledge Graph', 'Zero-Trust'],
    metrics: '13 Node Schema Types • Sub-10ms Graph Traversal',
    githubUrl: 'https://github.com/sreesh',
    liveUrl: '#',
    challenge: 'Managing persistent long-term associative memory across distributed agent conversations without memory degradation or secret leakage.',
    solution: 'Architected a canonical JSONL streaming engine backed by local SQLite indices, incorporating type-specific half-life decay formulas and isolated credential guards.',
    techStack: ['Python 3.12', 'SQLite', 'FastAPI', 'Deterministic Graph Hashing', 'PowerShell/Zsh'],
    keyFeatures: [
      'Temporal memory importance decay with diminishing return floors',
      'Bi-directional cross-platform synchronization between Windows & macOS',
      'Automated real-time graph integrity audits and dangling edge auto-repair',
      'Zero credential exposure with machine-isolated local boundary stores'
    ],
    results: [
      'Executed 250+ autonomous coding and planning cycles without state corruption',
      'Sub-10ms response times for neighborhood entity queries across 10,000+ nodes'
    ],
    status: 'completed'
  },
  {
    id: 'aether-bmw-m4',
    slug: 'aether-bmw-m4-experience',
    title: 'Aether BMW M4 3D Experience',
    tagline: 'Ultra-High Fidelity WebGL Automotive Configurator & Spatial Studio',
    description: 'A photorealistic 3D spatial interactive studio built with Three.js, featuring real-time HDR environment reflections, customizable metallic paints, physical interior camera orbits, and dynamic aero animations.',
    category: 'creative-ui',
    author: 'sreesh',
    featured: true,
    year: 2026,
    tags: ['Three.js', 'WebGL 2.0', 'GLTF/GLB', 'Tailwind CSS', 'Spatial UI'],
    metrics: '60 FPS Render Loop • 4K PBR Materials',
    githubUrl: 'https://github.com/sreesh',
    liveUrl: '#',
    challenge: 'Rendering dense polygonal automotive models with custom procedural shaders in the browser while maintaining high frame rates across mobile devices.',
    solution: 'Implemented adaptive Level of Detail (LOD), compressed Draco mesh buffers, dynamic shadow bias tuning, and an event-driven shader pipeline.',
    techStack: ['Three.js', 'WebGL 2.0', 'PostProcessing', 'Custom GLSL', 'Vite', 'React'],
    keyFeatures: [
      'HDR lighting with real-time environment cubemap reflections',
      'Interactive paint studio supporting pearlescent and satin clearcoat simulations',
      'Cinematic camera tracks with collision avoidance and smooth bezier lerping',
      'Adaptive mobile viewport scaling maintaining sustained 60 FPS'
    ],
    results: [
      'Zero hitching on modern mobile GPUs',
      'Sub-1.2s initial asset parse using Draco mesh compression'
    ],
    status: 'completed'
  },
  {
    id: 'studio-design-system',
    slug: 'studio-design-system',
    title: 'Atelier Design System & Token Architecture',
    tagline: 'Comprehensive Design Token System & Accessible Component Library',
    description: 'An editorial design system built for multidisciplinary digital products. Bridges Figma variables with CSS custom properties, ensuring WCAG 2.1 AA contrast compliance and seamless light/dark theming.',
    category: 'creative-ui',
    author: 'mrithula',
    featured: true,
    year: 2026,
    tags: ['Figma Tokens', 'Design Systems', 'WCAG AA', 'CSS Variables', 'UI/UX'],
    metrics: '500+ Design Tokens • 100% WCAG AA Compliance',
    githubUrl: 'https://github.com',
    liveUrl: '#',
    challenge: 'Creating a unified design system that allows engineering and design to stay synchronized across complex light and dark themes without visual drift.',
    solution: 'Established semantic token hierarchies (base, alias, component) combined with automated style-dictionary exports directly to Tailwind utility classes.',
    techStack: ['Figma', 'Design Tokens', 'Tailwind CSS', 'Radix UI', 'Storybook'],
    keyFeatures: [
      'Semantic color mapping supporting high-contrast accessible themes',
      'Fluid typographic scales based on harmonic ratios',
      'Interactive state definitions for all interactive elements',
      'Complete documentation guidelines for engineering handoff'
    ],
    results: [
      'Reduced design-to-code turnaround by over 60%',
      'Eliminated color contrast regressions across all responsive breakpoints'
    ],
    status: 'completed'
  },
  {
    id: 'aethel-intelligence',
    slug: 'aethel-intelligence-platform',
    title: 'Aethel Collaborative Workspace',
    tagline: 'Dual-Identity Studio Operating System & Shared Productivity Engine',
    description: 'A joint software product and productivity cockpit designed for paired creative technologists. Integrates Kanban task pipelines, real-time Markdown notes, asset organization, and portfolio synchronization.',
    category: 'fullstack',
    author: 'collaborative',
    featured: true,
    year: 2026,
    tags: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL RLS', 'Collaborative'],
    metrics: 'Real-Time Sync • Row Level Security • Zero Data Leaks',
    githubUrl: 'https://github.com',
    liveUrl: '#',
    challenge: 'Designing a platform that provides equal visual prominence and independent management for two creative professionals while offering a private shared operating cockpit.',
    solution: 'Engineered a unified architecture utilizing Supabase Row Level Security (RLS) to strictly segregate private studio tasks while serving high-speed public portfolio queries.',
    techStack: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Lucide'],
    keyFeatures: [
      'Interactive dual-identity hero with smooth profile switching',
      'Private Kanban task board with dual-assignment workflows',
      'Markdown knowledge repository with real-time tag search',
      'Unified contact routing system with encrypted sender privacy'
    ],
    results: [
      'Centralized all personal and joint project management into one unified domain',
      'Lighthouse performance and accessibility scores exceeding 95'
    ],
    status: 'completed'
  },
  {
    id: 'opensign-isl',
    slug: 'opensign-isl-recognition',
    title: 'OpenSign — Indian Sign Language AI',
    tagline: 'Computer Vision & Deep Learning for Real-Time Gesture Recognition',
    description: 'An assistive technology pipeline employing MediaPipe holistic spatial coordinates and temporal sequence classification to transcribe Indian Sign Language (ISL) gestures in real-time.',
    category: 'ai',
    author: 'sreesh',
    featured: false,
    year: 2025,
    tags: ['Computer Vision', 'PyTorch', 'MediaPipe', 'Assistive Tech', 'FastAPI'],
    metrics: '94.2% Validation Accuracy • Real-Time Webcam Stream',
    githubUrl: 'https://github.com/sreesh',
    liveUrl: '#',
    challenge: 'Accurately capturing spatial hand coordinates and facial micro-expressions with minimal latency using standard low-cost laptop webcams.',
    solution: 'Designed a lightweight landmark extraction pipeline feeding an optimized LSTM sequence classifier with custom data augmentation.',
    techStack: ['Python', 'MediaPipe', 'OpenCV', 'PyTorch', 'FastAPI'],
    status: 'completed'
  },
  {
    id: 'cybersentinel-soc',
    slug: 'cybersentinel-soc',
    title: 'CyberSentinel AI SOC',
    tagline: 'Real-Time Cyber Threat Intelligence & Anomaly Detection',
    description: 'An enterprise Security Operations Center (SOC) dashboard that streams telemetry data, flags zero-day heuristics with automated AI triage, and orchestrates incident containment workflows.',
    category: 'systems',
    author: 'sreesh',
    featured: false,
    year: 2026,
    tags: ['Next.js', 'TypeScript', 'WebSockets', 'Cybersecurity', 'Telemetry'],
    metrics: '10,000+ Events/Sec • Real-time Threat Heatmap',
    githubUrl: 'https://github.com/sreesh',
    liveUrl: '#',
    status: 'completed'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    recipient: 'sreesh',
    title: 'Thinkathon National AI Innovation Challenge',
    issuer: 'National Technical Forum',
    date: '2026',
    category: 'hackathon',
    description: 'Recognized for engineering an autonomous multi-agent software architecture utilizing localized vector search and zero-trust security boundaries.'
  },
  {
    id: 'ach-2',
    recipient: 'mrithula',
    title: 'UX Excellence Design Fellowship',
    issuer: 'Design Craft Institute',
    date: '2025',
    category: 'award',
    description: 'Awarded for exceptional design system architecture, atomic design token scalability, and accessibility-first mobile experiences.'
  },
  {
    id: 'ach-3',
    recipient: 'both',
    title: 'Best Collaborative Product Architecture Award',
    issuer: 'Inter-College Hackathon 2025',
    date: '2025',
    category: 'hackathon',
    description: 'Secured Top Honors for building an integrated hardware-software emergency coordination platform connecting drone telemetry with real-time mobile maps.'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 't-1',
    recipient: 'both',
    year: '2026',
    title: 'Sreesh × Mrithula Digital Studio Founded',
    organization: 'Creative Technology Studio',
    description: 'United independent engineering and design practices into a unified platform to ship production-grade digital products.',
    category: 'milestone'
  },
  {
    id: 't-2',
    recipient: 'sreesh',
    year: '2025',
    title: 'Architected Antigravity Neural OS',
    organization: 'Open Source Research',
    description: 'Developed an associative knowledge graph with temporal decay equations and cross-platform sync capabilities.',
    category: 'project'
  },
  {
    id: 't-3',
    recipient: 'mrithula',
    year: '2025',
    title: 'Atelier Design Tokens Release',
    organization: 'Design Systems Research',
    description: 'Published an accessible semantic design token architecture linking Figma to production CSS custom properties.',
    category: 'project'
  },
  {
    id: 't-4',
    recipient: 'both',
    year: '2024',
    title: 'Hackathon Collaboration & Research',
    organization: 'National Hackathon Series',
    description: 'Collaborated on end-to-end accessibility engineering and real-time computer vision prototypes.',
    category: 'hackathon'
  }
];

export const INITIAL_TASKS: WorkspaceTask[] = [
  {
    id: 'task-1',
    title: 'Finalize ATS-friendly resume export template',
    description: 'Ensure clean page breaks and single-page printable PDF rendering',
    assignedTo: 'sreesh',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-15',
    createdAt: '2026-11-08'
  },
  {
    id: 'task-2',
    title: 'Design token audit for high-contrast light mode',
    description: 'Verify all secondary text contrast ratios pass WCAG AA (4.5:1 ratio)',
    assignedTo: 'mrithula',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-11-18',
    createdAt: '2026-11-08'
  },
  {
    id: 'task-3',
    title: 'Draft collaborative whitepaper on Dual-Identity web experiences',
    description: 'Document architecture, RLS security policies, and UX heuristics',
    assignedTo: 'sreesh',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-11-25',
    createdAt: '2026-11-08'
  }
];

export const INITIAL_NOTES: WorkspaceNote[] = [
  {
    id: 'note-1',
    title: 'Studio Architecture & Security Contract',
    author: 'sreesh',
    content: `# SREESH × MRITHULA — Security Architecture

## Guiding Rule
Public routes must strictly query sanitized endpoints with zero exposure of private notes, tasks, or contact credentials.

### Storage & Database:
- PostgreSQL 15 with strict Row Level Security (RLS)
- Authenticated accounts: Sreesh M & Mrithula
- Edge caching for project case studies and public profiles
`,
    tags: ['Architecture', 'Security', 'Supabase'],
    updatedAt: '2026-11-08'
  },
  {
    id: 'note-2',
    title: 'Editorial Typography Rules',
    author: 'mrithula',
    content: `# Editorial Design Guidelines

1. **Hierarchy First**: Headings should use Space Grotesk and Instrument Serif for dramatic contrast.
2. **Body Text**: Maintain comfortable 65-75 character line lengths for long-form case studies.
3. **Restraint**: Never use more than two accent colors on the same screen.
`,
    tags: ['Design', 'Typography', 'Tokens'],
    updatedAt: '2026-11-08'
  }
];
