# Autoparts - Кузовные запчасти

E-commerce platform for auto body parts with modern UI/UX and comprehensive features.

## 🎯 Project Overview

This is a full-stack auto parts marketplace application built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: NestJS (TypeScript, Node.js)
- **State Management**: React Context API / Redux (to be determined)
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS-per-component architecture

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool (faster than CRA)
- **React Router v6** - Client-side routing
- **Custom CSS** - Component-scoped styling

#### Backend (Planned)
- **NestJS** - Enterprise Node.js framework
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **JWT** - Authentication
- **bcrypt/Argon2** - Password hashing

### Folder Structure

```
autoparts/
├── backend/                    # NestJS backend (to be implemented)
│   ├── src/
│   │   ├── modules/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── entities/
│   └── package.json
│
└── frontend/                   # React TypeScript frontend
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   ├── Header/
    │   │   │   ├── Header.tsx
    │   │   │   └── Header.css
    │   │   ├── SearchSection/
    │   │   ├── CategoryCard/
    │   │   └── ...
    │   ├── pages/              # Page-level components
    │   │   ├── MainPage/
    │   │   │   ├── MainPage.tsx
    │   │   │   └── MainPage.css
    │   │   ├── CatalogPage/
    │   │   ├── CartPage/
    │   │   └── ...
    │   ├── assets/             # Images, icons, fonts
    │   ├── utils/              # Helper functions
    │   ├── types/              # TypeScript interfaces/types
    │   ├── App.tsx             # Main app with routing
    │   ├── main.tsx            # Entry point
    │   └── index.css           # Global styles
    └── package.json
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563eb` - Buttons, links, accents
- **Primary Blue Hover**: `#1d4ed8` - Interactive states
- **Text Primary**: `#1a1a1a` - Main text
- **Text Secondary**: `#666` - Subtle text
- **Border**: `#e5e7eb` - Dividers, card borders
- **Background Gray**: `#f9fafb` - Page background

### Typography
- **Font Family**: System fonts (-apple-system, Segoe UI, etc.)
- **Heading 1**: 3rem (48px), bold
- **Heading 2**: 2rem (32px), bold
- **Body**: 1rem (16px), normal

### Responsive Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ 
- **pnpm**: v8+ (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd autoparts
```

2. **Install frontend dependencies**
```bash
cd frontend
pnpm install
```

3. **Configure Vite** (already done)
The `vite.config.ts` is configured to bind to `0.0.0.0` or `127.0.0.1` for local development.

4. **Start development server**
```bash
pnpm dev
```

The app will be available at:
- `http://localhost:5173` or
- `http://127.0.0.1:5173`

### Building for Production

```bash
cd frontend
pnpm build
```

Output will be in `frontend/dist/` directory.

## 📱 Features & Roadmap

### Phase 1: Core UI (✅ Completed)
- [x] Project setup with Vite + React + TS
- [x] Routing with React Router
- [x] Main page with hero section
- [x] Search functionality UI
- [x] Category cards (Капоты, Бамперы, Крылья, Фары)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Header with navigation

### Phase 2: Product Catalog (~14 hours)
- [ ] Catalog page with brand/model selection
- [ ] Product listing with filters
- [ ] Product cards with images, prices
- [ ] Sorting (price, brand, etc.)
- [ ] Integration with existing products API

### Phase 3: Shopping Cart (~12 hours)
- [ ] Cart page with item management
- [ ] Quantity controls
- [ ] Price calculation
- [ ] Checkout flow

### Phase 4: Authentication (~8 hours)
- [ ] Login page
- [ ] Registration page with validation
- [ ] Password strength indicator
- [ ] JWT token handling
- [ ] Protected routes

### Phase 5: User Profile (~14 hours)
- [ ] Profile page with user data
- [ ] Order history
- [ ] Order status tracking
- [ ] Payment/delivery preferences

### Phase 6: Additional Pages (~6 hours)
- [ ] Contact page
- [ ] About page
- [ ] Price lists download
- [ ] 404 page

### Phase 7: Backend & Security (~10 hours)
- [ ] NestJS backend setup
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] Password hashing (bcrypt/Argon2)
- [ ] Rate limiting
- [ ] CORS configuration

### Phase 8: Deployment & Production (~10 hours)
- [ ] VPS setup
- [ ] Nginx configuration
- [ ] HTTPS/SSL certificates
- [ ] Cloudflare proxy
- [ ] Environment variables
- [ ] CI/CD pipeline

**Total Estimated Time**: 89-90 hours (~11-12 working days)

## 🔌 API Integration

### External Products API
The application will integrate with an existing products API (details to be added).

**Endpoints** (to be documented):
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `GET /api/categories` - Categories list
- etc.

## 🛠️ Development Guidelines

### Component Structure
Each component should have:
- `.tsx` file with component logic
- `.css` file with component-specific styles
- Clear, descriptive names (e.g., `CategoryCard`, not `Card`)

### CSS Conventions
- Use CSS custom properties (variables) defined in `index.css`
- Follow BEM-like naming: `.component-name`, `.component-name-element`
- Mobile-first approach with `@media` queries
- Keep styles scoped to components

### TypeScript Best Practices
- Always define prop interfaces
- Use strict mode
- Avoid `any` type
- Define types for API responses

### Code Style
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

### Git Workflow
- Feature branches: `feature/component-name`
- Bug fixes: `fix/issue-description`
- Commit messages: Clear and descriptive
- Never commit `node_modules` or `.env` files

## 🔐 Security Considerations

### Frontend
- Input sanitization
- XSS prevention
- CSRF tokens
- Secure cookie handling
- HTTPS only in production

### Backend (Planned)
- Password hashing (bcrypt/Argon2)
- JWT with refresh tokens
- Rate limiting on login/search/registration
- SQL injection prevention (ORM)
- Environment variables for secrets
- CORS configuration
- Helmet.js for HTTP headers

## 📦 Dependencies

### Frontend Production
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.1.1

### Frontend Development
- `@vitejs/plugin-react`: ^4.3.4
- `typescript`: ~5.6.2
- `vite`: ^7.2.6
- `eslint`: ^9.17.0

## 📄 License

[Your License Here]

## 👥 Team

[Your Team Information]

## 📞 Support

For questions or issues:
- Email: info@example.com
- Phone: +7 (495) 123-45-67
- Address: г Москва, ул. Ленина, д. 10

---

**Last Updated**: December 4, 2025

