# Prince Gajera — Full Stack Developer & React Specialist

[![React](https://img.shields.loader.com/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.loader.com/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![GSAP](https://img.shields.loader.com/badge/GSAP-3.12-green.svg)](https://greensock.com/gsap/)
[![Firebase](https://img.shields.loader.com/badge/Firebase-10-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.loader.com/badge/Tailwind-3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

A premium, bespoke developer portfolio website engineered to look 100% human-crafted. Built with React, Vite, Google Firebase, and GSAP animations, showcasing modular architectures, advanced client-side animations, and high-performance serverless integrations.

🔗 **Live Demo**: [https://prince-portfolio-155bf.web.app](https://prince-portfolio-155bf.web.app)

---

## 🛠️ Tech Stack & Key Integrations
- **Core Framework**: React 18 + Vite 5 (Fast, optimized HMR compilation)
- **Styling & Theme**: Tailwind CSS 3 (Option A: Dark & Sophisticated Lime System)
- **Animations**: GSAP (GreenSock Animation Platform) + ScrollTrigger for scroll-driven layout reveals
- **Database & Hosting**: Google Firebase Cloud Firestore (For admin controls and contacts) + Firebase Hosting
- **Notifications & Communication**: EmailJS API + custom conversational message inputs

---

## 💎 Design Highlights (Redesign v2.0)
1. **Typographic Polish**: Syne display font for headings coupled with Plus Jakarta Sans body and JetBrains Mono code snippets.
2. **Asymmetry**: Off-grid layouts and irregular polygon clip-paths for profile photos.
3. **Infinite Marquees**: Active technology scrolling tickers that pause on mouse hover.
4. **Easter Eggs**: GSAP mouse-proximity math drifts tech tags on screen (`AntiGravityField.jsx`).
5. **Conversational Contact**: Typographic sentence-based contact inputs for personalized recruiter outreach.
6. **Full-screen Overlay**: Snap-in mobile navigation menu.

---

## 🚀 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/princegajera1/portfolio.git
   cd portfolio
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment variables**:
   Create a `frontend/.env.local` file with the following variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```

---

## 📦 Production Deployment

To compile and deploy updates to Firebase Hosting:
```bash
# Build optimized static assets
npm run build

# Deploy via Firebase CLI
firebase deploy --only hosting
```
