# Welcome to the Neighborhood: A Python Developer's Guide to a Modern JavaScript Project

Hello there! Welcome to this project. It's great to have you here. I understand you have a background in Python and are looking to dive into the world of JavaScript. You're in the right place! This document is designed to be your friendly guide, helping you understand how this project is structured and how your Python knowledge can be a superpower in this new landscape.

## The Big Picture: Our Project as a Resume Tailoring Shop

Let's use an analogy to understand this project. Imagine our project is a high-tech "Resume Tailoring Shop" that helps people land their dream jobs.

*   **The Frontend (The Lobby & Consultation Area):** This is where the client (the user) comes in. They can upload their current resume and provide a job description they're targeting. This is the user interface (UI) they see and interact with in their web browser. It’s designed to be welcoming and easy to use.

*   **The Backend (The Workshop):** This is the heart of our operation, hidden from the client. Here, our expert tailors (our code) get to work. They analyze the client's resume, compare it to the job description, and then craft a new, perfectly tailored version.

*   **The Code:** This is the set of skills, tools, and instructions our tailors use. It defines every step of the process, from reading the initial resume to producing the final, polished document.

This project is built with **Next.js**, which is a framework for the **React** library.

*   **React:** If our tailors are building a resume, React provides the building blocks, like sections for "Experience," "Education," and "Skills." These reusable blocks are called **components**. We can assemble them in different ways to create a complete resume.

*   **Next.js:** This is our shop's manager. It oversees the entire process, from the client's initial consultation in the lobby (frontend) to the detailed work in the workshop (backend). It ensures a smooth workflow, so the client gets their tailored resume back quickly and efficiently.

## From Python to TypeScript: A New Language, Same Concepts

You're used to Python, which is a fantastic language. The language in this project is **TypeScript**.

*   **TypeScript is a superset of JavaScript:** Think of JavaScript as a very flexible, dynamic language. TypeScript is like JavaScript with a "safety manual." It adds a layer of rules, primarily around **types**.

*   **Why Types?** In Python, you might have used type hints (e.g., `def my_function(name: str) -> int:`). TypeScript does the same thing, but it's much stricter. It checks your code for type errors *before* you even run it. This is like a master tailor double-checking the measurements before cutting the fabric, preventing costly mistakes.

Here's a quick comparison:

| Concept           | Python                               | TypeScript                                     |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| **Function**      | `def my_function(name):`             | `function myFunction(name) { ... }` or `(name) => { ... }` |
| **Variables**     | `my_variable = 10`                   | `let myVariable = 10;` or `const myVariable = 10;` |
| **Types**         | `name: str` (optional hint)          | `name: string` (enforced)                      |
| **Code Blocks**   | Indentation (whitespace matters!)    | Curly braces `{ ... }`                         |
| **File Extension**| `.py`                                | `.ts` (logic) or `.tsx` (logic + UI)           |

The transition might feel a little strange at first, but you'll find that many of the core programming concepts you know from Python (loops, conditionals, functions, classes) are the same here.

## Exploring the Shop: Our Project's File Structure

Let's walk through the different parts of our "Resume Tailoring Shop" (the project files):

*   `package.json`: This is our shop's **inventory and tool list**. It lists all the third-party tools and materials (packages or dependencies) we need. It also contains scripts for common tasks, like `npm run dev` which is like "opening the shop for the day."

*   `next.config.ts`: These are the **main policies and settings for our shop**, guiding the Next.js manager on how to run things.

*   `app/`: This is the **Lobby and Consultation Area (Frontend)**. The files here define what the user sees.
    *   `layout.tsx`: The overall architecture and decor of our shop—the branding, the color scheme, the basic layout that's consistent on every page.
    *   `page.tsx`: The front door and main reception desk. This is the first page the user lands on.
    *   `globals.css`: The shop's style guide, defining the fonts, colors, and overall aesthetic.

*   `components/`: These are the **reusable furniture and fixtures** in our lobby. Things like the `FileUploader` (the intake form), the `JobDescriptionInput` (the consultation notes), and various buttons and dialogs. We can reuse these across different pages.

*   `public/`: This is for **static assets**, like the company logo on the wall or informational brochures.

*   `lib/`: This is our **Workshop (Backend Logic)**. It's where the core work happens.
    *   `lib/extractors`: These are our **Document Specialists**. They know how to read and understand different file formats, like `.pdf` and `.docx`, extracting the raw text from the client's original resume.
    *   `lib/generators`: These are our **Master Scribes**. Once the resume has been analyzed, these scripts take the improved content and format it into a beautiful, new `.docx` file.
    *   `lib/llm`: This is our **AI-Powered Career Coach**. It uses Large Language Models (LLMs) to do the most advanced work: analyzing the resume against the job description and suggesting powerful improvements. The `prompts` files are the detailed instructions we give our AI coach.
    *   `lib/validators`: These are our **Quality Assurance Inspectors**. For example, the `federal-validator` checks if a resume meets the specific, strict standards for federal job applications.

*   `app/api/`: This is the **Service Counter** that connects the lobby to the workshop.
    *   When a user uploads their resume in the frontend, the request comes to one of these API routes.
    *   The route then acts as a project manager, taking the user's files and handing them off to the correct specialists in the `lib/` workshop for processing.

## Your First Day at the Shop: What to Do Next

1.  **Open the Shop:** In your terminal, run `npm install` (to stock your workshop with all the tools and materials) and then `npm run dev` (to open the doors for business). This will start the application, and you can see it in your web browser.

2.  **Become a Client:** Go to the application in your browser. Try uploading a dummy resume (a simple text file will do) and pasting in a sample job description to see how it works.

3.  **Tweak the Decor:** Open `app/page.tsx`. Try changing some of the text you see on the home page. Your changes will appear in the browser instantly!

4.  **Inspect a Tool:** Look at a component in the `components/` directory, for example, `FileUploader.tsx`. See if you can follow the logic. What happens when a file is dropped into it?

