
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { Application, ResumeData } from '../types';
import { BriefcaseIcon, FileTextIcon, MicIcon, MapIcon } from '../components/Icons';

const Dashboard = () => {
  const [applications] = useLocalStorage<Application[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
  const [resumeData] = useLocalStorage<ResumeData | null>(LOCAL_STORAGE_KEYS.RESUME_DATA, null);
  
  const applicationCount = applications.length;
  const isResumeStarted = resumeData && (resumeData.personalInfo.name || resumeData.summary);

  const quickLinks = [
    { to: '/resume', icon: FileTextIcon, title: 'Resume Builder', description: 'Craft the perfect resume.' },
    { to: '/interview', icon: MicIcon, title: 'Interview Practice', description: 'Ace your next interview.' },
    { to: '/career-path', icon: MapIcon, title: 'Career Path', description: 'Plan your professional journey.' },
    { to: '/applications', icon: BriefcaseIcon, title: 'Job Applications', description: 'Track your opportunities.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome to ISAAC</h1>
        <p className="text-muted-foreground">Your Intelligent Skills Advisor and Career Coach.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p>Resume Status:</p>
              <p className={`font-semibold ${isResumeStarted ? 'text-green-600' : 'text-amber-600'}`}>
                {isResumeStarted ? 'In Progress' : 'Not Started'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>Applications Tracked:</p>
              <p className="font-semibold">{applicationCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Ready for your next step?</CardTitle>
            <CardDescription>Let's get you prepared for your dream job.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link to="/interview">
                <Button className="w-full">Start Interview Practice</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link to={link.to} key={link.to}>
              <Card className="hover:bg-accent transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <link.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
