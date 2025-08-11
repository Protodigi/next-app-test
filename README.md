# Next.js + Supabase Todos App

A modern, full-stack todo application built with Next.js 14, Supabase, and shadcn/ui components. Features real-time updates, user authentication, and a beautiful responsive design.

## ✨ Features

- 🔐 **Multiple Authentication Methods**
  - Email/Password login
  - Magic link authentication
  - GitHub OAuth integration
- 📝 **Real-time Todo Management**
  - Create, read, update, delete todos
  - Mark todos as complete/incomplete
  - Real-time updates across all connected clients
- 🎨 **Modern UI/UX**
  - Built with shadcn/ui components
  - Responsive design for all devices
  - Dark/light mode support
- 🚀 **Performance Optimized**
  - Singleton Supabase client pattern
  - Efficient React component rendering
  - Optimized database queries

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library
- **Language**: TypeScript
- **Deployment**: Docker support included

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd next-app-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create todos table
CREATE TABLE public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_inserted_at ON public.todos(inserted_at DESC);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own todos" ON public.todos
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own todos" ON public.todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON public.todos
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON public.todos
    FOR DELETE USING (auth.uid() = user_id);
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker

```bash
# Build image
docker build -t next-app-test .

# Run container
docker run -p 3000:3000 next-app-test
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Marketing pages
│   ├── signin/           # Sign in page
│   ├── signup/           # Sign up page
│   ├── todos/            # Todos application
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client configuration
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable Email and GitHub authentication providers
3. Copy your project URL and anon key to `.env.local`

### Authentication Providers

The app supports multiple authentication methods:
- **Email/Password**: Traditional credential-based login
- **Magic Link**: Passwordless email authentication
- **GitHub OAuth**: Social login integration

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

**Happy coding! 🎉**

