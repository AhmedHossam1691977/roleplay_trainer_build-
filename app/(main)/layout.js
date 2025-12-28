import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../../components/sidebar.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          
          {/* Sidebar Component */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
            {/* lg:pl-64: Pushes content to the right to make room for the fixed sidebar on desktop.
               pt-24: Space for the mobile header.
            */}
            <main className="p-4 md:p-8 pt-24 lg:pt-8 w-full max-w-7xl mx-auto">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}