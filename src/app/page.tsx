'use client';

import { useEffect, useState } from 'react';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

import Framework from '../components/framework';
import ProcessNirapadh from '../components/Process';
import HeroSection from '../components/landingpage/HeroSection';
import Footer from '../components/landingpage/FooterSection';
import HeaderMenu from '../components/landingpage/HeaderMenu';
import ContinuousControlMonitoring from '../components/landingpage/ContinuousControlMonitoring';
import LogoCarousel from '@/components/landingpage/LogoCarousel';
import Pricing from '@/components/landingpage/Pricing';
import CallToAction from '@/components/landingpage/Calltoaction';
import FeaturesSection from '@/components/landingpage/FeatureSection';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const processControls = useAnimation();
  const { ref: processRef, inView: processInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (processInView) {
      processControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      });
    }
  }, [processInView, processControls]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <HeaderMenu isScrolled={isScrolled} />

      <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* HERO SECTION */}
        <HeroSection />
      </section>
      {/* <section>
        <ContinuousControlMonitoring />
      </section> */}
      <section className="bg-[#f1f5f9]">
        <FeaturesSection />
      </section>

      {/* Process Section */}
      <section id="process" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            ref={processRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={processControls}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-24">
              Our Process
            </h2>
            <div className="relative max-w-2xl mx-auto">
              <Framework />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Framework Section */}
      <section id="framework" className="bg-[#f1f5f9] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            ref={processRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={processControls}
            className="text-center mb-12"
          >
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-10 tracking-tight">
                Our Framework
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-[90%]">
                Nirāpadh delivers a seamless, end-to-end cybersecurity
                experience. We meticulously analyze every detail to fortify
                cyberspace, aligning with the proven NIST (National Institute of
                Standards and Technology) cybersecurity framework.
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <ProcessNirapadh />
            </div>
          </motion.div>
        </div>
      </section>
      <section>
        <LogoCarousel />
        <Pricing />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#f1f5f9] py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question:
                    'What should be the size of the Startup to subscribe to Nirāpadh?',
                  answer:
                    'Nirāpadh is for early-stage Startups. Even a solopreneur can subscribe to Nirāpadh.',
                },
                {
                  question:
                    'What is the cyber security readiness assessment? and why is it required?',
                  answer:
                    'This is a comprehensive assessment as per NIST’s Cyber Security Framework. A readiness score will be provided as a result, which will help in enabling the relevant security controls.',
                },
                {
                  question:
                    'What is the support provided as a part of Cyber Security Management?',
                  answer:
                    'We will assist with any security incident that poses a potential threat to the business operation. The security incident can be proactively identified or reported by the client.',
                },
                {
                  question:
                    'Is cyber security compliance mandatory for a Startup? If yes, will DriveIT assist with it?',
                  answer:
                    'It will depend on the industry regulation requirement the Startup is a part of. If necessary, we will assist in setting it up.',
                },
                {
                  question:
                    'Is cyber awareness security training mandatory for all roles/positions in a Startup?',
                  answer:
                    'Yes, all the employees including team leaders, developers, testers, managers CEO, CTO, CFO must attend the cyber security awareness training.',
                },
                {
                  question:
                    'For VAPT (Vulnerability Assessment and Penetration Testing), do I have to pay extra for the tools required run the tests/scans?',
                  answer:
                    'Yes, the price does not include the cost of any commercial tools used. Any third-party components / software will be charged additionally.',
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
