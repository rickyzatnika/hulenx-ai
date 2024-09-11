import localFont from "next/font/local";
import "./globals.css";
import QueryClientProviders from "@/provider/QueryClientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import AuthProvider from "@/components/AuthProvider";
import { ChatListProvider } from "@/context/chatListContext";

const poppins = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});

export const metadata = {
  title: "Hulenx AI",
  description:
    "Tingkatkan kreativitas dan Inovasi dengan Artificial intelligence",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ToastContainer theme="dark" />
        <ChatListProvider>
          <AuthProvider session={session}>
            <QueryClientProviders>
              <Header />
              {children}
            </QueryClientProviders>
          </AuthProvider>
        </ChatListProvider>
      </body>
    </html>
  );
}
