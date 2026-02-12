# ELVAIT

[![CI/CD Pipeline](https://github.com/BrnzAi/ELVAIT/actions/workflows/ci.yml/badge.svg)](https://github.com/BrnzAi/ELVAIT/actions/workflows/ci.yml)

**Clarity Before Automation** - A strategic planning tool for organizations.

## Overview

ELVAIT helps organizations gain clarity before implementing AI and automation solutions. Through structured surveys and analysis, teams can identify opportunities, assess readiness, and create actionable roadmaps.

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **State:** Zustand
- **Charts:** Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The app runs on port 3002 by default.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── demo/             # Demo flow
│   ├── start/            # Start survey
│   └── survey/[token]/   # Survey pages
├── components/           # Reusable UI components
└── lib/                  # Utilities and helpers
```

## License

Proprietary - AIHackers
