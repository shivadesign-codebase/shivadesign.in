import {
  FileText,
  CuboidIcon as Cube,
  Sofa,
  ClipboardCheck,
  Calculator,
  Compass,
} from "lucide-react";

export type PricingTier = {
  name: string
  price: string
  timeline: string
  bestFor: string
  features: string[]
}

export type Service = {
  slug: string
  title: string
  image: string
  description: string
  keywords: string[]
  sectionTitle: string
  content: string
  sampleCategories: string[]
  pitch: string
  outcomes: string[]
  pricing: PricingTier[]
  ctaHeadline: string
  ctaDescription: string
  ctaButtonLabel: string
  faqs: { q: string; a: string }[]
}

export const services = [
  {
    slug: "autocad-drafting",
    title: "AutoCAD Drafting",
    description:
      "Precision drafting services using AutoCAD to create accurate technical drawings for construction projects.",
    icon: FileText,
    image: "/assets/services/autocad.jpeg",
    keywords: [
      "autocad drafting maharajganj",
      "architectural drafting services",
      "house plan autocad drawing",
    ],
    startingPrice: "INR 8,999",
    salesTagline: "Construction-ready plans with fast revision cycles.",
  },

  {
    slug: "3d-elevation",
    title: "3D & 2D Elevation",
    description:
      "Modern 3D elevation and front elevation design services for residential and commercial buildings.",
    icon: Cube,
    image: "/assets/services/elevation.jpeg",
    keywords: [
      "3d elevation design maharajganj",
      "house front elevation design",
      "modern elevation architect",
    ],
    startingPrice: "INR 11,999",
    salesTagline: "See your facade before construction starts.",
  },

  {
    slug: "interior-designing",
    title: "Interior Designing",
    description:
      "Creative interior design solutions that combine comfort, aesthetics, and functionality.",
    icon: Sofa,
    image: "/assets/services/interior.jpeg",
    keywords: [
      "interior designer maharajganj",
      "modern interior design",
      "home interior planning",
    ],
    startingPrice: "INR 14,999",
    salesTagline: "Functional spaces tailored to your daily life.",
  },

  {
    slug: "map-approval",
    title: "Map Government Approval",
    description:
      "Complete assistance with building map approval and required documentation for construction projects.",
    icon: ClipboardCheck,
    image: "/assets/services/approval.jpeg",
    keywords: [
      "map approval maharajganj",
      "house plan approval UP",
      "building plan approval architect",
    ],
    startingPrice: "INR 9,499",
    salesTagline: "Approval support without paperwork confusion.",
  },

  {
    slug: "construction-estimate",
    title: "Construction Cost Estimation",
    description:
      "Detailed cost estimation for construction projects helping clients plan budgets effectively.",
    icon: Calculator,
    image: "/assets/services/estimate.jpeg",
    keywords: [
      "construction estimate maharajganj",
      "building cost estimation UP",
      "house construction budgeting",
    ],
    startingPrice: "INR 7,999",
    salesTagline: "Budget clarity before you break ground.",
  },

  {
    slug: "vastu-consultation",
    title: "Vastu Based Design",
    description:
      "Architectural planning based on Vastu Shastra principles to create balanced and harmonious spaces.",
    icon: Compass,
    image: "/assets/services/vastu.jpeg",
    keywords: [
      "vastu consultant maharajganj",
      "vastu house design",
      "vastu architect UP",
    ],
    startingPrice: "INR 6,499",
    salesTagline: "Vastu aligned planning for balanced living.",
  },
]

export const serviceBundle = {
  title: "Launch Bundle",
  subtitle: "Planning + Elevation + Interiors + Budget + Approval Support",
  originalPrice: "INR 64,000",
  discountedPrice: "INR 49,000",
  savings: "Save INR 15,000",
  timeline: "3 to 5 weeks",
  includes: [
    "AutoCAD floor planning and layout optimization",
    "2 exterior 3D elevation concepts with 2 revisions",
    "One key-room interior concept with furniture layout",
    "Construction estimate with material-level breakups",
    "Map approval drawing set and document guidance",
  ],
  ctaButtonLabel: "Get Your Design Now",
}

