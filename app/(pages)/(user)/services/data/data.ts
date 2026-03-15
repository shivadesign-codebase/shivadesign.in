import {
  FileText,
  CuboidIcon as Cube,
  Sofa,
  ClipboardCheck,
  Calculator,
  Compass,
} from "lucide-react";

export type Service = {
  title: string
  image: string
  description: string
  keywords: string[]
  sectionTitle: string
  content: string
  faqs: { q: string; a: string }[]
};

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
  },
];

export const dynamicPageServices: Record<string, Service> = {

  "autocad-drafting": {
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
};
