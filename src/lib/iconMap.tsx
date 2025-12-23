// // src/lib/iconMap.tsx
// import {
//   Home,
//   Users,
//   Folder,
//   CalendarCheck,
//   BookOpenCheck,
//   ScanBarcodeIcon,
//   Fingerprint,
//   ShieldAlert,
//   Radar,
//   EarthLock,
//   Factory,
//   Landmark,
// } from 'lucide-react';

// import { type ReactElement } from 'react';

// export const iconMap: Record<string, ReactElement> = {
//   Home: <Home className="h-4 w-4" />,
//   Users: <Users className="h-4 w-4" />,
//   Folder: <Folder className="h-4 w-4" />,
//   CalendarCheck: <CalendarCheck className="h-4 w-4" />,
//   BookOpenCheck: <BookOpenCheck className="h-4 w-4" />,
//   ScanBarcodeIcon: <ScanBarcodeIcon className="h-4 w-4" />,
//   Fingerprint: <Fingerprint className="h-4 w-4" />,
//   ShieldAlert: <ShieldAlert className="h-4 w-4" />,
//   Radar: <Radar className="h-4 w-4" />,
//   EarthLock: <EarthLock className="h-4 w-4" />,
//   Factory: <Factory className="h-4 w-4" />,
//   Landmark: <Landmark className="h-4 w-4" />,
// };

import {
  Home,
  Users,
  Folder,
  CalendarCheck,
  BookOpenCheck,
  ScanBarcodeIcon,
  Fingerprint,
  ShieldAlert,
  Radar,
  EarthLock,
  Factory,
  Landmark,
} from 'lucide-react';
import { ComponentType } from 'react';

export const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Home,
  Users,
  Folder,
  CalendarCheck,
  BookOpenCheck,
  ScanBarcodeIcon,
  Fingerprint,
  ShieldAlert,
  Radar,
  EarthLock,
  Factory,
  Landmark,
};
