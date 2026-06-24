# ⏱️ Vite Timer & Time Calculator

A modern, mobile-first **Timer & Time Calculator** web application built using **TypeScript**, native **Web Components** (Shadow DOM), and the advanced **Temporal API** polyfill for precise time tracking and duration calculations. 

The user interface follows a clean, responsive, and tactile design system powered by **Tailwind CSS v3** and **Google Material Symbols**.

---

## 🚀 Features

### ⏱️ Precise Timer (Stopwatch)
*   **Precise Control:** Start, pause, and reset actions.
*   **Millisecond Accuracy:** Display displays elapsed time in `00h 00m 00s` with a sub-second fractional indicator.
*   **Active Indicator:** A dynamic badge indicating when the timer is running.
*   **Calculator Integration:** Easily export your paused/logged duration straight into the time calculator with the click of a button.

### 🧮 Time Calculator
*   **Manual Entry:** Input hours (`HH`), minutes (`MM`), and seconds (`SS`) using a clean form layout.
*   **Modular Entries:** Every added or exported time is represented as a separate, interactive `<time-entry>` component.
*   **Dynamic List Management:** View, scroll through, and remove individual time entries.
*   **Precise Summation:** Computes the total combined duration using the `Temporal` API's duration arithmetic, ensuring precise calculations across boundaries (e.g. 90 minutes automatically formatting to `01h 30m 00s`).

---

## 🛠️ Architecture & Tech Stack

*   **Vite:** Build tool and local development server for fast HMR.
*   **TypeScript:** Type-safe code and interfaces for custom components.
*   **Web Components (Shadow DOM):** Encapsulated logic and layout using native components:
    *   `<timer-section>`: Controls the stopwatch logic, elapsed display, and custom event dispatches.
    *   `<calculator-section>`: Manages addition, listing, deletion, and summation of durations.
    *   `<time-entry>`: Renders specific logged duration nodes with inline deletion control.
*   **Tailwind CSS v3:** The design tokens (colors, fonts, sizes) are declared in `tailwind.config.js` and injected directly into each component's Shadow Root (`import globalStyles from '../index.css?inline'`) to maintain styled outputs across the DOM boundary.
*   **Temporal API Polyfill (`@js-temporal/polyfill`):** Used to perform all timing addition, subtraction, duration rounding, and standard formatting.

---

## 📁 File Structure

```text
├── index.html               # Main HTML shell, navigation logic, and entry-point scripts
├── package.json             # Dependencies and scripts (Vite, Tailwind, TypeScript, Temporal)
├── postcss.config.js        # PostCSS configuration for Tailwind CSS compiling
├── tailwind.config.js       # Design tokens (Manrope, JetBrains Mono, Custom color palettes)
├── tsconfig.json            # TypeScript compile options
├── public/
│   └── favicon.svg          # Custom SVG Timer favicon
└── src/
    ├── main.ts              # Entry script initializing polyfills and registering Web Components
    ├── index.css            # Global CSS, base styles, and web font settings
    └── components/
        ├── timer-section.ts       # <timer-section> class component
        ├── calculator-section.ts  # <calculator-section> class component
        └── time-entry.ts          # <time-entry> class component
```

---

## 🏃 Getting Started & Running Locally

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd viteTimer
```

### 2. Install Dependencies
Make sure you have Node.js installed (v18+ recommended).
```bash
npm install
```

### 3. Start Development Server
Run Vite's local dev server:
```bash
npm run dev
```
Open your browser and navigate to the local host address printed in the terminal (usually `http://localhost:5173`).

### 4. Build for Production
Compiles the TypeScript and builds optimized static assets into the `./dist` directory:
```bash
npm run build
```

### 5. Preview Production Build
Start a local web server serving the built files from `./dist` for verification:
```bash
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///Users/dmodena/Dev/JavaScript/viteTimer/LICENSE) file for details.

Developed by **Douglas Modena** (Copyright &copy; 2026).
