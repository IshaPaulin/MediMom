# MediMom 

## Basic Details

### Team Name: Nexify

### Team Members
- Member 1: Isha Paulin I B - Govt Model Engineering College
- Member 2: Tejaswini B - Govt Model Engineering College

### Hosted Project Link
https://medi-mom.vercel.app/

### Project Description
MediMom is a web-based newborn care companion designed to support new parents with emergency readiness, structured baby tracking, and intelligent assistance. The platform combines real-time gesture-based emergency access, baby activity tracking, AI chatbot support, doctor-ready summaries, and interactive baby growth & milestone insights into a single, simple interface.

### The Problem Statement
The newborn phase is overwhelming for parents. Sleep deprivation, irregular feeding schedules, and medical concerns create stress and confusion. Parents struggle to track feeding and sleep patterns consistently, recall accurate data during pediatric visits, access emergency contacts quickly during urgent moments, and find quick, reliable parenting guidance — all while exhausted.

### The Solution
MediMom provides a unified platform with real-time gesture detection for instant emergency access, feed and sleep tracking with retroactive logging, automatic doctor-ready PDF summaries, an AI-powered chatbot for parenting questions, and interactive baby growth & milestone insights — reducing stress while keeping parents informed and prepared.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages used:** JavaScript
- **Frameworks used:** React, Vite
- **Libraries used:** MediaPipe, React Router, Firebase Auth, jsPDF
- **Tools used:** VS Code, Git, Vercel

---

## Features

- ✋ **Gesture-Based Emergency Access** — Open-palm detection instantly opens emergency helpbox
- 🍼 **Baby Tracker** — Log feed and sleep sessions with retroactive entry support
- 📄 **Doctor Summary PDF** — Auto-compiled, exportable pediatric visit summaries
- 🤖 **AI Chatbot (Mia)** — Powered by cohere API for parenting guidance and reassurance
- 🌱 **Growth & Milestones** — Month-based interactive newborn development insights

---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone https://github.com/IshaPaulin/medimom.git

# Install dependencies
cd medimom
npm install
```

#### Run
```bash
# Create a .env file in the root directory and add:
# VITE_cohere_API_KEY=your_api_key_here

npm run dev
```

---

## Project Documentation

### Screenshots

**Home Page**

![Home Page](https://github.com/user-attachments/assets/87ff3ad2-7de7-4c06-aaba-1718bb0c4b67)
*Landing page introducing MediMom's core value proposition*

**Sign In**

![Sign In](https://github.com/user-attachments/assets/cfd820d2-770d-4606-81f5-ee92fb0d39a2)
*Authentication screen with Google Sign-In support*

**Dashboard**

![Dashboard](https://github.com/user-attachments/assets/788920e0-99fb-4b4d-a933-e277c5d5a42f)
*Main dashboard with gesture logger, feed and sleep tracking controls*

**Emergency Help (Open Palm)**

![Emergency](https://github.com/user-attachments/assets/b708d77f-9463-4419-ba38-0122300ce18c)
*Open-palm gesture triggers the emergency helpbox instantly*

**Baby Tracker & Doctor Summary**

![Baby Tracker](https://github.com/user-attachments/assets/38ac2e30-802d-4a4d-950a-341f0036d3bd)
*Chronological feed and sleep log with timeline view*

![Doctor Summary PDF](https://github.com/user-attachments/assets/8d8274cd-a0ca-4cea-8602-9e842245c133)
*Auto-generated doctor-ready PDF summary of tracked data*

**Mood Tracker**

![Mood Tracker 1](https://github.com/user-attachments/assets/ca810631-239f-4922-9320-65aa586a4ae3)

![Mood Tracker 2](https://github.com/user-attachments/assets/28e410aa-b7c7-4eb5-ac52-cb1addcf4a09)

![Mood Tracker 3](https://github.com/user-attachments/assets/bbf5efc6-a272-44a5-8771-7c419ca74020)
*Daily maternal mood check-in and wellbeing tracking*

**Growth & Milestones**

![Growth 1](https://github.com/user-attachments/assets/9b7e430d-81e4-4659-83c6-bda5ce65600e)

![Growth 2](https://github.com/user-attachments/assets/a3c0d79a-6187-4aff-b22a-57269afda706)

![Growth 3](https://github.com/user-attachments/assets/3a32c3b1-9339-4270-9600-e6adea530651)
*Interactive month-based baby development insights with tappable body zones*

**Chatbot**
![5f463b5e-67a4-4734-94ca-1746dda7a8bf](https://github.com/user-attachments/assets/6b8c1ce9-213c-45ae-bf45-78899be3f7b4)

---

### Diagrams

**System Architecture:**

```
Camera Feed
    ↓
MediaPipe Gesture Detection
    ↓
Emergency Helpbox (Open Palm Trigger)

Baby Tracking Input
    ↓
Local Storage
    ↓
PDF Summary Generator

User Query
    ↓
cohere API
    ↓
AI Chatbot Response (Mia)

All modules integrated within a unified React application.
```

---

## Project Demo

### Video
https://drive.google.com/file/d/1dOyLvUnqt30TH4ikp_Ofef4a_VS4GK8X/view?usp=drive_link

*Demonstrate gesture detection, baby tracking, PDF export, AI chatbot, and growth milestones*

---

## AI Tools Used

**Tool Used:** Claude (Anthropic)

**Purpose:** Used throughout frontend development
- UI component design and implementation
- Growth & Milestones page architecture and build
- Chatbot integration and API switching
- README and documentation writing
- Debugging and code review

**Percentage of AI-generated code:** 72%

**Human Contributions:**
- Project concept and problem definition
- MediaPipe model training and gesture detection logic
- Firebase authentication setup
- Baby Tracker and PDF generation logic
- UI/UX design decisions and visual direction
- Integration, testing, and deployment

---

## Team Contributions

- Tejaswini B: 
Developed TensorFlow.js gesture recognition model for emergency palm detection

Implemented Firebase authentication and real-time database

Built emergency help panel integration

Created symptom, medication, and mood tracking features

Managed project architecture and deployment
- Isha Paulin I B:
Designed and developed all React + Vite frontend components

Created Dashboard, Feeding Logger, Sleep Tracker modules

Implemented growth milestones with visual charts

Designed responsive UI and user experience


---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

MediMom is an **informational and organizational tool** only. It is **not a medical device** and does not provide medical diagnoses or treatment recommendations. Always consult a qualified healthcare professional for medical concerns.

---

*Made with ❤️ at TinkerHub*
