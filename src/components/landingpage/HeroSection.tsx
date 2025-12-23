import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function HeroSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-50 to-white bg-cover sm:bg-[url('/image/hero-background-mobile.webp')] lg:bg-[url('/image/hero-backdrop.webp')]">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.4 }}></div>
      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-20 text-left flex flex-col items-start justify-center"
        >
          {/* Beta Announcement */}
          <div className="flex items-center space-x-2 mb-2 bg-black text-white px-4 py-2 rounded-lg">
            {/* <span className="text-xs font-medium uppercase">New</span> */}
            <span className="text-sm">
              We are in Beta Now. Try our product now
            </span>
            <ArrowRight className="size-4" />
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl md:text-6xl">
                Safeguard Your Startup&rsquo;s Cyber Landscape
              </h1>
              <p className="text-lg text-slate-600">
                Nirāpadh: A solution to strengthen and protect your startup,
                enabling you to
                <span className="font-bold text-black">
                  {' '}
                  accelerate business performance{' '}
                </span>
                with confidence.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-md border-2 border-[#f15a22] bg-white px-10 py-3 text-base font-medium text-[#f15a22] transition-colors hover:bg-[#f15a22] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f15a22] focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
}

export default HeroSection;