5.  **Ask Questions!** The best way to learn is to be curious. If you see something you don't understand, don't hesitate to ask.

This is just the beginning of your journey. It's okay to feel a little lost at first. The key is to stay curious, experiment, and connect what you're seeing to the Python concepts you already know.

Now, let's dive deeper into the technical details of how this application actually works.

---

## Part II: React & Components - The Building Blocks

Now that you understand the big picture, let's dive deep into React and how components work in this project. We'll examine real code from the project to understand the patterns.

### Understanding React Hooks: State Management and Side Effects

React Hooks are special functions that let you "hook into" React features. Let's look at the most common hooks used in this project by examining `components/FileUploader.tsx` and `app/page.tsx`.

#### useState: Managing Component State

The `useState` hook lets you add state variables to your component. State is data that can change over time, and when it changes, React re-renders the component to reflect the new state.

Here's a real example from `components/FileUploader.tsx:15-18`:

```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isDragging, setIsDragging] = useState(false);
const [validationError, setValidationError] = useState<string>("");
const inputRef = useRef<HTMLInputElement>(null);
```

Breaking this down:
- `useState<File | null>(null)` creates a state variable `selectedFile` that can either be a `File` object or `null`
- The initial value is `null` (no file selected yet)
- `setSelectedFile` is the function we call to update this state
- The `<File | null>` syntax is TypeScript's type annotation - it explicitly says what types are allowed

When we call `setSelectedFile(file)` anywhere in the component, React automatically re-renders the component to show the new file.

#### useEffect: Running Side Effects

The `useEffect` hook runs code in response to component changes. It's similar to Python's context managers or decorators, but for React lifecycle events.

From `app/page.tsx:51-74`:

```typescript
useEffect(() => {
  if (processingMode === "tailored" && jobDescriptionRef.current) {
    // Scroll to job description input for tailored mode
    setTimeout(() => {
      jobDescriptionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  } else if (processingMode === "standard" && continueButtonRef.current) {
    // Scroll to continue button for standard mode
    setTimeout(() => {
      continueButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      // Flash the button
      setFlashContinueButton(true);
      setTimeout(() => {
        setFlashContinueButton(false);
      }, 3000);
    }, 100);
  }
}, [processingMode]);
```

The key points:
- The first argument is a function that runs after the component renders
- The second argument `[processingMode]` is the **dependency array** - the effect only runs when `processingMode` changes
- This is like Python's property observers or decorators that react to changes
- When the user selects a mode, this effect automatically scrolls to the relevant UI element

#### useRef: Accessing DOM Elements Directly

The `useRef` hook creates a reference to a DOM element or value that persists across re-renders but doesn't cause re-renders when updated.

From `components/FileUploader.tsx:18`:

```typescript
const inputRef = useRef<HTMLInputElement>(null);
```

Later in the same file at lines 87-91:

```typescript
const handleClick = () => {
  if (inputRef.current) {
    inputRef.current.click();
  }
};
```

This is like accessing the actual HTML element directly. We use it to programmatically trigger a file input click when the user clicks on our custom upload area.

#### useCallback: Optimizing Performance

The `useCallback` hook memoizes (caches) functions so they're not recreated on every render. This is a performance optimization.

From `components/FileUploader.tsx:20-47`:

```typescript
const validateAndSetFile = useCallback((file: File) => {
  // Reset error state
  setValidationError("");

  // Validate file size
  const sizeValidation = validateFileSize(file.size, 5); // 5MB limit
  if (!sizeValidation.isValid) {
    setValidationError(sizeValidation.reason || "File validation failed");
    return false;
  }

  // Validate file type
  const isValidType =
    file.type.includes("pdf") ||
    file.type.includes("word") ||
    file.name.endsWith(".docx") ||
    file.name.endsWith(".doc");

  if (!isValidType) {
    setValidationError("Please upload a PDF or Word document (.pdf, .docx, .doc)");
    return false;
  }

  // File is valid
  setSelectedFile(file);
  onFileSelect(file);
  return true;
}, [onFileSelect]);
```

The dependency array `[onFileSelect]` means this function is only recreated if `onFileSelect` changes. This prevents unnecessary re-renders of child components.

### Component Composition: Props and Data Flow

React components pass data through **props** (properties). Props flow downward from parent to child components, creating a unidirectional data flow.

#### Defining Component Props

From `components/FileUploader.tsx:9-12`:

```typescript
interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
```

This is TypeScript's way of defining the component's "contract":
- `onFileSelect`: A required function that takes a `File | null` and returns nothing (`void`)
- `disabled?`: An optional boolean (the `?` makes it optional)

The parent component (`app/page.tsx:96-101`) passes these props:

```typescript
const handleFileSelect = (file: File | null) => {
  setSelectedFile(file);
  setProcessingStatus("idle");
  setError("");
  setGeneratedResume(null);
};

// Later in the JSX:
<FileUploader onFileSelect={handleFileSelect} disabled={processingStatus === "processing"} />
```

When the user selects a file in `FileUploader`, it calls `onFileSelect(file)`, which triggers `handleFileSelect` in the parent, updating the parent's state.

### Event Handling: User Interactions

React handles events using camelCase event handlers. Let's look at drag-and-drop file upload.

From `components/FileUploader.tsx:56-76`:

```typescript
const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
}, []);

const handleDragLeave = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
}, []);

const handleDrop = useCallback(
  (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  },
  [validateAndSetFile]
);
```

Then in the JSX (lines 100-107):

```typescript
<div
  className={`...styles...`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={handleClick}
>
```

