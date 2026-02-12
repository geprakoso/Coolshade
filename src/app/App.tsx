import { ColorShadeGenerator } from './components/ColorShadeGenerator';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Sparkles className="size-5 md:size-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CoolShades
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Generate beautiful color shades
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Create Perfect Color Shades
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Enter any color and generate a complete shade palette from light to dark.
          </p>
        </div>

        <ColorShadeGenerator />
      </main>

      {/* Footer */}
      <footer className="mt-12 md:mt-20 pb-6 md:pb-8 text-center text-xs md:text-sm text-gray-500">
        <p>Made with ❤️ by Dan</p>
      </footer>
    </div>
  );
}