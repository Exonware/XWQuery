# International Standards Viewer

A beautiful, modern TypeScript-based viewer for international standards in JSON format. Converts JSON standards to Markdown and displays them in an elegant interface, powered by FastAPI backend.

## Features

- 📚 Load and display all international standards from JSON files via FastAPI
- ✅ JSON Schema validation
- 📝 Automatic JSON to Markdown conversion
- 🎨 Modern, responsive UI with CSS5 features
- 🔍 Search and filter capabilities
- 📥 Export standards as Markdown files
- 🖨️ Print support
- 📊 Statistics dashboard
- 🔌 RESTful API with automatic documentation

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js (v16 or higher) for TypeScript compilation
- npm or yarn

### Installation

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Install Node.js dependencies (for TypeScript compilation):**
```bash
cd frontend
npm install
```

3. **Compile TypeScript:**
```bash
cd frontend
npm run build
```

### Running the Server

From the project root directory:

```bash
cd backend
python server.py
```

The server will start at `http://localhost:8000`

- **Viewer**: http://localhost:8000/
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

### Development

For TypeScript development with auto-recompilation:

```bash
cd frontend
npm run watch
```

## API Endpoints

The FastAPI server provides the following endpoints:

- `GET /api/standards` - List all available standards with metadata
- `GET /api/standards/{standard_id}` - Get full JSON data for a specific standard
- `GET /api/categories` - Get all unique categories
- `GET /api/organizations` - Get all unique organizations
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## Usage

1. Start the FastAPI server using `python server.py`
2. Open `http://localhost:8000` in your browser
3. Browse standards in the sidebar
4. Click on any standard to view its details in Markdown format
5. Use the search box to find specific standards
6. Filter by category, organization, or status
7. Export standards as Markdown files using the export button

## File Structure

```
.
├── backend/
│   ├── server.py          # FastAPI server
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling with CSS5 features
│   ├── main.ts            # TypeScript source code
│   ├── main.js            # Compiled JavaScript
│   ├── tsconfig.json      # TypeScript configuration
│   ├── package.json       # Node.js dependencies
│   └── README.md          # This file
├── menu/                  # Governance index JSON
├── media/                 # Media assets
├── data/                  # Governance data
│   ├── standards/        # JSON standard files
│   ├── bylaws/           # JSON bylaw files
│   └── ...               # Other governance folders
└── schemas/               # JSON schemas (at project root)
```

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- Uvicorn - ASGI server

### Frontend
- TypeScript for type-safe code
- Marked.js for Markdown parsing and rendering
- Highlight.js for code syntax highlighting
- AJV for JSON Schema validation
- Modern CSS with gradients, animations, and responsive design

## XWUI Component Library

The XWUI component library in `src/components` is **vanilla TypeScript** and **framework-agnostic**. Components use the DOM API and custom elements (e.g. `<xwui-button>`, `<xwui-mobile-stepper>`). There is no React or other framework dependency; the library can be used from any stack (React, Vue, Svelte, Angular, or plain HTML/JS).

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires ES2020 support for modules.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Security

For security concerns, please see our [Security Policy](SECURITY.md).