Each event handler:
1. Receives an event object (like Python's event parameter)
2. Calls `e.preventDefault()` to stop the browser's default behavior
3. Updates state or performs actions based on the event

### Server vs. Client Components (Next.js App Router)

Next.js 13+ introduced a crucial distinction between **Server Components** (run on the server) and **Client Components** (run in the browser).

#### Client Components

From `components/FileUploader.tsx:1`:

```typescript
"use client";
```

This directive tells Next.js: "This component needs browser APIs and must run on the client."

Client components are needed when you:
- Use hooks like `useState`, `useEffect`
- Handle user interactions (clicks, typing, drag-and-drop)
- Access browser APIs (localStorage, window, etc.)

#### Server Components

From `app/layout.tsx` (no "use client" directive):

Server components:
- Run only on the server during build or request
- Can directly access databases or APIs
- Don't include JavaScript in the browser bundle (faster page loads)
- Cannot use hooks or browser APIs

The main page (`app/page.tsx`) is a client component because it manages complex state and user interactions. But other components might be server components if they only render static content.

### Putting It All Together: Component Hierarchy

Let's trace what happens when a user uploads a file:

1. **User drops file** → `FileUploader.tsx:handleDrop` (line 66)
2. **File validation** → `validateAndSetFile` (line 20)
3. **State update** → `setSelectedFile(file)` (line 44)
4. **Callback to parent** → `onFileSelect(file)` (line 45)
5. **Parent updates** → `handleFileSelect` in `app/page.tsx` (line 96)
6. **Parent state changes** → `setSelectedFile(file)` (line 97)
7. **React re-renders** → UI shows the selected file

This is the unidirectional data flow pattern: events go up (via callbacks), data flows down (via props), and state changes trigger re-renders.

---

## Part III: API Routes & Data Flow - From Frontend to Backend

Now let's trace the journey of a resume from the moment the user clicks "Reformat Resume" to when they download the final document.

### File-Based Routing in Next.js

Next.js uses the file system to define API routes. Any file in `app/api/*/route.ts` automatically becomes an API endpoint.

```
app/api/process/route.ts  →  /api/process  (POST)
app/api/feedback/route.ts  →  /api/feedback (POST)
```

This is different from Python frameworks like Flask or Django where you explicitly register routes. Here, the file location IS the route.

### Tracing a Complete Request-Response Cycle

Let's follow a resume from upload to download by reading the actual code.

#### Step 1: User Clicks "Reformat Resume"

From `app/page.tsx:103-184`:

```typescript
const handleProcess = async () => {
  if (!selectedFile) return;

  setProcessingStatus("processing");
  setError("");
  setGeneratedResume(null);
  setProgress(0);
  setIsUploading(true);

  // Simulate smooth progress
  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 95) {
        clearInterval(interval);
        return 95;
      }
      return prev + 1;
    });
  }, 100);

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    // Add job description if in tailored mode
    if (processingMode === "tailored" && jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    }

    setProcessingStage("Uploading and processing file...");

    const response = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });
```

Key concepts:
- **FormData**: JavaScript's way of packaging files for upload (like Python's `multipart/form-data`)
- **fetch**: JavaScript's HTTP client (similar to Python's `requests` library)
- **async/await**: JavaScript's async pattern (similar to Python's async/await)

#### Step 2: API Route Receives the Request

From `app/api/process/route.ts:32-45`:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("📄 Processing file:", file.name);
```

This is the entry point. Next.js calls this `POST` function when it receives a POST request to `/api/process`.

- `request: NextRequest` is the incoming HTTP request
- `formData()` extracts the multipart form data
- Error handling returns JSON responses with appropriate status codes

#### Step 3: File Extraction

From `app/api/process/route.ts:54-86`:

```typescript
// Convert file to buffer
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

// Detect file type
const fileType = detectFileType(file.name);

if (fileType === "unknown") {
  return NextResponse.json(
    { error: "Unsupported file type. Please upload a PDF or DOCX file." },
    { status: 400 }
  );
}

// Extract text from file
let extractResult;
if (fileType === "pdf") {
  extractResult = await extractTextFromPDF(buffer);
} else {
  extractResult = await extractTextFromDOCX(buffer);
}

if (!extractResult.success || !extractResult.full_text) {
  return NextResponse.json(
    { error: `Failed to extract text: ${extractResult.error || "Unknown error"}` },
    { status: 500 }
  );
}

const resumeText = extractResult.full_text;
const originalPages = extractResult.total_pages || 0;

