import React from 'react';
import { CompanyLogo1, CompanyLogo2, CompanyLogo3, CompanyLogo4, CompanyLogo5, CompanyLogo6 } from './icons/IconComponents';

const logos = [
  { name: 'Nexus Health', component: CompanyLogo1 },
  { name: 'Vitality Inc.', component: CompanyLogo2 },
  { name: 'Quantum Medical', component: CompanyLogo3 },
  { name: 'HealthChain', component: CompanyLogo4 },
  { name: 'Apex Bio', component: CompanyLogo5 },
  { name: 'Horizon Labs', component: CompanyLogo6 },
];

const LogoCloud: React.FC = () => {
  return (
    <>
      <div className="mt-16 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-infinite-scroll group-hover:paused">
          {logos.map((logo, index) => (
            <li key={index}>
              <logo.component className="h-10 w-auto text-medis-light-muted dark:text-medis-gray transition-colors duration-300 hover:text-medis-light-text dark:hover:text-medis-dark" />
            </li>
          ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_svg]:max-w-none animate-infinite-scroll group-hover:paused" aria-hidden="true">
          {logos.map((logo, index) => (
            <li key={index}>
              <logo.component className="h-10 w-auto text-medis-light-muted dark:text-medis-gray transition-colors duration-300 hover:text-medis-light-text dark:hover:text-medis-dark" />
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .group-hover\\:paused:hover .animate-infinite-scroll {
            animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

export default LogoCloud;