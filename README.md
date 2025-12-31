# Modern ERP System

Modern, web-based ERP (Enterprise Resource Planning) system designed for SMEs. Built with **Next.js 14**, **Supabase**, and **Shadcn UI**.

## 🚀 Features

*   **Authentication**: Secure login, signup, and password recovery flows.
*   **Dashboard**: Real-time sales overview, recent transactions, and key metrics.
*   **Inventory Management**: Product tracking, stock status, and sorting capabilities.
*   **Sales & Finance**: Order processing, invoicing, and current account management.
*   **Responsive Design**: Mobile-friendly interface with collapsible sidebar and dark mode support.
*   **Premium UI**: Glassmorphism effects, toasted notifications, and smooth transitions.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State Management**: React Hooks & Server Actions

## 📦 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/erp-system.git
    cd erp-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📄 License

This project is licensed under the MIT License.
