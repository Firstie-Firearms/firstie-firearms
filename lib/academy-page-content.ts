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
    breadcrumbLabel: "West Point",
    heroHeading: "Commemorative Pistols for the Classes of the United States Military Academy",
    heroParagraphs: [
      "Firstie Firearms builds made-to-order commemorative pistols for graduates of the United States Military Academy at West Point, with each class receiving its own class-specific engraving, finish, and presentation case.",
      "This page is the permanent home for the West Point collection. As new classes are added over time, they will appear here alongside the classes before them, making this the lasting reference point for every West Point edition Firstie Firearms releases.",
    ],
    heroImageQuery: "custom engraved GLOCK 19X V pistol USMA West Point commemorative on dark tactical background",
    collectionHeading: "West Point Class Collection",
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
    faqHeading: "West Point Collection FAQ",
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
    whyHeading: "Designed to Mark Graduation and Commissioning",
    whyParagraphs: [
      "Graduation from the Air Force Academy marks the culmination of years spent training in Colorado Springs and the start of a career in the Wild Blue Yonder. Firstie Firearms builds a single commemorative piece for each class to mark that specific transition.",
      "Rather than a single design shared across every class, each USAFA edition is intended to be engraved with elements unique to that class — so the piece reflects the identity of the specific class it was built for, not the Academy in general.",
    ],
    craftsmanshipHeading: "Built to Carry the Story Forward",
    craftsmanshipParagraphs: [
      "Every Air Force Academy commemorative piece begins as a factory-new GLOCK 19X V. The slide is transformed through deep, multi-layer laser engraving, then hand-finished and polished before being protected with a durable Cerakote finish designed to preserve the artwork for generations.",
      "The completed pistol ships with three factory magazines and is housed in a custom two-level presentation case, with the upper level displaying the pistol and the lower level holding the included magazines in dense, closed-cell foam. As with every class-year piece Firstie Firearms builds, the completed firearm transfers to you through your local FFL dealer.",
    ],
    whoHeading: "Who the Collection Is For",
    whoParagraphs: [
      "Graduating cadets order their class's piece as a keepsake of commissioning into the Air Force or Space Force. Parents and family members purchase it as a gift to mark the milestone. USAFA alumni have also used the collection to look back at the design built for their own graduating class, or to see what's coming next for the classes behind them.",
      "Because each design is tied to a specific class, the collection gives sponsors, mentors, and classmates a way to give a gift tied directly to one graduate's own class year, rather than a general Academy keepsake.",
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
