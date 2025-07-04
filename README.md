# Fruitenium Web Application (Frontend)

A modern, responsive frontend web application for Fruitenium Technologies Pvt Ltd. This project provides a seamless user experience for browsing digital products, managing orders, and accessing customer dashboards.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contact](#contact)
- [License](#license)

---

## Features

- Product listing and detail pages
- Shopping cart and checkout flow
- Customer dashboard for order tracking
- Responsive design with Tailwind CSS
- Smooth page transitions (Framer Motion)
- Contact and support forms

---

## Tech Stack

- **React** (with Vite)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

```

## Project Structure

fruitenium_webapp/
│
├── public/                        # Static assets
│   └── .htaccess
├── assets/ 
│   └── logo.png
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── UserMenu.jsx
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── toaster.jsx
│   │       ├── toast.jsx
│   │       └── ... (other UI components)
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── api.js
│   │   ├── supabase.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── AboutUs.jsx
│   │   ├── CancellationPolicy.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── RefundPolicy.jsx
│   │   ├── Register.jsx
│   │   ├── Terms.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Products.jsx
│   │   ├── auth/
│   │   │   ├── callback.js
│   │   └── ... (other pages)
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── .nvmrc                         # Node.js version (20.19.1)
├── package.lock.json
├── index.html
├── LICENSE
├── package.json                   # Project scripts and dependencies
├── tsconfig.json                  # TypeScript configuration 
├── tailwind.config.js             # Tailwind CSS configuration
├── vite.config.ts                 # Vite configuration
└── README.md                      # Project documentation


```

## Getting Started

### Prerequisites

- **Node.js** (version 20.19.1 recommended, see `.nvmrc`)
- **npm** (v9+ recommended)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/fruitenium.git
   cd fruitenium
   ```
   2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Mobile Development

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
