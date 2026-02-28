#  MediMom

**MediMom** is a web-based newborn care companion designed to support new parents with emergency readiness, structured baby tracking, and intelligent assistance.

The platform combines **real-time gesture-based emergency access**, **baby activity tracking**, **AI chatbot support**, **doctor-ready summaries**, and **Interactive baby growth & milestone insights** into a single, simple interface.

---

##  Problem Statement

The newborn phase is overwhelming for parents. Sleep deprivation, irregular feeding schedules, and medical concerns create stress and confusion.

**Common challenges:**
- Difficulty tracking feeding and sleep patterns consistently
- Struggles recalling accurate data during pediatric visits
- Slow access to emergency contacts during urgent moments
- Lack of quick, reliable parenting guidance

> Parents need a lightweight, accessible, and intelligent support system.

---

##  Solution

MediMom provides:

- ✋ Real-time camera-based gesture detection to instantly open an emergency helpbox
- 🍼 Feed and sleep tracking with gentle reminders
- 📝 Retroactive logging for missed entries
- 📄 Automatic doctor-ready PDF summaries
- 🤖 AI-powered chatbot support for everyday parenting questions
- 🌱 Interactive baby growth and milestone insights

> The goal is to reduce stress while keeping parents informed and prepared.

---

##  Core Features

### 1. ✋ Gesture-Based Emergency Access
- Built using **MediaPipe**
- Detects open-palm gesture in real time
- Instantly opens emergency helpbox
- Can provides quick access to emergency contacts in next phase

> Enables hands-free access during urgent situations.

---

### 2. 🍼 Baby Tracker
- Log feeding sessions
- Log sleep sessions
- Add past entries retroactively
- View chronological timeline
- Smart, non-intrusive reminders for missed logs

> Ensures structured and reliable data tracking.

---

### 3. 📄 Doctor Summary PDF
- Automatically compiles feed and sleep data
- Structured and readable format
- Exportable as PDF
- Designed for pediatric consultations

> Helps parents provide accurate information during medical visits.

---

### 4. 🤖 AI Chatbot Support
- Powered by **Grok Api**
- Provides parenting guidance and answers common questions
- Designed for quick reassurance and informational support
- ⚠️ Not a replacement for medical advice

---

### 5. 🌱 Growth & Milestones
- Month-based newborn development insights
- Interactive educational content
- Helps parents understand developmental expectations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite |
| **Computer Vision** | MediaPipe (custom-trained gesture detection model) |
| **AI** | GROQ API |
| **Other** | Client-side PDF generation, Responsive UI |

---

##  System Architecture

```
Camera Feed
    ↓
MediaPipe Gesture Detection
    ↓
Emergency Helpbox (Open Palm Trigger)

Baby Tracking Input
    ↓
Local Storage / Database
    ↓
PDF Summary Generator

User Query
    ↓
Grok API
    ↓
AI Chatbot Response

All modules integrated within a unified React application.
```

---

##  Getting Started

```bash
# Clone the repository
git clone https://github.com/IshaPaulin/medimom.git

# Install dependencies
cd medimom
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Run locally
npm run dev
```

---

##  Environment Variables

Create a `.env` file in the root directory:

```
VITE_GROK_API_KEY=your_api_key_here
```

> ⚠️ Never commit your `.env` file to version control.

---

## ⚠️ Disclaimer

MediMom is an **informational and organizational tool** only. It is **not a medical device** and does not provide medical diagnoses or treatment recommendations. Always consult a qualified healthcare professional for medical concerns.

##  Screenshots 


**Home Page**

![98e8adc4-5ae6-4f4b-81a7-9e60b64f71a1](https://github.com/user-attachments/assets/87ff3ad2-7de7-4c06-aaba-1718bb0c4b67)


**Sign In**

![c5270a27-226c-4b6e-96a0-8d95213d403c](https://github.com/user-attachments/assets/cfd820d2-770d-4606-81f5-ee92fb0d39a2)


**Dashboard**

![af0b5373-00bb-47d2-ae2a-7d11fa7cbc59](https://github.com/user-attachments/assets/788920e0-99fb-4b4d-a933-e277c5d5a42f)

Emergency (Open palm)
![4304b655-1509-48ea-ab1f-6101dd922589](https://github.com/user-attachments/assets/b708d77f-9463-4419-ba38-0122300ce18c)

Baby Tracker and Doctor Ready Summary
![70f73338-18cd-471c-a551-2f534f1a427c](https://github.com/user-attachments/assets/38ac2e30-802d-4a4d-950a-341f0036d3bd)

![fce52ffa-c1f4-452e-a02c-a9a216537ea8](https://github.com/user-attachments/assets/8d8274cd-a0ca-4cea-8602-9e842245c133)

Mood Tracker
![f5e015ff-dbba-4007-aac4-178a205bffed](https://github.com/user-attachments/assets/ca810631-239f-4922-9320-65aa586a4ae3)
![8de2fe7e-40f6-4d4d-b791-43e300f899f6](https://github.com/user-attachments/assets/28e410aa-b7c7-4eb5-ac52-cb1addcf4a09)
![d385d014-1059-4331-bb82-0a043a9444f8](https://github.com/user-attachments/assets/bbf5efc6-a272-44a5-8771-7c419ca74020)

Growth And Milestones
![4d491d3e-b8f8-4350-8655-a71f9a720145](https://github.com/user-attachments/assets/9b7e430d-81e4-4659-83c6-bda5ce65600e)
![2914d835-c0e1-4579-b0b6-da902c8116e4](https://github.com/user-attachments/assets/a3c0d79a-6187-4aff-b22a-57269afda706)
![b790d83f-de94-4b5f-8c04-34ec5ab3f07e](https://github.com/user-attachments/assets/3a32c3b1-9339-4270-9600-e6adea530651)




