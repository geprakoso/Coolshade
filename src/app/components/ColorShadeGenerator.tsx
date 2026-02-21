import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Palette, Copy, Check, History, Trash2, Pipette } from 'lucide-react';

export function ColorShadeGenerator() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load recent colors from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('coolshade-recent-colors');
    if (saved) {
      try {
        setRecentColors(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent colors', e);
      }
    }
  }, []);

  // Save color to recent list
  const addToRecent = (color: string) => {
    // Normalize
    const normalized = color.toLowerCase();

    setRecentColors(prev => {
      // Remove if exists
      const filtered = prev.filter(c => c.toLowerCase() !== normalized);
      // Add to front
      const newColors = [normalized, ...filtered].slice(0, 10); // Keep max 10
      localStorage.setItem('coolshade-recent-colors', JSON.stringify(newColors));
      return newColors;
    });
  };

  // Debouce adding to recent colors
  useEffect(() => {
    const timer = setTimeout(() => {
      if (/^#[0-9a-f]{6}$/i.test(baseColor)) {
        addToRecent(baseColor);
      }
    }, 1500); // Wait 1.5s after user stops typing/dragging

    return () => clearTimeout(timer);
  }, [baseColor]);

  // Generate shades from a base color
  const generateShades = (color: string) => {
    const shades = [];
    const percentages = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 59, g: 130, b: 246 };
    };

    // Convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const rgb = hexToRgb(color);

    percentages.forEach((percentage, index) => {
      let r, g, b;

      if (percentage <= 500) {
        // Lighten the color
        const factor = (500 - percentage) / 500;
        r = rgb.r + (255 - rgb.r) * factor;
        g = rgb.g + (255 - rgb.g) * factor;
        b = rgb.b + (255 - rgb.b) * factor;
      } else {
        // Darken the color
        const factor = (percentage - 500) / 500;
        r = rgb.r * (1 - factor * 0.7);
        g = rgb.g * (1 - factor * 0.7);
        b = rgb.b * (1 - factor * 0.7);
      }

      shades.push({
        name: percentage,
        hex: rgbToHex(r, g, b),
        rgb: `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`
      });
    });

    return shades;
  };

  const shades = generateShades(baseColor);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseColor(value);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('#')) {
      setBaseColor(value);
    } else {
      setBaseColor(`#${value}`);
    }
  };

  const clearHistory = () => {
    setRecentColors([]);
    localStorage.removeItem('coolshade-recent-colors');
  };

  const handleEyeDropper = async () => {
    // @ts-ignore - Check if running inside Tauri
    if (window.__TAURI_INTERNALS__) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const color = await invoke<string>('pick_color');
        if (color) {
          setBaseColor(color);
        }
      } catch (e) {
        console.error('Tauri color picker failed:', e);
        // Fallback: open the native HTML color input
        const colorInput = document.getElementById('base-color-picker');
        if (colorInput) colorInput.click();
      }
      return;
    }

    // Fallback for regular browser: use HTML color input
    const colorInput = document.getElementById('base-color-picker');
    if (colorInput) colorInput.click();
  };

  return (
    <div className="w-full space-y-8">
      {/* Input Form Section */}
      <div className="glass-card rounded-3xl p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Color Preview/Picker Circle */}
          <div className="relative group shrink-0">
            <div
              className="size-20 md:size-24 rounded-full shadow-inner border-4 border-white/50 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: baseColor }}
            ></div>
            <Input
              id="base-color-picker"
              type="color"
              value={baseColor}
              onChange={handleColorChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Palette className="text-white/80 drop-shadow-md size-8" />
            </div>
          </div>

          <div className="flex-grow space-y-4 w-full text-center md:text-left">
            <div>
              <Label htmlFor="hex-input" className="text-gray-500 font-medium mb-1.5 block">Base Color</Label>
              <div className="relative max-w-xs mx-auto md:mx-0 flex gap-2">
                <Input
                  id="hex-input"
                  type="text"
                  value={baseColor.toUpperCase()}
                  onChange={handleHexInputChange}
                  className="glass-input h-12 text-lg font-mono text-center md:text-left pl-4 tracking-wider flex-grow"
                  maxLength={7}
                />

                <button
                  onClick={handleEyeDropper}
                  className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:border-blue-400 text-gray-600 hover:text-blue-500 transition-all shadow-sm"
                  title="Pick color from screen"
                >
                  <Pipette className="size-5" />
                </button>
              </div>
            </div>

            {/* Recent Colors list */}
            {recentColors.length > 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <History className="size-3" /> Recent
                  </span>
                  <button
                    onClick={clearHistory}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    title="Clear History"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBaseColor(color)}
                      className="group relative size-8 rounded-full shadow-sm ring-1 ring-black/5 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {baseColor.toLowerCase() === color.toLowerCase() && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className={`size-4 drop-shadow-md ${['#ffffff', '#fff'].includes(color) ? 'text-black' : 'text-white'}`} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shades Display Section */}
      <div className="grid grid-cols-2 md:grid-cols-11 gap-4 px-2">
        {shades.map((shade, index) => {
          const isDark = parseInt(shade.name.toString()) >= 500;

          return (
            <div
              key={shade.name}
              className="group relative flex flex-col aspect-[2/3] md:aspect-[1/4] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5 ring-1 ring-black/5"
            >
              {/* Color Block */}
              <div
                className="flex-grow w-full relative"
                style={{ backgroundColor: shade.hex }}
              >
                {/* Overlay Interaction */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 backdrop-blur-[1px]">
                  <button
                    onClick={() => copyToClipboard(shade.hex)}
                    className="bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all mb-2"
                    title="Copy HEX"
                  >
                    {copiedCode === shade.hex ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Info Block */}
              <div className="glass-card p-3 flex flex-col items-center justify-center gap-1 bg-white/80">
                <span className="text-xs font-bold text-gray-400">{shade.name}</span>
                <span className="text-xs font-mono text-gray-600 uppercase">{shade.hex}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}