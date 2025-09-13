import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Todo App",
  description: "Next.js + FastAPI Todo Challenge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <div className="container mx-auto max-w-2xl py-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
