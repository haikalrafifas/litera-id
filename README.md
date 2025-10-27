# Litera.id
Online library web application made to digitalize librarians and visitors on their daily library operation.
It is made as a final project for college class of `Software Testing and Quality Assurance`.
This application prioritizes software testing suites within its development phase.

## Getting Started
First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
- Informative landing page.
- Book management system.
- Member management system.
- Book borrowing system.

## For Developers
### Project Structure
```
src/
├── app/                      # Next.js routing
├── components/               # Page components (atomic design)
│   └── [feature-based]   
├── contexts/                 # Global React state (auth, theme, etc.)
├── database/                 # Database config & scripts
├── domains/                  # DDD domains
│   └── [domain]/
│       ├── controller.ts
│       ├── service.ts
│       └── model.ts
├── middlewares/              # Backend route-specific middleware
├── schemas/                  # Zod validation schemas (frontend/backend)
├── utilities/                # Utils by environment
│   ├── client/
│   ├── server/
│   └── shared/

```

### Database Migration
```
$ pnpm db migrate:latest
```

### License
MIT
