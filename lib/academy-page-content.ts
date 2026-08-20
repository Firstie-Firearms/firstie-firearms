import type { Academy } from "@/types"

export interface AcademyFaqItem {
  question: string
  answer: string
}

export interface AcademyPageContent {
  breadcrumbLabel: string
  heroHeading: string
  heroParagraphs: string[]
  heroImageQuery: string
  /**
   * Optional real product photo to use for the collection-page hero instead
   * of the generic placeholder built from heroImageQuery. Only USNA sets
   * this today; USMA/USAFA keep using the placeholder until they have their
   * own real photography.
   */
  heroImageSrc?: string
  collectionHeading: string
  whyHeading: string
  whyParagraphs: string[]
  craftsmanshipHeading: string
  craftsmanshipParagraphs: string[]
  whoHeading: string
  whoParagraphs: string[]
  faqHeading: string
  faqs: AcademyFaqItem[]
}

/**
 * Evergreen, academy-specific copy for the academy collection pages.
 * Each academy's paragraphs are written independently (not templated from
 * a shared string) so no marketing copy is duplicated between academies.
 * All claims are limited to what the rest of the site already states —
 * no endorsement, affiliation, or relationship with USNA, USMA, USAFA, or
 * the Department of Defense is implied anywhere below.
 */
export const ACADEMY_PAGE_CONTENT: Record<Academy, AcademyPageContent> = {
  USNA: {
    breadcrumbLabel: "Naval Academy",
    heroHeading: "Commemorative Pistols for the Classes of the United States Naval Academy",
    heroParagraphs: [
      "Firstie Firearms builds made-to-order commemorative pistols for graduates of the United States Naval Academy, with each class receiving its own class-specific engraving, finish, and presentation case.",
      "This page is the permanent home for the Naval Academy collection. As new classes are added, they will appear here alongside the classes that came before them, so this is always the place to see every Naval Academy edition Firstie Firearms has released.",
    ],
    heroImageQuery: "custom engraved GLOCK 19X V pistol USNA Naval Academy commemorative on dark tactical background",
    heroImageSrc: "/usna-2027/usna-collection-hero-pistol.jpg",
    collectionHeading: "Naval Academy Class Collection",
    whyHeading: "Designed to Mark the Transition from Midshipman to Officer",
    whyParagraphs: [
      "Graduation and commissioning from the United States Naval Academy represent the culmination of four demanding years and the beginning of a life of service in the Navy or Marine Corps. The Firstie Firearms Naval Academy Collection is built to honor that transition with a commemorative piece worthy of the accomplishment.",
      "Each class receives a design created specifically for its own place in Naval Academy history. The engraving, finishes, colors, and presentation are considered together so the finished piece reflects both the traditions of the Academy and the identity of the class it represents. It is not simply a Naval Academy-themed firearm. It is a piece created to mark one class, one commissioning, and one extraordinary milestone.",
    ],
    craftsmanshipHeading: "Every Detail Chosen With Purpose",
    craftsmanshipParagraphs: [
      "Each commemorative piece begins as a new GLOCK 19X V and is transformed through deep, multi-layer laser engraving, hand finishing, and carefully selected Cerakote finishes. Every color is chosen intentionally to complement the artwork and reflect the character and traditions of the sea services, creating a piece that feels distinguished without becoming ornamental for ornament's sake.",
      "That same attention extends to the presentation case. Each case is designed specifically for the Naval Academy Collection, with details that reinforce the history, traditions, and significance of Annapolis. From the pistol to the case that surrounds it, every element is considered as part of a single presentation built to honor the person receiving it.",
    ],
    whoHeading: "Built to Honor the Achievement—and Carry It Forward",
    whoParagraphs: [
      "The Naval Academy Collection is created for graduating midshipmen, parents and families marking commissioning, and alumni who want a lasting connection to their own class. Each piece is intended to be both commemorative and functional: a firearm that can be carried to the range today and, with proper care, passed forward as a reminder of the service, commitment, and achievement it represents.",
      "Because every edition is tied to a specific graduating class, the collection offers something more personal than a general Naval Academy keepsake. It marks the recipient's own place in the history of the Brigade and the moment they joined the generations of officers who came before them.",
    ],
    faqHeading: "Naval Academy Collection FAQ",
    faqs: [
      {
        question: "What classes are currently available in the Naval Academy collection?",
        answer:
          "The USNA Class of 2027 is the current commemorative edition and is available to order now. Additional class years appear on this page as they become available.",
      },
      {
        question: "Are the designs different for each graduating class?",
        answer:
          "Yes. Each class's pistol is engraved with artwork, mottos, and symbols specific to that class's own crest and traditions, rather than a single generic Naval Academy design.",
      },
      {
        question: "Can an alumnus order a previous class's design?",
        answer:
          "The class-specific design for each graduating year is available on that class's own page, linked from the collection above. Reach out to Firstie Firearms directly with questions about ordering a design from a class other than the current one.",
      },
      {
        question: "How do I view the current Naval Academy class design?",
        answer:
          "Select the Class of 2027 card above, or use the link in the collection grid, to go to the current USNA product page with full photography and specifications.",
      },
      {
        question: "Will additional Naval Academy classes be added to this page?",
        answer:
          "Yes. As new classes are released, they will be added directly to this collection page rather than requiring a new page, so this remains the permanent place to find every Naval Academy edition.",
      },
      {
        question: "Does Firstie Firearms ship the pistol directly to my home?",
        answer:
          "No. As with every Firstie Firearms product, the completed pistol ships to a licensed FFL dealer of your choosing, who completes the transfer to you in compliance with federal and state law.",
      },
    ],
  },
  USMA: {
    breadcrumbLabel: "United States Military Academy",
    heroHeading: "Commemorative Pistols for the Classes of the United States Military Academy",
    heroParagraphs: [
      "Firstie Firearms builds made-to-order commemorative pistols for graduates of the United States Military Academy at West Point, with each class receiving its own class-specific engraving, finish, and presentation case.",
      "This page is the permanent home for the West Point collection. As new classes are added over time, they will appear here alongside the classes before them, making this the lasting reference point for every West Point edition Firstie Firearms releases.",
    ],
    heroImageQuery: "custom engraved GLOCK 19X V pistol USMA West Point commemorative on dark tactical background",
    collectionHeading: "United States Military Academy Class Collection",
    whyHeading: "Designed to Mark the Transition from Cadet to Officer",
    whyParagraphs: [
      "Graduation and commissioning from the United States Military Academy mark the end of four demanding years at West Point and the beginning of a career of service in the United States Army. The Firstie Firearms West Point Collection is built to commemorate that moment with a piece shaped by the traditions, character, and history of the Academy.",
      "Each class receives a design created specifically for its own place in the Long Gray Line. The engraving, finishes, colors, and presentation are developed together so the finished piece reflects both West Point and the class it was created to honor. Rather than producing a single design for every graduate, each edition is intended to preserve the identity of a particular class and the moment its members transitioned from cadets to commissioned officers.",
    ],
    craftsmanshipHeading: "Every Detail Chosen With Purpose",
    craftsmanshipParagraphs: [
      "Each commemorative piece begins as a new GLOCK 19X V and is transformed through deep, multi-layer laser engraving, careful hand finishing, and deliberately selected Cerakote finishes. Every color is hand selected to complement the artwork while drawing from the military character and traditions associated with West Point and the Army.",
      "The presentation case receives the same level of attention. Each case is detailed specifically for the West Point Collection, incorporating elements intended to reinforce the history, traditions, and significance of the Academy. Nothing is treated as an afterthought. The firearm, finishes, engraving, and case are designed as a complete presentation, with each decision made to honor the graduating and commissioning recipient.",
    ],
    whoHeading: "Built to Honor the Achievement—and Carry It Forward",
    whoParagraphs: [
      "The West Point Collection is created for graduating cadets, families celebrating commissioning, and alumni who want a lasting connection to their own class and Academy. Each piece is designed to live beyond the ceremony—as a functional firearm worthy of the range and a commemorative piece intended to be preserved for generations.",
      "Tying every edition to a specific graduating class makes the collection personal. It is not simply a reminder of West Point. It represents the recipient's own class, their years as a cadet, and their place within the Long Gray Line.",
    ],
    faqHeading: "United States Military Academy Collection FAQ",
    faqs: [
      {
        question: "What classes are currently available in the West Point collection?",
        answer:
          "Additional class years, beginning with the Class of 2027, appear on this page as their designs become available. Check back here for the latest status of each class.",
      },
      {
        question: "Are the designs different for each graduating class?",
        answer:
          "Yes. Each class's pistol is intended to be engraved with artwork and symbols specific to that class, rather than a single design shared across all West Point graduates.",
      },
      {
        question: "Can an alumnus order a previous class's design?",
        answer:
          "The design for each graduating year is available on that class's own page, linked from the collection above. Contact Firstie Firearms directly with questions about ordering a design from a class other than the current one.",
      },
      {
        question: "How do I view the current West Point class design?",
        answer:
          "Select any class card above to go to that class's own page, where production status, photography, and specifications are posted as they become available.",
      },
      {
        question: "Will additional West Point classes be added to this page?",
        answer:
          "Yes. Future classes are added directly to this collection page rather than requiring a separate page, so this remains the permanent place to find every West Point edition.",
      },
      {
        question: "Does Firstie Firearms ship the pistol directly to my home?",
        answer:
          "No. As with every Firstie Firearms product, the completed pistol ships to a licensed FFL dealer of your choosing, who completes the transfer to you in compliance with federal and state law.",
      },
    ],
  },
  USAFA: {
    breadcrumbLabel: "Air Force Academy",
    heroHeading: "Commemorative Pistols for the Classes of the United States Air Force Academy",
    heroParagraphs: [
      "Firstie Firearms builds made-to-order commemorative pistols for graduates of the United States Air Force Academy, with each class receiving its own class-specific engraving, finish, and presentation case.",
      "This page is the permanent home for the Air Force Academy collection. As new classes are added over time, they will appear here alongside every class before them, making this the lasting reference point for every USAFA edition Firstie Firearms releases.",
    ],
    heroImageQuery: "custom engraved GLOCK 19X V pistol USAFA Air Force Academy commemorative on dark tactical background",
    collectionHeading: "Air Force Academy Class Collection",
    whyHeading: "Designed to Mark the Transition from Cadet to Officer",
    whyParagraphs: [
      "Graduation and commissioning from the United States Air Force Academy mark the culmination of four demanding years and the beginning of service as an officer in the United States Air Force or United States Space Force. The Firstie Firearms Air Force Academy Collection is created to commemorate that transition with a piece worthy of both the achievement and the responsibility that follows it.",
      "Each class receives a design developed specifically for its own identity and place in Academy history. The engraving, finishes, colors, and presentation are considered together so the completed piece reflects the traditions of the Academy while remaining distinctly connected to the class it was built to honor. Every edition is intended to capture a particular moment in the continuing story of the Long Blue Line.",
    ],
    craftsmanshipHeading: "Every Detail Chosen With Purpose",
    craftsmanshipParagraphs: [
      "Each commemorative piece begins as a new GLOCK 19X V and is transformed through deep, multi-layer laser engraving, hand finishing, and carefully selected Cerakote finishes. Every color is hand selected to complement the design and reflect the character, heritage, and traditions of the Air Force and Space Force.",
      "The presentation case is developed with the same intent. Each case is detailed specifically for the Air Force Academy Collection, with elements chosen to reinforce the identity and traditions of the Academy. The firearm and its presentation are treated as one complete piece, with every material, color, engraving detail, and design decision carefully considered to honor the graduating and commissioning recipient.",
    ],
    whoHeading: "Built to Honor the Achievement—and Carry It Forward",
    whoParagraphs: [
      "The Air Force Academy Collection is created for graduating cadets, families celebrating commissioning, and alumni looking for a meaningful connection to their own class. Each piece is designed to be both functional and commemorative—a firearm capable of being enjoyed at the range while also serving as a lasting reminder of the accomplishment it represents.",
      "Because each edition belongs to a specific graduating class, it carries a meaning that a general Academy keepsake cannot. It represents the recipient's own class, their years at the Academy, and their place within the generations of officers who continue the Long Blue Line.",
    ],
    faqHeading: "Air Force Academy Collection FAQ",
    faqs: [
      {
        question: "What classes are currently available in the Air Force Academy collection?",
        answer:
          "Additional class years, beginning with the Class of 2027, appear on this page as their designs become available. Check back here for the latest status of each class.",
      },
      {
        question: "Are the designs different for each graduating class?",
        answer:
          "Yes. Each class's pistol is intended to be engraved with artwork and symbols specific to that class, rather than a single design shared across all USAFA graduates.",
      },
      {
        question: "Can an alumnus order a previous class's design?",
        answer:
          "The design for each graduating year is available on that class's own page, linked from the collection above. Contact Firstie Firearms directly with questions about ordering a design from a class other than the current one.",
      },
      {
        question: "How do I view the current Air Force Academy class design?",
        answer:
          "Select any class card above to go to that class's own page, where production status, photography, and specifications are posted as they become available.",
      },
      {
        question: "Will additional Air Force Academy classes be added to this page?",
        answer:
          "Yes. Future classes are added directly to this collection page rather than requiring a separate page, so this remains the permanent place to find every USAFA edition.",
      },
      {
        question: "Does Firstie Firearms ship the pistol directly to my home?",
        answer:
          "No. As with every Firstie Firearms product, the completed pistol ships to a licensed FFL dealer of your choosing, who completes the transfer to you in compliance with federal and state law.",
      },
    ],
  },
}
