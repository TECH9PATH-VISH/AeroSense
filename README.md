# AeroSense — Real-Time Air Quality Intelligence Platform

A high-performance, dark-mode environmental dashboard built with React, Tailwind CSS, Lucide React icons, and Recharts.

## 🚀 Getting Started

To launch the development server locally:

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🛠 Features

- **Strict Dynamic Color System**: Ambient radial background glow, circular progress gauge, and typography dynamically adapt to the 6 EPA/WAQI AQI categories:
  - `0 - 50`: **Good** (Emerald Green)
  - `51 - 100`: **Moderate** (Amber Yellow)
  - `101 - 150`: **Unhealthy for Sensitive Groups** (Vibrant Orange)
  - `151 - 200`: **Unhealthy** (Crimson Red)
  - `201 - 300`: **Very Unhealthy** (Deep Purple)
  - `300+`: **Hazardous** (Dark Maroon)
- **Live WAQI API Integration**: Queries `https://api.waqi.info/feed/{city}/?token=demo` with resilient fallback intelligence if network or rate limits occur.
- **Circular Gauge Progress Ring**: Custom SVG dashboard ring showing the precise 0–500 scale with dynamic stroke glow.
- **Pollutant Concentration Grid**: Micro-cards for `PM2.5`, `PM10`, `NO2`, `SO2`, `O3`, and `CO` with WHO comparison benchmarks and status badges.
- **Contextual Health Matrix**: Real-time actionable guidance for masks (N95), window sealing, outdoor workouts, and vulnerable populations.
- **7-Day Historical Pollution Trend**: Recharts Area Chart with custom dark-glassmorphic tooltips and color gradients.
- **AI Air Quality Assistant**: Interactive floating drawer with contextual query handling and quick chips.

