import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import { ToastProvider } from "@/services/toast/ToastContext";
import ToastBridge from "@/services/toast/ToastBridge";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins bg-black text-white`}
      >
        <AuthProvider>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />  <ToastProvider>
          <ToastBridge />
          {children}
        </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

