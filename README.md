# PixenBuy

PixenBuy is an e-commerce application built with **React** and **TypeScript** using data from the [Fake Store API](https://fakestoreapi.com/). It was created as part of an internship assignment to demonstrate proficiency in component design, state management, routing, and basic UI/UX.

# Deployed Link 

This project is deployed on Vercel. [Click here](https://pixenbuy.vercel.app/)

## Features

- Product listing with pagination
- Product details page with quantity selector and Add to Cart
- Functional cart system using React Context API
- Live product search with suggestion dropdown
- Category navigation link 
- Responsive layout for both desktop and mobile
- Clean UI using Tailwind CSS and shadcn/ui
- Routing handled with `react-router-dom`
- Toast notifications using `react-toastify`

## Tech Stack

- **Frontend Framework:** React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router
- **State Management:** Context API
- **Notifications:** React Toastify
- **Icons:** Lucide React Icons
- **Build Tool:** Vite
- **API:** Fake Store API

## Project Structure

```
pixenbuy/
├── public/                    # Static assets and images
├── src/
│   ├── api/                   # API functions for Fake Store
│   ├── assets/                # Static assets (images, icons)
│   ├── components/
│   │   ├── HomeComponents/    # Home page specific components
│   │   ├── SharedComponents/  # Reusable components (Navbar, Footer, etc.)
│   │   └── ui/                # UI components library
│   ├── context/
│   │   ├── CartContext.ts     # Cart context definitions
│   │   ├── CartProvider.tsx   # Cart context provider
│   │   └── useCart.ts         # Cart hook
│   ├── lib/                   # Utility libraries and configurations
│   ├── pages/
│   │   ├── Cart.tsx           # Cart page
│   │   ├── Category.tsx       # Category page
│   │   ├── Checkout.tsx       # Checkout page
│   │   ├── ErrorPage.tsx      # Error page
│   │   └── Home.tsx           # Home page
│   ├── utils/                 # Utility functions (slugify)
│   ├── App.css               # Global styles
│   ├── App.tsx               # Main App component
│   ├── index.css             # Root styles
│   └── main.tsx              # Entry point
├── .gitignore
├── components.json           # Shadcn/ui configuration
├── eslint.config.js          # ESLint configuration
├── index.html                # Main HTML template
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependencies
├── README.md                 # Project documentation
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # TypeScript app configuration
├── tsconfig.node.json        # TypeScript Node configuration
├── vercel.json               # Vercel deployment configuration
└── vite.config.ts            # Vite configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pixenbuy.git
   cd pixenbuy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` in your web browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

This project uses the [Fake Store API](https://fakestoreapi.com/) for product data:
- Products: `https://fakestoreapi.com/products`
- Categories: `https://fakestoreapi.com/products/categories`
- Single Product: `https://fakestoreapi.com/products/{id}`

## Key Features Implementation

### Cart System
- Built with React Context API
- Add/remove items functionality
- Quantity management
- Real-time cart updates

### Search Functionality
- Live search with debouncing
- Dropdown suggestions
- Client-side filtering

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Clean and modern UI components using shadcn/ui

## Future Enhancements

- [ ] Add user authentication
- [ ] Include product reviews and ratings
- [ ] Add wishlist functionality
- [ ] Implement checkout process

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project was created for internship demonstration purposes. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational and internship demonstration purposes only. Not intended for commercial use.

## Contact

For any questions or feedback regarding this project, please feel free to reach out on [Twitter/X](https://x.com/_manishmk)

