# Ghala Alqahtani — Personal Portfolio Website
### Assignment 4 · SWE363

A fully responsive, production-quality personal portfolio website showcasing software engineering projects, research work, and technical skills.

---

## Live Demo

https://ghalaq75.github.io/202280980-GhalaAlqahtani-assignment4/

---

## Project Overview

This portfolio was built as the final assignment in the SWE web development course. It brings together all skills learned throughout the semester into a single, polished, publicly accessible web application. The site presents my background, projects, GitHub activity, and contact information in a clean and professional format.

**Key highlights:**
- Fully bilingual — switch between English and Arabic with automatic RTL layout
- Live data from the GitHub API and an inspirational quotes API
- Filterable and searchable project gallery
- Accessible, responsive design that works on all screen sizes and browsers
- Dark and light mode with user preference persistence

---

## Features

| Feature | Description |
|---|---|
| Dark / Light mode | Toggles theme and persists choice via `localStorage` |
| Time-based greeting | Displays Good Morning / Afternoon / Evening based on local time |
| Inspirational Quote API | Fetches a random quote from Quotable.io with a local fallback |
| GitHub Repositories API | Pulls live public repos; shows demo cards if API is unavailable |
| Project search | Real-time keyword search with text highlight |
| Project filter | Filter by category: Java, AI/ML, Design, Research |
| Project sort | Sort A→Z or Z→A by project title |
| Contact form | Full client-side validation with live word and character count |
| Scroll-in animations | Cards fade in using `IntersectionObserver` |
| Active nav highlighting | Current section is highlighted in the navbar while scrolling |
| Back-to-top button | Appears after 400 px of scroll |
| Scroll progress bar | Thin accent bar at top of page shows reading progress |
| **Arabic / English toggle** ⭐ | Full RTL/LTR switch — translates all UI text, placeholders, form labels, and footer |

---

## Innovative Feature — Arabic / English Toggle

The standout feature of this assignment is a complete bilingual toggle. Clicking the **ع / EN** button in the navbar:

1. Switches the page language between English and Arabic
2. Flips the layout direction between LTR and RTL
3. Translates every UI string — navigation, headings, form labels, placeholders, select options, and the footer
4. Updates the time-based greeting in the selected language
5. Persists the chosen language across sessions using `localStorage`

This is implemented without any external library — purely vanilla JavaScript and CSS, using `data-en` / `data-ar` attributes on HTML elements and `[data-lang="ar"]` CSS selectors for RTL overrides.

---

## Folder Structure

```
id-name-assignment4/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── profile.jpg
│       ├── project1.jpg
│       ├── project2.jpg
│       ├── project3.jpg
│       └── project4.jpg
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
├── presentation/
│   ├── slides.pdf
│   └── demo-video.mp4
└── .gitignore
```

---

## How to Run Locally

No build tools or dependencies are required — this is a pure HTML/CSS/JS project.

**Option 1 — Open directly:**
```bash
# Clone the repository
git clone https://github.com/your-username/id-name-assignment4.git

# Navigate into the folder
cd id-name-assignment4

# Open index.html in your browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

**Option 2 — Use a local server (recommended to avoid CORS issues with APIs):**
```bash
# Using Python
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

**Option 3 — VS Code Live Server:**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

---

## Deployment

The site can be deployed for free using any of the following:

- **GitHub Pages**: Push to `main` branch → Settings → Pages → Deploy from branch
- **Netlify**: Drag and drop the project folder at [netlify.com/drop](https://netlify.com/drop)
- **Vercel**: Import the GitHub repo at [vercel.com](https://vercel.com)

---

## AI Tools Used

Claude (Anthropic) was the primary AI tool used throughout this assignment. It assisted with:
- Generating and refining HTML structure and CSS layout
- Implementing the Arabic/English RTL toggle logic
- Writing the scroll progress bar feature
- Reviewing code for accessibility and best practices

> See [`docs/ai-usage-report.md`](docs/ai-usage-report.md) for the full detailed log.

---

## Browser Compatibility

Tested and working on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+
- Mobile: iOS Safari, Android Chrome

---

## Author

**Ghala Alqahtani**  
Software Engineering Student — KFUPM  
📧 ghalaq75@gmail.com  
📍 Dhahran, Saudi Arabia
