import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#205366] text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between space-y-4 border-t border-gray-700 pt-4 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-400">
            ©2025 DriveIT Technologies. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link href="#" className="hover:text-white">
              Data Protection and Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
