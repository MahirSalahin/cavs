# CAVS Frontend

The frontend application for CUET Anonymous Voting System built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory with required environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🎨 Features

- **Authentication**: Secure login with CUET email
- **Poll Management**: Create, vote, and view poll results
- **Real-time Updates**: Live poll results and countdowns
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in theme support
- **Animations**: Smooth transitions with Framer Motion

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management

## 🚀 Deployment

The application can be deployed using [Vercel](https://vercel.com/), the platform from the creators of Next.js.

```bash
pnpm build
pnpm start
```

For detailed deployment instructions, check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
