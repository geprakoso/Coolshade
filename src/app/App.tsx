import { ColorShadeGenerator } from './components/ColorShadeGenerator';
import { Sparkles, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans text-gray-800">

      {/* Navbar - Floating Glass */}
      {/* <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0">
        <div className="max-w-3xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-1.5 rounded-lg">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              CoolShades
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">About</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-8 pb-16">

        {/* Hero Section */}
        {/* <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 drop-shadow-sm">
            Perfect Color <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Palettes</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto glass-card px-6 py-3 rounded-2xl inline-block">
            Generate beautiful, consistent color shades for your next project in seconds.
          </p>
        </div> */}

        {/* Generator Component */}
        <div className="w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ColorShadeGenerator />
        </div>

      </main>

      {/* Footer */}
      {/* <footer className="py-8 text-center text-sm text-gray-500/80">
        <p>© {new Date().getFullYear()} CoolShades. Crafted with translucency.</p>
      </footer> */}
    </div>
  );
}