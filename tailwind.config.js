import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-tint": "#546256",
        "tertiary": "#605b55",
        "surface-variant": "#eae1da",
        "surface-dim": "#e1d9d2",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#d7e7d8",
        "on-tertiary-container": "#fffbff",
        "on-primary-fixed-variant": "#3c4a3f",
        "primary-fixed-dim": "#bbcbbc",
        "on-background": "#1f1b17",
        "inverse-on-surface": "#f8efe8",
        "on-secondary-fixed-variant": "#394857",
        "on-primary-fixed": "#111e15",
        "secondary-container": "#d4e4f7",
        "on-surface": "#1f1b17",
        "secondary-fixed": "#d4e4f7",
        "on-surface-variant": "#434843",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed": "#1e1b16",
        "error": "#ba1a1a",
        "outline-variant": "#c3c8c1",
        "secondary": "#506070",
        "surface-container-high": "#efe7e0",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#e9e1d9",
        "tertiary-fixed-dim": "#ccc5be",
        "on-secondary-container": "#566676",
        "outline": "#747873",
        "secondary-fixed-dim": "#b8c8da",
        "on-primary-container": "#f6fff4",
        "surface": "#fff8f4",
        "surface-container-low": "#fbf2eb",
        "surface-container": "#f5ece5",
        "surface-bright": "#fff8f4",
        "primary": "#515f54",
        "on-tertiary": "#ffffff",
        "primary-container": "#69786c",
        "on-primary": "#ffffff",
        "inverse-primary": "#bbcbbc",
        "surface-container-highest": "#eae1da",
        "on-secondary-fixed": "#0d1d2a",
        "tertiary-container": "#79746d",
        "on-tertiary-fixed-variant": "#4a4640",
        "background": "#fff8f4",
        "inverse-surface": "#34302b"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "lg": "24px",
        "gutter": "24px",
        "sm": "8px",
        "container-max": "1120px",
        "unit": "4px",
        "xs": "4px",
        "xl": "40px",
        "md": "16px"
      },
      fontFamily: {
        "display-lg": ["Manrope", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        "body-md": ["Work Sans", "sans-serif"],
        "body-sm": ["Work Sans", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "display-timer": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "display-timer": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin
  ],
}
