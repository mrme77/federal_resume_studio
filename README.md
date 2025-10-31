# Federal Resume Studio

An AI-powered web application that reformats resumes to meet federal employment standards. Built with Next.js 16 and powered by OpenRouter AI.

## Features

- **Federal Compliance**: Automatically formats resumes according to Federal guidelines
- **Job Tailoring**: Optional mode to tailor resumes for specific federal job postings
- **AI-Powered**: Uses advanced language models via OpenRouter for intelligent content extraction and reformatting
- **Privacy-Focused**: Zero data retention policy - your resume data is not stored
- **Multiple Formats**: Supports PDF and DOCX input files
- **Clean Output**: Generates professional 2-page DOCX resumes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: OpenRouter API (supports multiple LLM providers)
- **File Processing**: pdf2json, mammoth, docx
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- OpenRouter API key ([get one here](https://openrouter.ai/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume-project-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:
```
OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables:

- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `NEXT_PUBLIC_APP_URL` - Application URL (for development: http://localhost:3000)

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Push your code to GitHub

2. Import the project in Vercel dashboard

3. Configure environment variables in Vercel:
   - `OPENROUTER_API_KEY` - Your OpenRouter API key
   - `NEXT_PUBLIC_APP_URL` - Your production URL

4. Deploy!

**Important Notes for Vercel:**
- This app requires **Vercel Pro** plan due to:
  - 60-second function timeout (configured in `vercel.json`)
  - Larger file upload limits for resume processing
- The `vercel.json` file is already configured with proper function timeouts

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── process/          # Main resume processing endpoint
│   │   └── process-structured/  # Alternative processing endpoint
│   ├── layout.tsx            # Root layout with footer and GitHub star button
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── GitHubStarButton.tsx  # GitHub star button component
│   ├── FileUploader.tsx      # File upload component
│   └── ...                   # Other components
├── lib/
│   ├── extractors/           # PDF and DOCX text extraction
│   ├── generators/           # DOCX generation
│   ├── llm/                  # OpenRouter client and prompts
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions and validators
│   └── validators/           # Federal compliance validators
├── public/                   # Static assets
├── archive/                  # Development docs and test files (not deployed)
└── vercel.json              # Vercel deployment configuration
```

## How It Works

1. **Upload**: User uploads their resume (PDF or DOCX)
2. **Mode Selection**: Choose standard federal compliance or job-tailored mode
3. **Extraction**: Text is extracted from the uploaded file
4. **Validation**: Content is validated for security and quality
5. **AI Processing**: OpenRouter LLM extracts structured data and reformats content
6. **Generation**: A professionally formatted DOCX file is generated
7. **Download**: User receives a compliant 2-page federal resume

## Configuration

### LLM Model Selection

The default model is set in `lib/utils/constants.ts`:
```typescript
export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct";
```

Supported models:
- `meta-llama/llama-3.3-70b-instruct` (default)
- `openai/gpt-4o-mini`
- `google/gemini-2.5-flash-lite`
- `anthropic/claude-3.5-sonnet`

### Security Features

- Input validation and sanitization
- Profanity filtering
- Injection attack prevention
- Gibberish detection
- Length validation

## Support the Project

If you find this tool helpful, consider:
- ⭐ **Starring this repository** on GitHub
- 🐛 **Reporting bugs** via GitHub Issues
- 💡 **Suggesting features** via GitHub Discussions
- 🤝 **Contributing** code improvements

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- Powered by [OpenRouter](https://openrouter.ai/)
- Built with [Next.js](https://nextjs.org/)
- Inspired by federal resume formatting guidelines

## Disclaimer

This tool is not affiliated with any federal agency. Always review and customize your resume before submission. Federal hiring decisions are made by human resources professionals, not automated tools.

---

Made with ❤️ for federal job seekers
