import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

interface HeaderMenuProps {
  isScrolled: boolean;
}

export default function HeaderMenu({ isScrolled }: HeaderMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Secondary Header (Visible initially, fades on scroll) */}
      {/* <div
        className={`w-full bg-blue-500 text-white text-center  font-semibold fixed top-0 left-0 z-40 transition-all duration-300 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span>We are in Beta</span>
      </div> */}

      {/* Primary Header */}
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                alt="logo"
                src="/image/Niraapadh.png"
                width={150}
                height={150}
              // layout="intrinsic" removed as it is legacy behavior
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center justify-center">
            {/* <Link
              href="#features"
              className="text-blue-900 hover:text-blue-700 transition-colors"
            >
              Features
            </Link> */}
            <Link
              href="#process"
              className="text-blue-900 hover:text-blue-700 transition-colors"
            >
              Our Process
            </Link>
            <Link
              href="#framework"
              className="text-blue-900 hover:text-blue-700 transition-colors"
            >
              Our Framework
            </Link>

            <Link
              href="#faq"
              className="text-blue-900 hover:text-blue-700 transition-colors"
            >
              FAQs
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900"
              >
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-8 w-8 text-blue-900" />
            ) : (
              <Menu className="h-8 w-8 text-blue-900" />
            )}
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center text-center transition-all duration-300">
          <button
            className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-10 w-10" />
          </button>
          <nav className="flex flex-col space-y-6 text-2xl font-semibold">
            {/* <Link
              href="#features"
              className="text-blue-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link> */}
            <Link
              href="#process"
              className="text-blue-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Our Process
            </Link>
            <Link
              href="#framework"
              className="text-blue-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Our Framework
            </Link>
            <Link
              href="#faq"
              className="text-blue-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              FAQs
            </Link>
            <Link href="/auth" onClick={() => setMenuOpen(false)}>
              <Button
                size="lg"
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900"
              >
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