console.log(`✅ Extracted ${resumeText.length.toLocaleString()} characters from ${originalPages} page(s)`);
```

This section:
1. Converts the browser's File to a Node.js Buffer
2. Detects if it's PDF or DOCX
3. Calls the appropriate extractor from `lib/extractors/`

Let's look at the PDF extractor (`lib/extractors/pdf-extractor.ts:40-119`):

```typescript
export function extractTextFromPDF(buffer: Buffer): Promise<ExtractResult> {
  return new Promise((resolve) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error } | Error) => {
      const errorMessage = errData instanceof Error
        ? errData.message
        : (errData.parserError?.message || "Unknown PDF parsing error");
      console.error("PDF parsing error:", errorMessage);
      resolve({
        success: false,
        error: errorMessage,
        full_text: "",
        total_pages: 0,
      });
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: PdfData) => {
      try {
        if (!pdfData || !pdfData.Pages) {
          throw new Error("Invalid PDF data structure received from parser.");
        }

        const total_pages = pdfData.Pages.length;
        let full_text = "";

        pdfData.Pages.forEach((page: PdfPage) => {
          if (!page.Texts) return;
          // Sort texts by their Y and then X coordinates
          const texts = page.Texts.sort((a: PdfText, b: PdfText) => {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
          });

          let lastY = -1;
          let line = '';
          texts.forEach((text: PdfText) => {
            const decodedText = decodeURIComponent(text.R[0].T).trim();
            if (decodedText) {
              // If Y position is significantly different, it's a new line
              if (lastY !== -1 && Math.abs(text.y - lastY) > 0.5) {
                  full_text += line + '\n';
                  line = '';
              }
              line += decodedText + ' ';
              lastY = text.y;
            }
          });
          full_text += line.trim() + '\n\n';
        });
```

This uses the `pdf2json` library to:
1. Parse the PDF structure
2. Extract text elements with their (x, y) coordinates
3. Sort them to reconstruct reading order
4. Build a clean text string

#### Step 4: Security Validation

From `app/api/process/route.ts:88-147`:

```typescript
// EARLY REJECTION GATE - NO LLM TOKEN WASTE
console.log("🚪 Running early rejection gate (length, gibberish, profanity, injection)...");
const earlyCheck = performEarlyRejectionChecks(resumeText);

if (!earlyCheck.passed) {
  console.error(`❌ Early rejection: ${earlyCheck.rejectionType}`);
  console.error(`   Reason: ${earlyCheck.error}`);

  return NextResponse.json(
    {
      error: earlyCheck.error,
      rejectionType: earlyCheck.rejectionType,
    },
    { status: 400 }
  );
}

console.log("✅ All early validation checks passed - resume is valid for processing");

// LIGHT SANITIZATION
console.log("🔍 Sanitizing borderline suspicious patterns...");
const sanitizationResult = sanitizeResumeContent(resumeText);

const cleanResumeText = sanitizationResult.sanitized;
console.log("✅ Resume content validated and sanitized successfully");
```

This is a critical security layer. Before spending money on LLM processing, we validate:
- Content length (reject empty or extremely long resumes)
- Gibberish detection (reject random characters)
- Profanity filtering
- Prompt injection attempts (security threat where malicious users try to manipulate the AI)

This pattern is important: **validate early, fail fast**. Don't waste expensive resources on invalid input.

#### Step 5: LLM Processing

From `app/api/process/route.ts:208-230`:

```typescript
console.log("🤖 Sending to LLM for structured content extraction...");
const prompt = buildStructuredResumePrompt(cleanResumeText, jobDescription || undefined);
const systemMessage = getStructuredSystemMessage();

// Send to LLM
const llmClient = new OpenRouterClient();
const llmResult = await llmClient.chatCompletion([
  { role: "system", content: systemMessage },
  { role: "user", content: prompt },
]);

if (!llmResult.success || !llmResult.content) {
  return NextResponse.json(
    { error: `Failed to extract resume content: ${llmResult.error || "No content returned"}` },
    { status: 500 }
  );
}

console.log("✅ Received response from LLM");
```

Let's examine the LLM client (`lib/llm/openrouter-client.ts:60-118`):

```typescript
async chatCompletion(
  messages: ChatMessage[],
  temperature?: number,
  maxTokens?: number
): Promise<ChatCompletionResult> {
  const temp = temperature !== undefined ? temperature : TEMPERATURE;
  const tokens = maxTokens !== undefined ? maxTokens : MAX_TOKENS;

  try {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: temp,
      max_tokens: tokens,
    });

    // Verify we have the expected structure
    if (!completion.choices || completion.choices.length === 0) {
      return {
        success: false,
        error: "Invalid response structure: no choices returned",
        content: "",
      };
    }

    const content = completion.choices[0].message.content;

    if (!content) {
      return {
        success: false,
        error: "No content in response",
        content: "",
      };
    }

    return {
      success: true,
      content: content,
      model: completion.model || this.model,
      usage: completion.usage
        ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    const errorType = error instanceof Error ? error.constructor.name : "Error";

    return {
      success: false,
      error: `${errorType}: ${errorMsg}`,
      content: "",
    };
  }
}
```

This class wraps the OpenAI SDK to:
1. Send chat messages to the LLM
2. Handle errors gracefully
3. Track token usage (important for cost management)
4. Return a consistent result structure

The result from the LLM is structured JSON containing the parsed resume information.

#### Step 6: DOCX Generation

From `app/api/process/route.ts:267-280`:

```typescript
console.log("📝 Generating DOCX with Salomone template...");
const docxResult = await generateStructuredResume(structuredData);

if (!docxResult.success || !docxResult.buffer) {
  return NextResponse.json(
    { error: `Failed to generate DOCX: ${docxResult.error || "Unknown error"}` },
    { status: 500 }
  );
}

// Generate filename
const filename = generateOutputFilename();

console.log("✅ DOCX generated successfully");
```

The generator (`lib/generators/structured-docx-generator.ts`) uses the `docx` library to programmatically create a Word document. It's quite sophisticated - let's look at a key part (lines 50-104):

```typescript
export async function generateStructuredResume(
  data: StructuredResume
): Promise<StructuredDocxResult> {
  try {
    const paragraphs: Paragraph[] = [];

    // HEADER SECTION (Name + Contact Info)

    // Line 1: NAME (centered, all caps, bold)
    paragraphs.push(
      new Paragraph({
        text: data.contactInfo.name.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { after: SPACING_AFTER_NAME },
        style: "Normal",
        run: {
          font: FONT,
          size: SIZE_NAME,
          bold: true,
          color: COLOR_HEADER,
        },
      })
    );

    // Line 2: Contact Info (centered)
    const contactParts: string[] = [];
    contactParts.push(`Phone: ${data.contactInfo.phone || "[PHONE]"}`);
    contactParts.push(`Email: ${data.contactInfo.email || "[EMAIL]"}`);
    contactParts.push(data.contactInfo.location || "[LOCATION]");

    paragraphs.push(
      new Paragraph({
        text: contactParts.join(" | "),
        alignment: AlignmentType.CENTER,
        spacing: { after: SPACING_AFTER_CONTACT },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        style: "Normal",
        run: {
          font: FONT,
          size: SIZE_CONTACT,
          color: COLOR_TEXT,
        },
      })
    );
```

This builds a Word document programmatically using the `docx` library. Each `Paragraph` object becomes a paragraph in the final document, with precise control over:
- Fonts, sizes, colors
- Alignment and spacing
- Borders and formatting
- Bullet points and indentation

#### Step 7: Return DOCX to Frontend

From `app/api/process/route.ts:282-294`:

```typescript
// Return DOCX file directly
return new NextResponse(docxResult.buffer as unknown as BodyInit, {
  status: 200,
  headers: {
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": docxResult.buffer.length.toString(),
    "X-Original-Pages": originalPages.toString(),
    "X-Validation-Issues": validationIssues.length.toString(),
    "X-Content-Sanitized": sanitizationResult.removedPatterns.length > 0 ? "true" : "false",
    "X-Patterns-Removed": sanitizationResult.removedPatterns.length.toString(),
  },
});
```

Instead of returning JSON, we return the raw file buffer with headers that tell the browser:
- This is a Word document (`Content-Type`)
- Download it with this filename (`Content-Disposition`)
- Here's the file size (`Content-Length`)
- Custom debug headers (the `X-*` headers)

#### Step 8: Frontend Receives and Downloads

Back in `app/page.tsx:142-183`:

```typescript
if (!response.ok) {
  const errorData = await response.json();

  // Check if this is a rejection with a specific type
  if (errorData.rejectionType) {
    setRejectionType(errorData.rejectionType);
    setRejectionMessage(errorData.error || "Resume validation failed");
    setShowRejectionDialog(true);
    setProcessingStatus("idle");
    return;
  }

  throw new Error(errorData.error || "Failed to process resume");
}

// Check if response is JSON (mismatch) or blob (success)
const contentType = response.headers.get("content-type");
if (contentType && contentType.includes("application/json")) {
  // Mismatch response
  const data = await response.json();
  if (data.mismatch) {
    setMismatchReason(data.reason);
    setShowMismatchDialog(true);
    setProcessingStatus("idle");
    return;
  }
}

const blob = await response.blob();
setGeneratedResume(blob);
setProgress(100);
setProcessingStatus("success");
setShowGitHubCallout(true);
```

The frontend:
1. Checks the response status
2. Handles errors appropriately
3. Converts the response to a Blob (binary data)
4. Stores it in state
5. Updates UI to show success

Then when the user clicks "Download" (lines 186-196):

```typescript
const handleDownload = () => {
  if (!generatedResume) return;
  const url = window.URL.createObjectURL(generatedResume);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reformatted_resume_${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

This creates a temporary download link and programmatically clicks it to trigger the browser's download.

### Error Handling Patterns

Notice the consistent error handling throughout the flow:

1. **Early validation** (bad input rejected immediately)
2. **Try-catch blocks** (unexpected errors caught)
3. **Graceful degradation** (operations that can fail don't crash the whole system)
4. **User-friendly messages** (technical errors translated to user language)
5. **Logging** (console.log for debugging in production)

From `app/api/process/route.ts:295-304`:

```typescript
} catch (error) {
  console.error("Error processing resume:", error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    },
    { status: 500 }
  );
}
```

This is the safety net. If anything unexpected happens, we:
1. Log it for debugging
2. Return a safe error message to the user
3. Don't expose internal details (security best practice)

---

## Part IV: Testing Strategies

Testing ensures your code works correctly and continues working as you make changes. Let's set up a comprehensive testing strategy for this project.

### Test Infrastructure Setup

First, install the testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

Create `jest.config.js` in the project root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Unit Testing: Testing Utilities in Isolation

Unit tests verify individual functions work correctly. Let's test the file detection utility.

Create `lib/utils/__tests__/file-helpers.test.ts`:

```typescript
import { detectFileType, generateOutputFilename } from '../file-helpers';

describe('detectFileType', () => {
  it('should detect PDF files', () => {
    expect(detectFileType('resume.pdf')).toBe('pdf');
    expect(detectFileType('document.PDF')).toBe('pdf');
  });

  it('should detect DOCX files', () => {
    expect(detectFileType('resume.docx')).toBe('docx');
    expect(detectFileType('document.DOCX')).toBe('docx');
  });

  it('should detect DOC files', () => {
    expect(detectFileType('resume.doc')).toBe('docx');
  });

  it('should return unknown for unsupported types', () => {
    expect(detectFileType('resume.txt')).toBe('unknown');
    expect(detectFileType('image.jpg')).toBe('unknown');
    expect(detectFileType('no-extension')).toBe('unknown');
  });
});

describe('generateOutputFilename', () => {
  it('should generate filename with current date', () => {
    const filename = generateOutputFilename();
    expect(filename).toMatch(/^reformatted_resume_\d{4}-\d{2}-\d{2}\.docx$/);
  });

  it('should include custom prefix when provided', () => {
    const filename = generateOutputFilename('tailored');
    expect(filename).toMatch(/^tailored_resume_\d{4}-\d{2}-\d{2}\.docx$/);
  });
});
```

Run tests:

```bash
npm test
```

These tests are fast (milliseconds) and verify the logic without external dependencies.

### Component Testing: Testing React Components

Component tests verify UI components render correctly and respond to user interactions.

Create `components/__tests__/FileUploader.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploader } from '../FileUploader';

describe('FileUploader', () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('should render upload area', () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText(/Drop your resume here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
  });

  it('should accept PDF files', async () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Resume file input/i);

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it('should accept DOCX files', async () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const input = screen.getByLabelText(/Resume file input/i);

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('should reject files that are too large', async () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'huge.pdf', {
      type: 'application/pdf'
    });
    const input = screen.getByLabelText(/Resume file input/i);

    await userEvent.upload(input, largeFile);

    await waitFor(() => {
      expect(screen.getByText(/File size exceeds/i)).toBeInTheDocument();
    });
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('should reject unsupported file types', async () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'document.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/Resume file input/i);

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/Please upload a PDF or Word document/i)).toBeInTheDocument();
    });
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} disabled={true} />);

    const input = screen.getByLabelText(/Resume file input/i);
    expect(input).toBeDisabled();
  });

  it('should allow clearing selected file', async () => {
    render(<FileUploader onFileSelect={mockOnFileSelect} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Resume file input/i);

    await userEvent.upload(input, file);

    const clearButton = await screen.findByLabelText(/Remove selected file/i);
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(null);
    });
    expect(screen.queryByText('resume.pdf')).not.toBeInTheDocument();
  });
});
```

These tests verify:
- Component renders correctly
- File upload works
- Validation prevents bad files
- Clear functionality works
- Disabled state works

### API Route Testing

API route tests verify the backend logic. These are more complex because they involve file processing and external services.

Create `app/api/process/__tests__/route.test.ts`:

```typescript
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { extractTextFromPDF } from '@/lib/extractors/pdf-extractor';
import { extractTextFromDOCX } from '@/lib/extractors/docx-extractor';

// Mock the extractors
jest.mock('@/lib/extractors/pdf-extractor');
jest.mock('@/lib/extractors/docx-extractor');
jest.mock('@/lib/llm/openrouter-client');

describe('POST /api/process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no file is provided', async () => {
    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/process', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No file provided');
  });

  it('should extract text from PDF files', async () => {
    const mockExtractResult = {
      success: true,
      full_text: 'Sample resume text',
      total_pages: 1,
    };
    (extractTextFromPDF as jest.Mock).mockResolvedValue(mockExtractResult);

    const file = new File(['dummy pdf content'], 'resume.pdf', {
      type: 'application/pdf'
    });
    const formData = new FormData();
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/process', {
      method: 'POST',
      body: formData,
    });

    await POST(request);

    expect(extractTextFromPDF).toHaveBeenCalled();
  });

  it('should handle extraction errors gracefully', async () => {
    (extractTextFromPDF as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Failed to parse PDF',
    });

    const file = new File(['dummy pdf content'], 'resume.pdf', {
      type: 'application/pdf'
    });
    const formData = new FormData();
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/process', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to extract text');
  });

  // Add more tests for:
  // - Job description validation
  // - Security checks
  // - LLM integration
  // - DOCX generation
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Coverage report shows which lines of code are tested:

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   78.45 |    65.22 |   82.14 |   78.95 |
 components         |   85.71 |    72.50 |   90.00 |   86.20 |
  FileUploader.tsx  |   92.30 |    80.00 |   95.45 |   93.10 | 65-67
 lib/utils          |   95.00 |    88.88 |  100.00 |   94.73 |
  file-helpers.ts   |   95.00 |    88.88 |  100.00 |   94.73 | 12
--------------------|---------|----------|---------|---------|-------------------
```

Aim for at least 80% coverage on critical paths (API routes, business logic).

---

## Part V: Deployment to Production

Now let's deploy your application so others can use it.

### Environment Variables and Secrets

First, understand the difference between build-time and runtime variables in Next.js:

- **Public variables** (prefix: `NEXT_PUBLIC_`): Exposed to the browser
- **Private variables**: Only available on the server

Create `.env.local` for development:

```bash
# OpenRouter API (private - server only)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Public variables (exposed to browser)
NEXT_PUBLIC_APP_NAME=Federal Resume Studio
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**NEVER commit `.env.local` to git!** Add it to `.gitignore`:

```
.env.local
.env.*.local
```

Create `.env.example` to document what variables are needed:

```bash
# OpenRouter API Key (get from https://openrouter.ai)
OPENROUTER_API_KEY=

# App configuration
NEXT_PUBLIC_APP_NAME=Federal Resume Studio
NEXT_PUBLIC_APP_URL=
```

### Deploying to Vercel

Vercel is the company behind Next.js and offers the best hosting for Next.js apps.

#### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (this links your repos)

#### Step 2: Import Project

1. Click "Add New Project"
2. Import your Git repository
3. Vercel auto-detects it's a Next.js app

#### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add each variable from `.env.local`:
   - `OPENROUTER_API_KEY` = `your-actual-key`
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`

#### Step 4: Deploy

1. Click **Deploy**
2. Vercel automatically:
   - Installs dependencies (`npm install`)
   - Builds the app (`npm run build`)
   - Deploys to a global CDN
   - Gives you a URL like `https://your-app.vercel.app`

#### Step 5: Configure Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel: **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Vercel automatically provisions SSL certificates

### Production Considerations

#### 1. Increase Timeout Limits

From `app/api/process/route.ts:29-30`:

```typescript
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for Vercel Pro
```

Free tier has 10s timeout. For resume processing (which involves LLM calls), you need Pro plan with 60s timeouts.

#### 2. Monitor Costs

LLM API calls cost money. Track usage:

```typescript
// In lib/llm/openrouter-client.ts
usage: completion.usage
  ? {
      prompt_tokens: completion.usage.prompt_tokens,
      completion_tokens: completion.usage.completion_tokens,
      total_tokens: completion.usage.total_tokens,
    }
  : undefined,
```

Set up alerts in OpenRouter dashboard when spending exceeds thresholds.

#### 3. Error Tracking

Install Sentry for production error tracking:

```bash
npm install @sentry/nextjs
```

Initialize in `app/layout.tsx`:

```typescript
import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}
```

#### 4. Rate Limiting

Prevent abuse with rate limiting. Install `@upstash/ratelimit`:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to API route:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  // ... rest of processing
}
```

---

## Part VI: Best Practices

### Code Organization Principles

#### 1. Separation of Concerns

Notice how the project separates:
- **UI logic** (`components/`, `app/`)
- **Business logic** (`lib/`)
- **API routes** (`app/api/`)

Never put business logic directly in components or API routes. Always extract it to `lib/`.

**Bad:**

```typescript
// app/page.tsx
const handleProcess = async () => {
  // 200 lines of resume processing logic here...
}
```

**Good:**

```typescript
// app/page.tsx
const handleProcess = async () => {
  const result = await processResume(file, jobDescription);
  // Just handle the UI state
}

// lib/resume-processor.ts
export async function processResume(file: File, jobDescription?: string) {
  // All the processing logic
}
```

#### 2. Single Responsibility Principle

Each file should do one thing well. From the project:

- `pdf-extractor.ts` - Only extracts text from PDFs
- `docx-extractor.ts` - Only extracts text from DOCX
- `openrouter-client.ts` - Only handles LLM API calls
- `structured-docx-generator.ts` - Only generates DOCX files

If a file grows beyond ~400 lines, consider splitting it.

#### 3. Type Safety with TypeScript

Always define interfaces for data structures. From `lib/types/resume-types.ts`:

```typescript
export interface StructuredResume {
  contactInfo: ContactInfo;
  citizenship: CitizenshipInfo;
  workExperience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
  training?: string[];
  skills?: Skills;
}
```

This gives you:
- Auto-completion in your editor
- Compile-time error checking
- Self-documenting code

### Performance Optimization

#### 1. Lazy Loading Components

For large components not immediately visible:

```typescript
import dynamic from 'next/dynamic';

const FeedbackModal = dynamic(() => import('@/components/FeedbackModal'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Don't render on server if it needs browser APIs
});
```

#### 2. Memoization

Use `React.memo` for expensive components that don't need to re-render often:

```typescript
import { memo } from 'react';

export const ProcessingStatus = memo(function ProcessingStatus({
  status,
  stage,
  progress
}: ProcessingStatusProps) {
  // Component implementation
});
```

This prevents re-renders when parent re-renders but props haven't changed.

#### 3. Debouncing User Input

For the job description textarea, debounce to avoid excessive re-renders:

```typescript
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedUpdate = useCallback(
  debounce((value: string) => {
    setJobDescription(value);
  }, 300),
  []
);

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  debouncedUpdate(e.target.value);
};
```

### Security Best Practices

#### 1. Input Validation (Defense in Depth)

Always validate on both client AND server. The client validation improves UX, but server validation prevents malicious requests.

From `lib/utils/security-validators.ts`:

```typescript
export function validateJobDescription(text: string): ValidationResult {
  // Check length
  if (text.length < 50) {
    return { isValid: false, reason: "Job description too short (min 50 characters)" };
  }

  if (text.length > 10000) {
    return { isValid: false, reason: "Job description too long (max 10,000 characters)" };
  }

  // Check for prompt injection attempts
  const injectionPatterns = [
    /ignore\s+(previous|above|all)\s+instructions/i,
    /system\s*:/i,
    /(?:you\s+are|act\s+as|pretend\s+to\s+be)\s+(?:a|an)/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        reason: "Invalid content detected in job description"
      };
    }
  }

  return { isValid: true };
}
```

#### 2. Sanitization

Remove dangerous content before processing:

```typescript
export function sanitizeResumeContent(text: string): SanitizationResult {
  const removedPatterns: string[] = [];
  let sanitized = text;

  // Remove suspected prompt injection attempts
  const suspiciousPatterns = [
    { pattern: /(?:^|\n)\s*system\s*:/gim, name: "System directives" },
    { pattern: /\[INST\]|\[\/INST\]/gi, name: "Instruction markers" },
  ];

  for (const { pattern, name } of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '');
      removedPatterns.push(name);
    }
  }

  return {
    isSafe: true,
    sanitized: sanitized.trim(),
    removedPatterns,
  };
}
```

#### 3. Environment Variable Security

Never expose secrets to the browser:

```typescript
// ✅ GOOD - server-only
const apiKey = process.env.OPENROUTER_API_KEY;

