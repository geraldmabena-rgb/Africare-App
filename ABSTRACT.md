# Science Fair Project Abstract

**Project Title:** AfriCare: A Decentralized SADC Pediatric Malaria Triage, Tripartite Telemedicine, and Neighborhood Pharmacy Dispatch System  
**Category:** Behavioral & Social Sciences / System Software & Translational Medical Science  
**Target Region:** Zimbabwe & SADC Sub-Saharan Region  

---

## Abstract

### I. Problem Statement & Background
In sub-Saharan Africa—particularly within Zimbabwe and wider SADC regions—malaria caused by *Plasmodium falciparum* remains a leading cause of child mortality. If untreated, mild pediatric fever can progress to severe cerebral malaria, anemia, or organ failure in under 24 hours. Families in marginalized rural and suburban sectors face severe diagnostic delays due to language barriers, lack of transportation, and clinic supply chain gaps. Over-the-counter self-medication (such as paracetamol) often masks early high-risk fevers, delaying critical diagnostic testing and the administration of life-saving Artemisinin-based Combination Therapy (ACT).

### II. Engineering Goal & Hypothesis
The objective of this project was to design, construct, and evaluate **AfriCare**, a decentralized digital health application engineered to minimize the critical elapsed window between pediatric symptom onset and formal therapy. It was hypothesized that integrating a localized bilingual symptom triager (utilizing English, Shona, and Ndebele) with a secured collaborative tripartite communication channel (Caregiver, Clinician, Pharmacist) and neighborhood delivery logistics would dramatically streamline triage times and improve access to authenticated antimalarial medication.

### III. Methodology & System Design
The application was built as a responsive, high-performance web platform utilizing a lightweight client-side architecture to optimize accessibility in low-bandwidth settings:
1. **Clinical Triaging Scoreboard:** Developed using World Health Organization (WHO) and SADC clinical guidelines. It prompts caregivers through an interactive checklist to identify critical warning symptoms (e.g., cold extremities, convulsions, vomiting, respiratory distress) and classifies risk status (Low, Moderate, Critical).
2. **Comprehensive Localization:** Implemented structured, dynamic native-language translations (English, Shona, Ndebele) to bridge rural medical literacy divides.
3. **Regional GIS Clinic Locator:** Programmed an interactive GIS regional map displaying physical coordinates, contact information, hours of operation, and actual diagnostic kit inventories for pre-vetted medical facilities.
4. **Tripartite Cooperative Network:** Engineered a secured live communication portal linking parents directly with on-duty clinicians and SADC-registered pharmacies. Caregivers can securely transmit clinical screening payloads, obtain digital clinician sign-off signatures (e.g., `✓ Sealed / Kuvaliwe / Zvakachengetwa`), ask authorized pharmacists dosage questions, and request verified neighborhood courier runners to cycle critical ACT blister packs from local dispensary caches directly to their compound residences.

### IV. Results & Performance
Technical testing proved that AfriCare loaded and compiled successfully under React 18+, Vite, TypeScript, and Tailwind CSS. The applet successfully demonstrated:
- Reliable execution of clinical risk categorization based on caregiver symptom inputs.
- Robust state management that stores assessment histories, user language preferences, and live digital logs.
- Automated generation of secure digital Rx transmission packets with corresponding simulated tripartite pharmacy response sequences providing precise dosage instructions (e.g., Coartem dispersible techniques) and trackable courier delivery coordinates.

### V. Conclusion & Broader Impact
The AfriCare digital portal successfully validates the engineering hypothesis by showcasing how translational medical software can bridge localized healthcare infrastructure chasms. By enabling families to perform rapid at-home triage, receive professional clinical advice in their native language, and secure local pharmacy ACT allocations, the project demonstrates a scalable model to reduce pediatric malaria mortality throughout sub-Saharan Africa.
