import { Activity, Lock, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-semibold lg:text-5xl">
                Cybersecurity Made Simple for Startups
              </h2>
              <p className="mt-6">
                Startups are built on innovation and passion, but cyber threats
                can disrupt everything in an instant. Nirāpadh is designed to
                provide affordable, proactive, and comprehensive security,
                ensuring your business stays safe from cyber risks while you
                focus on growth.
              </p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <ShieldCheck className="size-5" />
                Employee Cyber Awareness
              </li>
              <li>
                <Zap className="size-5" />
                Incident Response & Recovery
              </li>
              <li>
                <Activity className="size-5" />
                Menitoring and analytics
              </li>
              <li>
                <Lock className="size-5" />
                Comprehensive Cybersecurity Protection
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/image/project.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/image/project.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
