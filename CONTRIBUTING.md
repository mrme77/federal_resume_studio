# Contributing to Federal Resume Studio

Thank you for your interest in contributing to Federal Resume Studio! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We love new ideas! Please open an issue with:
- A clear description of the feature
- Why it would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** and test them locally
4. **Follow the code style** of the project
5. **Write clear commit messages**
6. **Test your changes** thoroughly
7. **Submit a pull request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/resume-project-app.git
cd resume-project-app

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your OpenRouter API key to .env.local
# OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Run development server
npm run dev
```

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (we use ESLint)
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 50 characters
- Add details in the body if needed

Examples:
```
Add job mismatch detection feature
Fix PDF extraction for large files
Update README with deployment instructions
```

### Testing

Before submitting a PR:
- Test your changes locally with `npm run dev`
- Build the project with `npm run build`
- Run the linter with `npm run lint`

### What to Contribute

Good first contributions:
- Documentation improvements
- Bug fixes
- UI/UX enhancements
- Accessibility improvements
- Test coverage
- Performance optimizations

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

### Questions?

Open an issue or reach out via GitHub Discussions!

---

Thank you for contributing! ⭐