export const dynamicPageServices: Record<string, Service> = {

  "autocad-drafting": {
    slug: "autocad-drafting",
    title: "AutoCAD Drafting Services",
    image: "/assets/services/autocad.jpeg",

    description:
      "Professional AutoCAD drafting services in Maharajganj for residential and commercial construction projects. We create accurate architectural drawings, house plans, structural layouts, and technical construction drawings used by engineers, architects, and contractors.",

    keywords: [
      "autocad drafting maharajganj",
      "house plan drawing maharajganj",
      "architectural drafting services UP",
      "autocad house plan design",
      "building plan drafting gorakhpur",
      "architect autocad drawing purvanchal",
      "technical drawing architect maharajganj"
    ],

    sectionTitle: "Accurate Architectural Drawings with AutoCAD",

    content:
      "Our AutoCAD drafting services help transform architectural concepts into precise technical drawings used for construction and planning. We create detailed house plans, structural layouts, electrical plans, and architectural drawings that ensure clarity and accuracy for engineers and builders. Whether you are planning a residential home, duplex, commercial building, or renovation project, our AutoCAD drawings help streamline the construction process and avoid costly design errors.",

    sampleCategories: ["AutoCAD 2D Design"],

    pitch:
      "Need clean, precise plans your contractor can execute without confusion? Our drafting packages are engineered to reduce rework and speed up site execution.",

    outcomes: [
      "Scaled floor plans and construction-ready layouts",
      "Dedicated revision rounds before final delivery",
      "Dimension-accurate files suitable for approvals and execution",
    ],

    pricing: [
      {
        name: "Starter Draft",
        price: "INR 8,999",
        timeline: "4 business days",
        bestFor: "Small home floor plan",
        features: [
          "Single-floor AutoCAD plan",
          "One revision round",
          "PDF + source file delivery",
        ],
      },
      {
        name: "Execution Draft",
        price: "INR 14,999",
        timeline: "6 business days",
        bestFor: "Duplex and multi-room homes",
        features: [
          "Floor plan + section details",
          "Two revision rounds",
          "Electrical and plumbing markups",
        ],
      },
      {
        name: "Builder Pro",
        price: "INR 22,999",
        timeline: "8 business days",
        bestFor: "Complex homes and small commercial projects",
        features: [
          "Detailed execution drawing set",
          "Three revision rounds",
          "Site-call support for clarification",
        ],
      },
    ],

    ctaHeadline: "Ready to convert your idea into contractor-ready drawings?",
    ctaDescription: "Start with a drafting consultation and receive a plan roadmap before execution.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "What is AutoCAD drafting in architecture?",
        a: "AutoCAD drafting is the process of creating detailed architectural and engineering drawings using AutoCAD software. These drawings include floor plans, building layouts, structural plans, and technical construction diagrams."
      },
      {
        q: "Do you provide AutoCAD drafting services in Maharajganj?",
        a: "Yes. Shiva Design Associates provides professional AutoCAD drafting services in Maharajganj for residential homes, commercial buildings, and renovation projects."
      },
      {
        q: "Can you prepare house plans using AutoCAD?",
        a: "Yes. We create accurate house plan drawings using AutoCAD including floor layouts, elevation drawings, and construction-ready architectural plans."
      },
      {
        q: "Do you provide drafting services in Gorakhpur or Purvanchal?",
        a: "Yes. Our architectural drafting services are available across Purvanchal including Gorakhpur, Pharenda, Nichlaul, and nearby areas."
      },
      {
        q: "Why are AutoCAD drawings important for construction?",
        a: "AutoCAD drawings ensure accurate measurements, structural clarity, and proper communication between architects, engineers, and contractors during construction."
      }
    ]
  },

  "3d-elevation": {
    slug: "3d-elevation",
    title: "3D Elevation Design",
    image: "/assets/services/elevation.jpeg",
    description:
      "Professional 3D elevation design services in Maharajganj helping homeowners and builders visualize modern residential and commercial buildings before construction begins. Our architectural elevation designs combine aesthetics, functionality, and structural practicality to create visually impressive homes.",

    keywords: [
      "3d elevation design maharajganj",
      "house elevation design UP",
      "modern home elevation architect",
      "front elevation design architect",
      "3d house design maharajganj"
    ],

    sectionTitle: "Modern 3D Elevation Designs for Dream Homes",

    content:
      "Our 3D elevation design services help clients visualize the exterior look of their buildings before construction begins. Using modern architectural design techniques and 3D visualization tools, we create realistic building elevations that reflect the client's vision and architectural style. Whether you are planning a small residential home, duplex, villa, or commercial building, our elevation designs ensure the structure looks elegant while maintaining practical construction feasibility.",

    sampleCategories: ["3D Elevation"],

    pitch:
      "Before spending on materials, lock your facade direction with realistic elevation previews and expert guidance.",

    outcomes: [
      "Photoreal elevation visualization before site work",
      "Material and finish suggestions for local conditions",
      "Faster decisions with side-by-side concept options",
    ],

    pricing: [
      {
        name: "Concept Elevation",
        price: "INR 11,999",
        timeline: "5 business days",
        bestFor: "Single-home facade concept",
        features: [
          "One elevation concept",
          "Two material palettes",
          "One revision round",
        ],
      },
      {
        name: "Premium Elevation",
        price: "INR 18,999",
        timeline: "7 business days",
        bestFor: "Modern home or duplex",
        features: [
          "Two design directions",
          "Day and evening renders",
          "Two revision rounds",
        ],
      },
      {
        name: "Signature Facade",
        price: "INR 29,999",
        timeline: "10 business days",
        bestFor: "Luxury homes and standout facades",
        features: [
          "Three high-detail concepts",
          "Landscape + lighting suggestions",
          "Three revision rounds",
        ],
      },
    ],

    ctaHeadline: "Want your first impression to feel premium?",
    ctaDescription: "Tell us your plot and style preference, and we will craft your elevation direction.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "Do you provide 3D elevation design services in Maharajganj?",
        a: "Yes. Shiva Design Associates provides professional 3D elevation design services in Maharajganj and surrounding areas."
      },
      {
        q: "Do you offer house elevation design services in Gorakhpur and Purvanchal?",
        a: "Yes, we provide architectural design services across Purvanchal including Gorakhpur, Pharenda, Nichlaul, and nearby regions."
      },
      {
        q: "Can you design elevations for modern homes?",
        a: "Yes. We specialize in modern house elevation designs including contemporary, minimalist, and luxury styles."
      }
    ]
  },

  "interior-designing": {
    slug: "interior-designing",
    title: "Interior Designing",
    image: "/assets/services/interior.jpeg",
    description:
      "Professional interior design services in Maharajganj creating elegant, functional, and modern interior spaces for homes, offices, and commercial properties.",

    keywords: [
      "interior designer maharajganj",
      "home interior design UP",
      "modern interior designer maharajganj",
      "residential interior design architect",
      "interior design services maharajganj"
    ],

    sectionTitle: "Modern Interior Design for Comfortable Living",

    content:
      "Our interior design services focus on creating comfortable and visually appealing living spaces. We carefully plan layouts, furniture placement, lighting, and color schemes to create interiors that reflect the personality and lifestyle of our clients. Whether designing a living room, bedroom, kitchen, or office space, our goal is to combine functionality with modern design aesthetics.",

    sampleCategories: ["Interior Design"],

    pitch:
      "Turn every room into a high-function, low-stress space. We design interiors around your routines, not generic templates.",

    outcomes: [
      "Space-optimized layouts for better movement",
      "Cohesive color, lighting, and furniture planning",
      "Execution-ready design recommendations",
    ],

    pricing: [
      {
        name: "Room Refresh",
        price: "INR 14,999",
        timeline: "6 business days",
        bestFor: "Single room makeover",
        features: [
          "One room concept board",
          "Furniture and lighting layout",
          "One revision round",
        ],
      },
      {
        name: "Home Flow Plan",
        price: "INR 27,999",
        timeline: "10 business days",
        bestFor: "2 to 3 connected rooms",
        features: [
          "Multi-room design direction",
          "Storage optimization recommendations",
          "Two revision rounds",
        ],
      },
      {
        name: "Complete Interior",
        price: "INR 44,999",
        timeline: "14 business days",
        bestFor: "Full-home planning",
        features: [
          "Whole-home concept strategy",
          "Material and furniture specification list",
          "Three revision rounds",
        ],
      },
    ],

    ctaHeadline: "Ready to make your space work beautifully every day?",
    ctaDescription: "Share your room photos and goals, and we will map a practical interior plan.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "Do you provide interior designing services in Maharajganj?",
        a: "Yes. We provide interior design services in Maharajganj, Gorakhpur, and nearby towns across Purvanchal."
      },
      {
        q: "Can you design interiors for small homes or apartments?",
        a: "Yes. Our interior design solutions focus on space optimization and modern layouts suitable for both large and small homes."
      },
      {
        q: "Do you work on interior projects in Gorakhpur or Nichlaul?",
        a: "Yes. Shiva Design Associates provides interior design services across Maharajganj district including Nichlaul, Pharenda, and Gorakhpur."
      }
    ]
  },

  "vastu-consultation": {
    slug: "vastu-consultation",
    title: "Vastu Consultation",
    image: "/assets/services/vastu.jpeg",
    description:
      "Professional Vastu consultation services for residential and commercial buildings in Maharajganj helping create balanced and harmonious living spaces.",

    keywords: [
      "vastu consultant maharajganj",
      "vastu architect UP",
      "vastu for house planning",
      "vastu expert maharajganj",
      "vastu compliant house design"
    ],

    sectionTitle: "Vastu Based Architectural Planning",

    content:
      "Our Vastu consultation services combine traditional Vastu Shastra principles with modern architectural planning. By aligning building layouts with Vastu guidelines, we help create homes that promote harmony, positivity, and balanced energy flow. Our consultation helps homeowners plan room placements, entrances, kitchens, and other important spaces according to Vastu principles.",

    sampleCategories: ["AutoCAD 2D Design", "Interior Design"],

    pitch:
      "Blend cultural comfort with modern planning. We align your layout with Vastu priorities while keeping your day-to-day functionality intact.",

    outcomes: [
      "Room-wise Vastu recommendations with practical alternatives",
      "Improved placement strategy for key functional zones",
      "Guided adjustments for existing and new layouts",
    ],

    pricing: [
      {
        name: "Vastu Check",
        price: "INR 6,499",
        timeline: "3 business days",
        bestFor: "Basic home layout review",
        features: [
          "Existing plan analysis",
          "Priority issue list",
          "One online discussion",
        ],
      },
      {
        name: "Vastu Guided Plan",
        price: "INR 12,999",
        timeline: "5 business days",
        bestFor: "New layout planning",
        features: [
          "Fresh Vastu-aligned layout strategy",
          "Room placement guidance",
          "Two follow-up clarifications",
        ],
      },
      {
        name: "Vastu + Design Sync",
        price: "INR 19,999",
        timeline: "7 business days",
        bestFor: "Vastu integration with interiors",
        features: [
          "Vastu + interior adjustment suggestions",
          "Entry, kitchen, bedroom optimization",
          "Actionable implementation checklist",
        ],
      },
    ],

    ctaHeadline: "Looking for harmony without compromising modern usability?",
    ctaDescription: "Get a Vastu consultation adapted for practical contemporary homes.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "Do you provide Vastu consultation in Maharajganj?",
        a: "Yes. We provide Vastu consultation services for residential and commercial properties in Maharajganj."
      },
      {
        q: "Is Vastu consultation available in Gorakhpur and Purvanchal?",
        a: "Yes. Our Vastu based architectural planning services are available across Purvanchal including Gorakhpur, Pharenda, and Nichlaul."
      },
      {
        q: "Can Vastu principles be applied to modern house designs?",
        a: "Yes. We integrate Vastu principles into modern architectural designs without compromising functionality or aesthetics."
      }
    ]
  },

  "construction-estimate": {
    slug: "construction-estimate",
    title: "Construction Cost Estimation",
    image: "/assets/services/estimate.jpeg",
    description:
      "Accurate construction cost estimation services helping homeowners understand building budgets before starting construction.",

    keywords: [
      "construction cost estimation maharajganj",
      "house construction cost UP",
      "building estimate architect",
      "construction budgeting architect",
      "house building cost planning"
    ],

    sectionTitle: "Accurate Construction Budget Planning",

    content:
      "Our construction cost estimation services help clients understand the approximate budget required for building their house or commercial project. We analyze material costs, labor expenses, and structural requirements to prepare reliable cost estimates. This helps homeowners plan their construction budget and avoid unexpected financial challenges during the building process.",

    sampleCategories: ["Site Inspection", "AutoCAD 2D Design"],

    pitch:
      "Avoid budget shock. We break down expected costs early so you can build with confidence and control.",

    outcomes: [
      "Category-wise cost sheet for materials and labor",
      "Budget scenarios for phased construction",
      "Early risk flags for high-variance cost items",
    ],

    pricing: [
      {
        name: "Quick Estimate",
        price: "INR 7,999",
        timeline: "3 business days",
        bestFor: "Small residential projects",
        features: [
          "Built-up area cost estimate",
          "Primary material assumptions",
          "One revision update",
        ],
      },
      {
        name: "Detailed Estimate",
        price: "INR 13,999",
        timeline: "5 business days",
        bestFor: "Mid-size homes and duplexes",
        features: [
          "Labor + material breakup",
          "Stage-wise spend forecast",
          "Two revision rounds",
        ],
      },
      {
        name: "Build Control Pack",
        price: "INR 21,999",
        timeline: "7 business days",
        bestFor: "Budget-sensitive or larger builds",
        features: [
          "Comprehensive estimate dashboard",
          "Contingency and variance planning",
          "Periodic advisory call",
        ],
      },
    ],

    ctaHeadline: "Want to start construction with budget certainty?",
    ctaDescription: "Send your plan and we will map a realistic cost range before execution.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "Do you provide house construction cost estimates in Maharajganj?",
        a: "Yes. We provide construction cost estimation services for residential and commercial buildings in Maharajganj."
      },
      {
        q: "Can you estimate house construction cost in Purvanchal?",
        a: "Yes. We prepare cost estimates for projects across Purvanchal including Gorakhpur, Nichlaul, and Pharenda."
      },
      {
        q: "What factors affect house construction cost?",
        a: "Construction cost depends on building size, materials used, architectural complexity, and labor charges."
      }
    ]
  },

  "map-approval": {
    slug: "map-approval",
    title: "Building Map Approval",
    image: "/assets/services/approval.jpeg",
    description:
      "Professional building map approval services helping clients obtain government approvals for residential and commercial construction projects.",

    keywords: [
      "building map approval maharajganj",
      "house map approval UP",
      "construction approval architect",
      "municipal building plan approval",
      "house plan approval services"
    ],

    sectionTitle: "Government Building Plan Approval Assistance",

    content:
      "Our building map approval services help homeowners and developers obtain necessary approvals from local authorities before starting construction. We prepare the required architectural drawings and documentation according to government regulations. This ensures that your construction project follows legal guidelines and avoids approval delays.",

    sampleCategories: ["AutoCAD 2D Design", "Site Inspection"],

    pitch:
      "Skip the approval stress. We prepare compliant submissions and guide your document journey from first draft to final clearance.",

    outcomes: [
      "Regulation-aligned drawing preparation",
      "Document checklist and application support",
      "Reduced back-and-forth with authorities",
    ],

    pricing: [
      {
        name: "Approval Starter",
        price: "INR 9,499",
        timeline: "5 business days",
        bestFor: "Standard residential approvals",
        features: [
          "Submission drawing set",
          "Document checklist",
          "One round of correction support",
        ],
      },
      {
        name: "Approval Assist Plus",
        price: "INR 16,999",
        timeline: "8 business days",
        bestFor: "Complex residential layouts",
        features: [
          "Advanced compliance drawing prep",
          "Two correction rounds",
          "Process guidance until approval decision",
        ],
      },
      {
        name: "Priority Approval Desk",
        price: "INR 24,999",
        timeline: "10 business days",
        bestFor: "Projects needing close handholding",
        features: [
          "End-to-end approval document workflow",
          "Dedicated support channel",
          "Escalation guidance for objections",
        ],
      },
    ],

    ctaHeadline: "Need your map approved without endless follow-ups?",
    ctaDescription: "Share your plot and draft plan to start your approval-ready package.",
    ctaButtonLabel: "Get Your Design Now",

    faqs: [
      {
        q: "Do you provide building map approval services in Maharajganj?",
        a: "Yes. We help clients obtain building plan approvals in Maharajganj and nearby towns."
      },
      {
        q: "Can you help with house map approval in Gorakhpur or Pharenda?",
        a: "Yes. Our team assists with building map approvals across Purvanchal including Gorakhpur, Pharenda, and Nichlaul."
      },
      {
        q: "Why is map approval required before construction?",
        a: "Government approval ensures that the building design complies with local construction regulations and safety standards."
      }
    ]
  }
}
