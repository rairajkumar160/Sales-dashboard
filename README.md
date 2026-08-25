# Executive Sales Dashboard

A modern, responsive, and high-performance Executive Sales Dashboard built using **React + Vite + TypeScript**, styled with custom **Glassmorphism Vanilla CSS**, and powered by **Supabase RPC**.

This application is designed to give executives and analysts immediate, real-time insights into orders, sales, discounts, net sales, and average order value (AOV), along with performance trends.

## 🚀 Features

- **Date Range Insights**: Change the calendar date picker at the top to dynamically pull and visualize sales data for that day from Supabase.
- **Real-Time KPIs**:
  - **Total Orders**: The number of successful transactions.
  - **Total Sales**: Gross revenue generated.
  - **Total Discount**: Sum of discounts applied.
  - **Net Sales**: Actual revenue generated (Gross Sales - Discounts).
  - **Average Order Value (AOV)**: Average value of each order (Net Sales / Total Orders).
- **Professional Analytics Visualization**: Dual-axis composed chart showing gross sales (Area chart with gradient fill) and order volume (Bar chart) hourly performance.
- **Breakdown Grid**: An interactive, responsive details breakdown table with custom hover states showing exact numbers.
- **Error & Loading States**: Clean skeletal layout screens during fetches and robust, user-friendly connection/error alerts with a retry action.
- **Adaptive Key Mapping**: The API client handles diverse naming schemas from the Supabase RPC response dynamically (e.g. `total_sales`, `gross_sales`, `aov`, `average_order_value`, etc.).

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Modern Vanilla CSS (with CSS variables, backdrop filters, CSS Grid)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

You need **Node.js** (v18.x or higher recommended) and **npm** installed on your machine.

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd "Sales Dashboard"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The application uses Vite environment variables to connect securely to your Supabase project.

1. Create a `.env` file in the root directory (you can copy `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and configure your credentials:
   ```env
   VITE_SUPABASE_URL=https://rkneulhdrozbzjufnowz.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
   *Note: Only the **publishable / anonymous** key should be stored here. Never use or expose your Supabase `service_role` or secret key.*

### Running the App

To start the development server:

```bash
npm run dev
```

The app will start running on: [http://localhost:5173/](http://localhost:5173/)

### Building for Production

To build a minified production bundle:

```bash
npm run build
```

This compiles TypeScript and assets into the `dist/` directory, ready to be deployed.
