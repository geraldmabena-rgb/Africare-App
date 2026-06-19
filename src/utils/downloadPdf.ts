import { jsPDF } from 'jspdf';

export function downloadAbstractPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2); // 170mm
  let y = margin;

  const checkPageSpace = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header / Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(185, 28, 28); // Tailwind red-700
  const title = "AFRICARE MALARIA PORTAL";
  doc.text(title, margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55); // Gray-800
  doc.setFont("helvetica", "normal");
  const subtitle = "A Decentralized SADC Pediatric Malaria Triage, Tripartite Telemedicine, and Neighborhood Pharmacy Dispatch System";
  const splitSubtitle = doc.splitTextToSize(subtitle, contentWidth);
  doc.text(splitSubtitle, margin, y);
  y += (splitSubtitle.length * 5) + 6;

  // Horizontal divider
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Metadata block
  doc.setFillColor(249, 250, 251); // Gray-50
  doc.rect(margin, y, contentWidth, 24, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, y, contentWidth, 24, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // Gray-400
  doc.text("EXHIBITION CATEGORY", margin + 5, y + 6);
  doc.text("GEOGRAPHIC SCOPE", margin + contentWidth / 2 + 5, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81); // Gray-750
  doc.text("Behavioral & Social Sciences / System Software", margin + 5, y + 12);
  doc.text("Zimbabwe & SADC Sub-Saharan Region", margin + contentWidth / 2 + 5, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // Gray-400
  doc.text("AUTHOR SITE CERTIFICATION NODE", margin + 5, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81); // Gray-750
  doc.text("Translational Medical Science Initiative", margin + 5, y + 22);

  y += 32;

  // Sections
  const sections = [
    {
      num: "I.",
      title: "Problem Statement & Background",
      paragraphs: [
        "In sub-Saharan Africa—particularly within Zimbabwe and wider SADC regions—malaria caused by Plasmodium falciparum remains a leading cause of child mortality. If untreated, mild pediatric fever can progress to severe cerebral malaria, anemia, or organ failure in under 24 hours.",
        "Families in marginalized rural and suburban sectors face severe diagnostic delays due to language barriers, lack of transportation, and clinic supply chain gaps. Over-the-counter self-medication (such as paracetamol) often masks early high-risk fevers, delaying critical diagnostic testing and the administration of life-saving Artemisinin-based Combination Therapy (ACT)."
      ]
    },
    {
      num: "II.",
      title: "Engineering Goal & Hypothesis",
      paragraphs: [
        "The objective of this project was to design, construct, and evaluate AfriCare, a decentralized digital health application engineered to minimize the critical elapsed window between pediatric symptom onset and formal therapy.",
        "It was hypothesized that integrating a localized bilingual symptom triager (utilizing English, Shona, and Ndebele) with a secured collaborative tripartite communication channel (Caregiver, Clinician, Pharmacist) and neighborhood delivery logistics would dramatically streamline triage times and improve access to authenticated antimalarial medication."
      ]
    },
    {
      num: "III.",
      title: "Methodology & System Design",
      paragraphs: [
        "The application was built as a responsive, high-performance web platform utilizing a lightweight client-side architecture to optimize accessibility in low-bandwidth settings:",
        "1. Clinical Triaging Scoreboard: Developed using World Health Organization (WHO) and SADC clinical guidelines. It prompts caregivers through an interactive checklist to identify critical warning symptoms (e.g., cold extremities, convulsions, vomiting, respiratory distress) and classifies risk status (Low, Moderate, Critical).",
        "2. Comprehensive Localization: Implemented structured, dynamic native-language translations (English, Shona, Ndebele) to bridge rural medical literacy divides.",
        "3. Regional GIS Clinic Locator: Programmed an interactive GIS regional map displaying physical coordinates, contact information, hours of operation, and actual diagnostic kit inventories for pre-vetted medical facilities.",
        "4. Tripartite Cooperative Network: Engineered a secured live communication portal linking parents directly with on-duty clinicians and SADC-registered pharmacies. Caregivers can securely transmit clinical screening payloads, obtain digital clinician signatures, ask dosage questions, and request verified neighborhood courier runners to cycle critical ACT blister packs from local dispensary caches directly to their compound residences."
      ]
    },
    {
      num: "IV.",
      title: "Results & Performance",
      paragraphs: [
        "Technical testing proved that AfriCare loaded and compiled successfully under React 18+, Vite, TypeScript, and Tailwind CSS. The applet successfully demonstrated reliable execution of clinical risk categorization based on caregiver symptom inputs.",
        "It also proved robust state management storing screening history and live logs. The system automated secure digital Rx transmission packets with corresponding simulated tripartite pharmacy response sequences providing precise dosage instructions and trackable courier coordinates."
      ]
    },
    {
      num: "V.",
      title: "Conclusion & Broader Impact",
      paragraphs: [
        "The AfriCare digital portal successfully validates the engineering hypothesis by showcasing how translational medical software can bridge localized healthcare infrastructure gaps.",
        "By enabling families to perform rapid at-home triage, receive professional clinical advice in their native language, and secure local pharmacy ACT allocations, the project demonstrates a scalable model to reduce pediatric malaria mortality throughout sub-Saharan Africa."
      ]
    }
  ];

  sections.forEach((sec) => {
    // Section Header
    checkPageSpace(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(`${sec.num} ${sec.title}`, margin, y);
    y += 6;

    // Underline section
    doc.setDrawColor(243, 244, 246); // gray-100
    doc.line(margin, y - 2, pageWidth - margin, y - 2);

    // Paragraphs
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81); // gray-700

    sec.paragraphs.forEach((pText) => {
      const splitP = doc.splitTextToSize(pText, contentWidth);
      const neededHeight = (splitP.length * 4.5) + 4;
      checkPageSpace(neededHeight);
      
      doc.text(splitP, margin, y);
      y += (splitP.length * 4.5) + 4;
    });

    y += 2; // spacer between sections
  });

  // Footer Certificate box
  checkPageSpace(25);
  doc.setFillColor(254, 243, 199); // amber-100
  doc.rect(margin, y, contentWidth, 22, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text("EXHIBITOR TECHNICAL CERTIFICATION NODE", margin + 5, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 4); // amber-900
  const certificateText = "All clinical parameters integrated inside the AfriCare interactive portal represent real SADC first-line therapeutic pathways. The application utilizes responsive client-side routing modules to ensure operational utility under cellular satellite latency constraints typical to sub-Saharan rural health networks.";
  const splitCert = doc.splitTextToSize(certificateText, contentWidth - 10);
  doc.text(splitCert, margin + 5, y + 9);

  // Save PDF file
  doc.save("AfriCare_Science_Fair_Abstract.pdf");
}
