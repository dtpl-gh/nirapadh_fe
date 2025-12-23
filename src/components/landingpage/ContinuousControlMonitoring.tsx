import React from 'react';

interface ContinuousControlMonitoringProps {
  learnMoreUrl?: string;
}

const ContinuousControlMonitoring: React.FC<
  ContinuousControlMonitoringProps
> = ({ learnMoreUrl = '#' }) => {
  return (
    <div className="bg-[#1e3a69] text-white px-4 md:px-8 py-16 relative overflow-hidden">
      <h2 className="text-center text-4xl md:text-5xl font-semibold leading-snug mb-10">
        Elevate your cybersecurity journey <br /> every step of the way
      </h2>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 max-w-7xl mx-auto relative">
        <div className="w-full lg:w-1/2 max-w-xl">
          <h3 className="text-2xl md:text-3xl font-light text-[#7cb7c7] mb-4">
            Continuous Control Monitoring
          </h3>
          <p className="text-lg md:text-xl mb-6">
            Track digital assets for rapid risk assessment in near real-time
          </p>

          <ul className="space-y-4 md:space-y-5 mb-10">
            {[
              'Build a central controls repository',
              'Access a centralized asset inventory for actionable intelligence',
              'Get clear visibility into your security posture',
              'Manage controls across custom & compliance frameworks',
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-[#7cb7c7] rounded-full p-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-base md:text-lg">{text}</span>
              </li>
            ))}
          </ul>

          {/* <a 
            href={learnMoreUrl} 
            className="inline-flex items-center gap-2 border border-white px-6 py-3 rounded hover:bg-white/10 transition-colors"
          >
            <span>Learn more</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a> */}
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative max-w-sm w-full">
            <div className="bg-white rounded-lg shadow-lg p-5 w-full h-64 relative">
              <div className="text-black font-semibold mb-2">
                Controls Dashboard
              </div>
              <div className="text-gray-400 text-xs mb-4">Trends over time</div>

              <div className="flex justify-between items-end h-32 gap-2 mb-2">
                {[14, 10, 7, 15].map((height, index) => (
                  <div key={index} className="flex flex-col items-center w-1/4">
                    <div
                      className="bg-[#2a5e5a] w-full"
                      style={{ height: `${height}px` }}
                    ></div>
                    <div className="bg-[#5aaea6] w-full h-[10px]"></div>
                    <div className="bg-[#84d6ce] w-full h-[7px]"></div>
                  </div>
                ))}
              </div>

              <div className="absolute top-4 right-4 w-16 h-16 border-8 border-gray-300 rounded-full">
                <div className="absolute top-0 right-0 w-full h-full border-8 border-transparent border-t-[#6c7ae0] border-r-[#6c7ae0] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinuousControlMonitoring;
