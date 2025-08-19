
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS, APPLICATION_STATUSES } from '../constants';
import { Application } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const Applications = () => {
    const [applications, setApplications] = useLocalStorage<Application[]>(LOCAL_STORAGE_KEYS.APPLICATIONS, []);
    const [newApplication, setNewApplication] = useState({ company: '', role: '' });

    const handleAddApplication = () => {
        if (!newApplication.company || !newApplication.role) return;
        const newApp: Application = {
            id: `app-${Date.now()}`,
            ...newApplication,
            date: new Date().toISOString().split('T')[0],
            status: 'Applied'
        };
        setApplications(prev => [newApp, ...prev]);
        setNewApplication({ company: '', role: '' });
    };

    const handleStatusChange = (id: string, newStatus: Application['status']) => {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };
    
    const handleDelete = (id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Job Application Tracker</h1>
                <p className="text-muted-foreground">Manage and track your job applications in one place.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Add New Application</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input 
                        placeholder="Company Name"
                        value={newApplication.company}
                        onChange={e => setNewApplication(p => ({ ...p, company: e.target.value }))}
                    />
                    <Input 
                        placeholder="Job Role"
                        value={newApplication.role}
                        onChange={e => setNewApplication(p => ({ ...p, role: e.target.value }))}
                    />
                    <Button onClick={handleAddApplication}>Add Application</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {APPLICATION_STATUSES.map(status => (
                    <div key={status} className="bg-muted/50 rounded-lg p-4">
                        <h2 className="font-bold text-lg mb-4">{status}</h2>
                        <div className="space-y-4">
                            {applications.filter(app => app.status === status).map(app => (
                                <Card key={app.id}>
                                    <CardContent className="p-4 space-y-2">
                                        <p className="font-semibold">{app.role}</p>
                                        <p className="text-sm text-muted-foreground">{app.company}</p>
                                        <p className="text-xs text-muted-foreground">Applied: {app.date}</p>
                                        <select 
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                                            className="w-full mt-2 p-1 border rounded text-xs"
                                        >
                                            {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => handleDelete(app.id)}>Delete</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Applications;
