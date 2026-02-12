import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Palette, Copy, Check } from 'lucide-react';

export function ColorShadeGenerator() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    if (/^#[0-9A-F]{6}$/i.test(value) || value.length <= 7) {
      setBaseColor(value);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-8">
      {/* Input Form Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Palette className="size-5 md:size-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-base md:text-lg">Color Input</h2>
            <p className="text-xs md:text-sm text-gray-500">Enter your base color in HEX format</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hex-input">HEX Color Code</Label>
              <Input
                id="hex-input"
                type="text"
                placeholder="#3b82f6"
                value={baseColor}
                onChange={handleColorChange}
                className="font-mono"
                maxLength={7}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-picker">Color Picker</Label>
              <div className="relative">
                <Input
                  id="color-picker"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="h-10 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shades Display Section - Horizontal Stacked */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row h-screen md:h-96">
          {shades.map((shade, index) => {
            const isHovered = hoveredIndex === index;
            const isDark = parseInt(shade.name.toString()) >= 500;
            
            return (
              <div
                key={shade.name}
                className="relative flex-1 transition-all duration-300 ease-out cursor-pointer group"
                style={{ 
                  backgroundColor: shade.hex,
                  flex: isHovered ? '2' : '1'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hover Information Panel */}
                <div 
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className={`text-center space-y-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {/* Weight */}
                    <div className="text-3xl md:text-5xl font-bold tracking-tight">
                      {shade.name}
                    </div>
                    
                    {/* HEX Code */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 group/hex">
                        <span className="font-mono text-xs md:text-sm uppercase tracking-wide">
                          {shade.hex}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(shade.hex);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            isDark 
                              ? 'hover:bg-white/20' 
                              : 'hover:bg-black/10'
                          }`}
                          title="Copy HEX"
                        >
                          {copiedCode === shade.hex ? (
                            <Check className="size-3.5 md:size-4" />
                          ) : (
                            <Copy className="size-3.5 md:size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* RGB Code */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 group/rgb">
                        <span className="font-mono text-[10px] md:text-xs opacity-80">
                          RGB {shade.rgb}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`rgb(${shade.rgb})`);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            isDark 
                              ? 'hover:bg-white/20' 
                              : 'hover:bg-black/10'
                          }`}
                          title="Copy RGB"
                        >
                          {copiedCode === `rgb(${shade.rgb})` ? (
                            <Check className="size-3 md:size-3.5" />
                          ) : (
                            <Copy className="size-3 md:size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight indicator on bottom (always visible but subtle) */}
                <div 
                  className={`absolute bottom-4 md:bottom-4 left-1/2 md:left-1/2 md:-translate-x-1/2 -translate-x-1/2 transition-opacity duration-300 ${
                    isHovered ? 'opacity-0' : 'opacity-40 group-hover:opacity-60'
                  }`}
                >
                  <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {shade.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}