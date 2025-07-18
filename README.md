# 🛍️ FakeStore - Modern E-commerce Application

A high-performance, accessible e-commerce application built with Next.js, TypeScript, and the Fake Store API. This project demonstrates modern web development best practices including clean architecture, performance optimization, and accessibility compliance.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.3+
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Context

### API Integration

- **Data Source**: Fake Store API (https://fakestoreapi.com)
- **HTTP Client**: Native Fetch API
- **Error Handling**: Custom error classes and boundaries

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Git**: For version control

### Installation

1. **Clone the repository**

```bash
 git clone https://github.com/omar1Mayallo/single-fakestore.git
 cd single-fakestore
```

2. **Install dependencies**

   ```bash

   # Using npm

   npm install

   # Using yarn

   yarn install

   # Using pnpm

   pnpm install
   ```

3. **Start the development server**

   ```bash

   # Using npm

   npm run dev

   # Using yarn

   yarn dev

   # Using pnpm

   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file in the root directory (optional):
\`\`\`env

## 🏗️ Architecture

### Clean Architecture Principles

1. **Separation of Concerns**

   - API logic in `services/`
   - Business logic in custom hooks
   - UI components are pure and reusable

2. **Dependency Inversion**

   - Components depend on abstractions (hooks)
   - Services are injected through context

3. **Single Responsibility**
   - Each component has one clear purpose
   - Hooks handle specific data concerns

### State Management

- **Global State**: React Context for cart management
- **Server State**: Custom hooks with built-in caching
- **Local State**: useState for component-specific state
- **Persistence**: localStorage for cart data

### Performance Strategy

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React.lazy and dynamic imports
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search input optimization

## 🚀 Deployment

Demo: [https://single-fakestore.vercel.app/](https://single-fakestore.vercel.app/)