// ❌ BAD - would be exposed to browser
const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
```

#### 4. Content Security Policy

Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## Part VII: Extension Ideas - Make It Your Own

Now that you understand the system, here are ideas for extending it:

### 1. Add Support for More File Formats

Currently supports PDF and DOCX. Add RTF or plain text:

**Create `lib/extractors/txt-extractor.ts`:**

```typescript
export interface ExtractResult {
  success: boolean;
  full_text?: string;
  error?: string;
  total_pages?: number;
}

export async function extractTextFromTXT(buffer: Buffer): Promise<ExtractResult> {
  try {
    const text = buffer.toString('utf-8');

    return {
      success: true,
      full_text: text,
      total_pages: 1,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read text file',
      total_pages: 0,
    };
  }
}
```

**Update `app/api/process/route.ts`:**

```typescript
import { extractTextFromTXT } from "@/lib/extractors/txt-extractor";

// In the extraction section:
let extractResult;
if (fileType === "pdf") {
  extractResult = await extractTextFromPDF(buffer);
} else if (fileType === "txt") {
  extractResult = await extractTextFromTXT(buffer);
} else {
  extractResult = await extractTextFromDOCX(buffer);
}
```

**Update `lib/utils/file-helpers.ts`:**

```typescript
export type FileType = "pdf" | "docx" | "txt" | "unknown";

