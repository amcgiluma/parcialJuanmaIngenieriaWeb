# IWEB Exam Generic Template (Maps + Images + OAuth)

## Project Overview

This is a **base template** designed for Web Engineering (IWEB) exams that require:

1.  **Maps**: Visualization and geocoding (OpenStreetMap).
2.  **Images**: Upload and cloud storage (Cloudinary).
3.  **Authentication**: Social Login (Google OAuth).
4.  **Deployment**: Backend on Render, Frontend on Vercel, Database on MongoDB Atlas.

## Technology Stack

### Frontend (Clean Architecture)

- **Core**: React 18+, Vite.
- **State Management**: React Context / Hooks (Clean Architecture adaptation).
- **HTTP Client**: Axios.
- **Maps**: `react-leaflet` + `leaflet`.
- **Structure**:
  - `presentation/`: UI Components, Pages, Context.
  - `application/`: Custom Hooks (Use Cases).
  - `domain/`: Interfaces and Models.
  - `infrastructure/`: Axios and API calls.

### Backend (Modular Monolith)

- **Core**: Python 3.11+, FastAPI.
- **Database**: MongoDB Atlas (Motor - Async).
- **Validation**: Pydantic V2.
- **Structure**:
  - `api/`: Routers and Endpoints.
  - `services/`: Business Logic (Geocoding, Cloudinary, Auth).
  - `repositories/`: Database Access.
  - `models/`: Database Schemas (MongoDB documents).
  - `schemas/`: API Request/Response Validation (Pydantic).
  - `core/`: Configuration and Database connection.

## Development Requirements

### General Rules

1.  **Containerization**: Everything must be dockerized.
2.  **Naming Convention**: Use `snake_case` for **ALL** variables, functions, and file names (except React Components which use `PascalCase`).
3.  **Documentation**:
    - All methods/functions must have docstrings (both backend and frontend).
    - **Code**: English.
    - **Comments/Docstrings**: Spanish (as per course requirements).

### Backend Specific Rules

1.  **Python 3.11+ Modern Syntax**:
    - Use `|` for union types (e.g., `str | None` instead of `Optional[str]`).
    - Use generic types directly (e.g., `list[str]`, `dict[str, int]`).
2.  **Pydantic V2**:
    - Use `model_config = ConfigDict(...)` instead of `class Config:`.
    - Use `json_schema_extra` in `ConfigDict` to define example requests for OpenAPI.
3.  **OpenAPI Documentation**:
    - Ensure `FastAPI` auto-generates documentation based on docstrings and Pydantic schemas.
    - All schemas must include `json_schema_extra` with realistic examples.
    - All endpoint decorators must include `summary`, `description`, and `responses`.
    - Main app must have metadata: `title`, `description`, `version`, `openapi_tags`.
4.  **Schemas vs Models**:
    - **Schemas** (`schemas/`): API contracts for request/response validation.
    - **Models** (`models/`): Database document representation (MongoDB).

### Frontend Specific Rules

1.  **Strict Clean Architecture**:
    - **UI Layer** (Components/Pages) MUST NOT import repositories or make API calls directly.
    - UI uses Custom Hooks (Use Cases) from the **Application Layer**.
    - **Domain Layer** (Models/Interfaces) MUST NOT have external dependencies (no Axios, no React).
2.  **JSDoc**:
    - All functions must have JSDoc docstrings with `@param` and `@returns` descriptions in Spanish.
3.  **Responsive Design**:
    - The application MUST be fully responsive and work correctly on mobile, tablet, and desktop devices.
    - Test on multiple screen sizes (320px, 768px, 1024px, 1920px minimum).
    - Ensure touch-friendly interactions on mobile devices (minimum 44x44px touch targets).
4.  **Accessibility (WCAG 2.1 Level AA)**:

    - **Semantic HTML**: Use proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
    - **ARIA Labels**: Add `aria-label`, `aria-labelledby`, `aria-describedby` where necessary.
    - **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Space, Escape).
    - **Focus Management**: Visible focus indicators for keyboard navigation.
    - **Alt Text**: All images must have descriptive `alt` attributes.
    - **Color Contrast**: Minimum contrast ratio of 4.5:1 for text, 3:1 for UI components.
    - **Form Labels**: All form inputs must have associated `<label>` elements.
    - **Error Messages**: Form validation errors must be clearly announced to screen readers.
    - **Skip Links**: Provide skip navigation links for keyboard users.

5. Neo-Brutalist / Pop Design Style (RADICALLY DIFFERENT):
Concept: Bold, raw, high-contrast, playful but functional. "Anti-design" ethos. It looks like a physical collage.
Borders: Mandatory. Thick, solid black borders on almost everything (border-2 border-black). No subtle grays.
Shadows: Hard Shadows only. No blur. The shadow is a solid block of color (usually black) offset from the element.
Tailwind config suggestion: boxShadow: { 'hard': '4px 4px 0px 0px #000' }.
Rounding: Minimal or specific. Either perfectly square (rounded-none) or slightly rounded (rounded-md). Do NOT use pill shapes or large radii (rounded-xl is forbidden).
Colors:
Backgrounds: Use a slightly warm off-white (bg-[#fffdf5]) or a grid pattern.
Surface: Pure white cards (bg-white) always with black borders.
Accents: High saturation, pastel-neon mix.
Primary: Lime Green (bg-lime-400), Hot Pink (bg-pink-400), or Cyan (bg-cyan-400).
Text: Always Black (text-black) or extremely dark gray (text-slate-900). Never gray text for main content.
Typography:
Headers: Monospace (font-mono) or a heavy, geometric Sans-serif (like 'Archivo Black' or 'Space Grotesk').
Body: Clean Sans-serif with high readability, but consider keeping it Monospace for a "technical" feel if appropriate.
Interactions (Hover):
Instead of fading, elements should move.
Button Hover: The hard shadow disappears, and the button translates down and right to "fill" the shadow space.
Transition: Fast and linear (duration-150 ease-in-out).
Example Button Class (The "Pop" Button):
bg-lime-400 text-black font-bold border-2 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-lime-500
Example Card Class (The "Hard" Card):
bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6
Example Input Field:
w-full bg-white border-2 border-black p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-gray-500 font-mono

## Key Services (Backend)

### Geocoding (OpenStreetMap)

The service must receive an address/text and return latitude/longitude.

- **API**: Nominatim (OSM).
- **Endpoint**: `GET https://nominatim.openstreetmap.org/search?q={query}&format=json`

### Images (Cloudinary)

The service receives a binary file and returns a public URL.

- **Library**: `cloudinary` (Python SDK).

### Authentication (Google OAuth)

The service handles user authentication via Google Identity Platform.

- **Library**: `google-auth` / `fastapi-sso`.
- **Flow**:
  1.  Frontend sends Google ID Token.
  2.  Backend verifies with Google.
  3.  Backend issues JWT Session.
  4.  **Important**: Frontend must send this JWT in the `Authorization` header (`Bearer <token>`) for ALL subsequent protected requests.
