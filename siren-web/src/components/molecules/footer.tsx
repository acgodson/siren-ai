import React from "react";
import { Twitter, MessageSquareMore } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full  border-gray-200  border-t border-t-black">
      <div className="container mx-auto px-6">
        <div className="py-8 flex flex-col items-center">
          {/* Logo */}
          <img src="/vercel.png" alt="Siren Logo" className="h-8 mb-6" />

          {/* Social Links */}
          <div className="flex items-center gap-6 mb-6">
            <a
              href="https://x.com/Siren_watch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://discord.gg/Qqyq487Kc4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MessageSquareMore className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-red-600 to-gray-900"></div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Siren.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
