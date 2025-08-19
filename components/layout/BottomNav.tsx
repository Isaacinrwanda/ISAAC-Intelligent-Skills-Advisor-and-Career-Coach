
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, FileTextIcon, MicIcon, MapIcon, BriefcaseIcon } from '../Icons';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/resume', label: 'Resume', icon: FileTextIcon },
  { path: '/interview', label: 'Interview', icon: MicIcon },
  { path: '/career-path', label: 'Career Path', icon: MapIcon },
  { path: '/applications', label: 'Jobs', icon: BriefcaseIcon },
];

export const BottomNav = () => {
  const navLinkClasses = 'flex flex-col items-center justify-center w-full h-full text-muted-foreground';
  const activeLinkClasses = '!text-primary';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
