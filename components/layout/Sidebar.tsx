
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, FileTextIcon, MicIcon, MapIcon, BriefcaseIcon } from '../Icons';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/resume', label: 'Resume Builder', icon: FileTextIcon },
  { path: '/interview', label: 'Interview Practice', icon: MicIcon },
  { path: '/career-path', label: 'Career Path', icon: MapIcon },
  { path: '/applications', label: 'Applications', icon: BriefcaseIcon },
];

export const Sidebar = () => {
  const navLinkClasses = 'flex items-center px-4 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground';
  const activeLinkClasses = 'bg-accent text-primary font-semibold';

  return (
    <aside className="hidden md:block w-64 border-r">
      <div className="p-4">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
