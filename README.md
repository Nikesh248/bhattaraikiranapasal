**# Bhatta**rai Kirana Pasal App (PasalPal)

This is a Next.js e-commerce application for Bhattarai Kirana Pasal, built using Firebase Studio.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables (Crucial for AI Features):**

    This application uses Google Generative AI for features like product recommendations and email generation. To enable these features, you need a Google AI API key.

    *   **Get an API Key:** Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.
    *   **Create `.env.local` file:** In the root directory of the project, create a file named `.env.local`.
    *   **Add the API Key:** Add the following line to your `.env.local` file, replacing `YOUR_API_KEY_HERE` with the key you obtained:
        ```
        GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
        ```
    *   **Admin Secret Key (Optional but Recommended):** For admin signup functionality, you can set a secret key. Add this line to `.env.local` (replace `"seller@seller"` with your desired secure key if needed, otherwise the default will be used):
        ```
        ADMIN_SECRET_KEY="secret"
        ```

    **Important:** Never commit your `.env.local` file to version control (it's typically included in `.gitignore`).

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js application, usually on `http://localhost:9002`.

4.  **(Optional) Run the Genkit development server:**
    If you are developing or debugging AI flows, run the Genkit server in a separate terminal:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit development UI, typically on `http://localhost:4000`.

## Project Structure

*   `src/app/`: Contains the main application routes using Next.js App Router.
*   `src/components/`: Reusable UI components (using ShadCN/UI).
*   `src/hooks/`: Custom React hooks (e.g., `useAuth`, `useCart`).
*   `src/lib/`: Utility functions and data fetching logic (e.g., `utils.ts`, `data.ts`).
*   `src/ai/`: Contains AI-related code using Genkit.
    *   `ai-instance.ts`: Initializes the Genkit instance and configures the AI model.
    *   `flows/`: Defines Genkit flows for specific AI tasks (e.g., recommendations, email generation).
*   `src/actions/`: Server Actions for form submissions and data mutations interacting with AI flows.
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets.

## Core Features

*   **Product Catalog:** Displays products with search functionality.
*   **Shopping Cart:** Allows users to add/remove items and manage quantities.
*   **Checkout Process:** Handles shipping address, payment selection (mocked), and order placement.
*   **User Authentication:** Basic login/signup functionality (mocked).
*   **Admin Section:** Separate login/signup/dashboard for administrators (mocked authentication).
*   **Product Recommendations (AI):** Suggests products based on user activity (requires API key).
*   **Order Confirmation Email (AI):** Generates and simulates sending order confirmation emails (requires API key).

## Styling

*   **Framework:** Tailwind CSS
*   **Component Library:** ShadCN/UI
*   **Theme:** Defined in `src/app/globals.css` using CSS variables.
    *   Primary: Earthy Green (`#388E3C`)
    *   Secondary: Light Beige (`#F5F5DC`)
    *   Accent: Golden Yellow (`#FFC107`)
*   **Icons:** Lucide React

## AI Integration (Genkit)

*   **Setup:** Requires a `GOOGLE_GENAI_API_KEY` in `.env.local`.
*   **Flows:** AI logic is encapsulated in Genkit flows within `src/ai/flows/`.
*   **Server Actions:** Client components interact with AI flows via Server Actions defined in `src/actions/`.
*   **Error Handling:** If the API key is missing or invalid, AI features will be disabled, and relevant error messages will be displayed in the UI and logged to the console.