export function detectFileType(filename: string): FileType {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (ext === 'txt') return 'txt';

  return 'unknown';
}
```

### 2. Add Resume Templates

Create multiple output formats (not just federal):

**Create `lib/generators/templates/`:**

```
lib/generators/templates/
  ├── federal-template.ts
  ├── modern-template.ts
  ├── academic-template.ts
  └── index.ts
```

**Add template selection to UI:**

```typescript
// components/TemplateSelector.tsx
export function TemplateSelector({
  selected,
  onSelect
}: {
  selected: string;
  onSelect: (template: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <TemplateCard
        name="Federal"
        description="OPM-compliant format"
        selected={selected === 'federal'}
        onClick={() => onSelect('federal')}
      />
      <TemplateCard
        name="Modern"
        description="Clean, contemporary design"
        selected={selected === 'modern'}
        onClick={() => onSelect('modern')}
      />
      <TemplateCard
        name="Academic"
        description="CV-style for research positions"
        selected={selected === 'academic'}
        onClick={() => onSelect('academic')}
      />
    </div>
  );
}
```

### 3. Add Real-Time Preview

Show a live preview of the resume as it's being generated:

```typescript
// components/ResumePreview.tsx
import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

export function ResumePreview({
  generatedResume
}: {
  generatedResume: Blob | null
}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (generatedResume) {
      const url = URL.createObjectURL(generatedResume);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [generatedResume]);

  if (!pdfUrl) return null;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
```

### 4. Add User Accounts and History

Track users' resume versions:

**Set up database (Prisma + PostgreSQL):**

```bash
npm install prisma @prisma/client
npx prisma init
```

**Create `prisma/schema.prisma`:**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  resumes   Resume[]
  createdAt DateTime @default(now())
}

model Resume {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  filename    String
  fileUrl     String
  version     Int      @default(1)
  createdAt   DateTime @default(now())

  @@index([userId])
}
```

**Create API route `app/api/resumes/route.ts`:**

```typescript
export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ resumes });
}
```

### 5. Integrate with USAJobs API

Fetch job descriptions directly from USAJobs:

**Create `lib/integrations/usajobs-api.ts`:**

```typescript
export interface USAJobsPosition {
  jobTitle: string;
  organization: string;
  description: string;
  qualifications: string;
  location: string;
}

export async function fetchJobDescription(
  jobId: string
): Promise<USAJobsPosition | null> {
  const response = await fetch(
    `https://data.usajobs.gov/api/search?PositionID=${jobId}`,
    {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': process.env.USAJOBS_EMAIL!,
        'Authorization-Key': process.env.USAJOBS_API_KEY!,
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const position = data.SearchResult?.SearchResultItems?.[0]?.MatchedObjectDescriptor;

  if (!position) return null;

  return {
    jobTitle: position.PositionTitle,
    organization: position.OrganizationName,
    description: position.UserArea?.Details?.JobSummary,
    qualifications: position.QualificationSummary,
    location: position.PositionLocationDisplay,
  };
}
```

**Add to UI:**

```typescript
// components/USAJobsImporter.tsx
export function USAJobsImporter({
  onImport
}: {
  onImport: (description: string) => void
}) {
  const [jobId, setJobId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const response = await fetch(`/api/usajobs/${jobId}`);
    const job = await response.json();

    const fullDescription = `
${job.jobTitle} at ${job.organization}

Location: ${job.location}

${job.description}

Qualifications:
${job.qualifications}
    `.trim();

    onImport(fullDescription);
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter USAJobs Job ID (e.g., 12345678)"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
      />
      <Button onClick={handleImport} disabled={loading}>
        {loading ? 'Importing...' : 'Import Job Description'}
      </Button>
    </div>
  );
}
```

### 6. Add AI-Powered Cover Letter Generation

Extend the system to also generate cover letters:

**Create `lib/llm/prompts-cover-letter.ts`:**

```typescript
export function buildCoverLetterPrompt(
  resumeText: string,
  jobDescription: string,
  userNotes?: string
): string {
  return `Generate a professional federal cover letter based on this resume and job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

${userNotes ? `ADDITIONAL NOTES:\n${userNotes}` : ''}

Generate a compelling cover letter that:
1. Addresses the specific requirements in the job description
2. Highlights relevant experience from the resume
3. Uses professional federal government tone
4. Is exactly 3-4 paragraphs
5. Includes a strong opening and closing

Format as plain text, ready to be copied into a letter template.`;
}
```

**Add API route `app/api/cover-letter/route.ts`:**

```typescript
export async function POST(request: NextRequest) {
  const { resumeText, jobDescription, userNotes } = await request.json();

  const prompt = buildCoverLetterPrompt(resumeText, jobDescription, userNotes);
  const systemMessage = "You are an expert at writing federal government cover letters.";

  const llmClient = new OpenRouterClient();
  const result = await llmClient.chatCompletion([
    { role: "system", content: systemMessage },
    { role: "user", content: prompt },
  ]);

  return NextResponse.json({ coverLetter: result.content });
}
```

### 7. Analytics Dashboard

Track usage statistics:

**Create `lib/analytics/tracker.ts`:**

```typescript
export async function trackEvent(event: {
  type: 'resume_uploaded' | 'resume_generated' | 'resume_downloaded';
  metadata?: Record<string, any>;
}) {
  await prisma.analyticsEvent.create({
    data: {
      type: event.type,
      metadata: event.metadata,
      timestamp: new Date(),
    },
  });
}
```

**Create dashboard `app/dashboard/page.tsx`:**

```typescript
export default async function DashboardPage() {
  const stats = await prisma.analyticsEvent.groupBy({
    by: ['type'],
    _count: true,
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <Card key={stat.type}>
            <CardHeader>
              <CardTitle>{stat.type.replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stat._count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## Conclusion: Your Journey Continues

You've now completed a comprehensive deep dive into this modern JavaScript/TypeScript project. You've learned:

✅ **React fundamentals**: Hooks, components, props, and state management
✅ **Next.js architecture**: Server/client components, file-based routing, API routes
✅ **Full data flow**: From user click to API processing to file download
✅ **Testing strategies**: Unit, component, and API testing
✅ **Deployment**: Production-ready configuration and environment management
✅ **Best practices**: Security, performance, and code organization
✅ **Extension ideas**: How to add new features and make it your own

### Next Steps

1. **Experiment**: Change something small and see what happens
2. **Break things**: The best way to learn is by fixing what you break
3. **Read error messages**: They're more helpful than you think
4. **Use TypeScript**: Let it guide you with autocomplete and error checking
5. **Ask questions**: Whether to AI assistants, documentation, or communities

### Resources

- [React Documentation](https://react.dev) - Official React docs (excellent)
- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook) - Learn TypeScript
- [Vercel Platform](https://vercel.com/docs) - Deployment guides

Remember: You already know how to program. This is just a different syntax for the same concepts. Variables, functions, loops, conditionals, classes—they're all here, just spelled differently.

Welcome to JavaScript. You've got this.
