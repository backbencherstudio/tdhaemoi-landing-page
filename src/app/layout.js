import { Pathway_Extreme, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

const pathwayExtreme = Pathway_Extreme({
  variable: "--font-pathway-extreme",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "FeetF1rst",
  description: "FeetF1rst",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="hardware-accelerated" content="true" />
      </head>
      <body
        className={`${pathwayExtreme.variable} ${josefinSans.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
