// src/fonts/calsans.ts
import { Inter } from "next/font/google"; // CalSans is not directly in google, so use a similar font like Inter

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default inter;
