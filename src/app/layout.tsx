import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Evolução Fitness",
    template: "%s | Evolução Fitness",
  },
  description:
    "Acompanhamento privado e objetivo da evolução de peso para adultos.",
  applicationName: "Evolução Fitness",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Evolução Fitness",
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { color: "#f5f7fa", media: "(prefers-color-scheme: light)" },
    { color: "#07111f", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="flex min-h-full flex-col overflow-x-clip antialiased">
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo principal
        </a>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
