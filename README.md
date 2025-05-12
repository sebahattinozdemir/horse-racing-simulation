# Horse Racing Simulator

An interactive horse racing game built with Vue 3, TypeScript, and modern web technologies.

## Features

- Generate a random list of 1-20 horses with unique attributes
- Create race schedules with 6 rounds at different distances
- Animated horse movement during races
- Display race results as races conclude
- Responsive design for different screen sizes

## Tech Stack

- **Framework**: Vue 3 + Composition API
- **Type System**: TypeScript
- **State Management**: Pinia
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Testing**: Vitest (Unit) + Cypress (E2E)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. When the application loads, 20 random horses will be generated and displayed in the Horse List.
2. Click the "GENERATE PROGRAM" button to create a race schedule with 6 rounds.
3. Click "START / PAUSE" to begin the races. The races will run one round at a time.
4. Race results will appear in the Results section as each race concludes.
5. You can pause and resume the races at any time.

## Project Structure

```
src/
├── assets/         # Static assets and styles
├── components/     # Vue components
├── store/          # Pinia store modules
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.vue         # Main application component
└── main.ts         # Application entry point
```

## Testing

- Run unit tests: `npm run test`
- Run E2E tests: `npm run e2e`

## License

MIT 