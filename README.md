# AutoCV - AI-Powered ATS-Compliant Resume & CV Studio

A production-ready, full-stack, AI-powered CV generation and career document optimization platform. AutoCV parses existing resumes (PDF, DOCX, DOC, TXT), deconstructs job descriptions, computes real-time ATS match readiness, and tailors resumes with 100% factual fidelity.

Built with an art-directed **Operate Surface** aesthetic following anti-slop frontend craft principles.

---

## ✨ Features

- **Multi-Format CV Ingestion**: Extract candidate identity, professional history, academic credentials, skill taxonomy, and projects from PDF, DOCX, DOC, and TXT files.
- **Job Description Deconstruction**: Extract target role titles, seniority benchmarks, primary technical requirements, secondary preferences, and core competencies.
- **ATS Readiness Diagnostic HUD**: Vector SVG gauge calculating overall match percentage, 4-tier hairline breakdown (Keywords, Skills Align, Experience, Formatting), verified keyword pills, and prioritized missing keyword advisories.
- **Section Locking & Protected Editing**: Protect selected sections from automated AI rewrites while letting AI optimize unlocked sections.
- **AI Section Assistant**: Inline AI rewrites with 7 specialized objectives (Executive Polish, Metric Impact, Tighten & Distill, Technical Depth, Strategic Ownership, ATS Alignment, Grammar & Clarity).
- **Architectural Templates**:
  - `ATS Classic`: Monochrome single-column serif for strict enterprise ATS parsers (Workday, Taleo).
  - `Modern Minimal`: Crisp slate tones and refined typography for high-growth tech firms.
  - `Professional`: Executive navy accents and structured accomplishment alignment.
  - `Executive`: Serif headers with an executive summary callout for senior leadership.
  - `Technical / Developer`: Monospace skill badges, prominent GitHub links, and deep project architecture.
  - `Creative Professional`: Warm stone aesthetic while preserving 100% ATS readability.
  - `Academic CV`: Comprehensive publication and research-first layout.
- **Universal Multi-Format Export**:
  - **PDF**: Print-ready selectable vector text via browser print engine.
  - **Word (.DOCX)**: True binary Microsoft Word document via `docx` library.
  - **Legacy Word (.DOC)**: HTML-compliant Word format.
- **Multi-Provider LLM Engine**: Plug-and-play inference with built-in heuristic NLP engine (no API key required), Google Gemini (1.5 Flash/Pro), OpenAI (GPT-4o/mini), Anthropic Claude (3.5 Sonnet/Haiku), or custom OpenAI-compatible endpoints.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide Icons
- **Parsing**: `pdf-parse`, `mammoth`
- **Exporting**: `docx` binary document generation
- **Testing**: Vitest 3
- **Validation**: Zod schema validation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node.js 22/26)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shahzaib-shams2023/ai-ats-cv-builder.git

# Navigate into project directory
cd ai-ats-cv-builder

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Running Test Suite

```bash
npm run test
```

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Designed and built with pride.
