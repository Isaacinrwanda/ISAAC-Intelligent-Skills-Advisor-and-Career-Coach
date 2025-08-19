import React, { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { ResumeData, Experience, Education } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { analyzeResume } from '../services/geminiService';
import { exportResumeToPdf } from '../services/pdfService';
import { Spinner } from '../components/ui/Spinner';
import { Wand2Icon, DownloadIcon } from '../components/Icons';
import ReactMarkdown from 'react-markdown';

const initialResumeData: ResumeData = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: '',
};

const ResumeBuilder = () => {
    const [resumeData, setResumeData] = useLocalStorage<ResumeData>(LOCAL_STORAGE_KEYS.RESUME_DATA, initialResumeData);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const resumePreviewRef = useRef<HTMLDivElement>(null);

    const handleChange = <K extends keyof ResumeData>(section: K, field: keyof ResumeData[K], value: string) => {
        setResumeData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            }
        }));
    };

    const handleListItemChange = (
        list: 'experience' | 'education',
        index: number,
        field: string,
        value: string
    ) => {
        setResumeData(prev => {
            if (list === 'experience') {
                const newList = [...prev.experience];
                newList[index] = { ...newList[index], [field as keyof Experience]: value };
                return { ...prev, experience: newList };
            } else { // list === 'education'
                const newList = [...prev.education];
                newList[index] = { ...newList[index], [field as keyof Education]: value };
                return { ...prev, education: newList };
            }
        });
    };

    const addListItem = (list: 'experience' | 'education') => {
        const newItem = list === 'experience' 
            ? { id: `exp-${Date.now()}`, jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }
            : { id: `edu-${Date.now()}`, institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };
        setResumeData(prev => ({ ...prev, [list]: [...prev[list], newItem] }));
    };

    const removeListItem = (list: 'experience' | 'education', index: number) => {
        setResumeData(prev => {
            const newList = [...prev[list]];
            newList.splice(index, 1);
            return { ...prev, [list]: newList };
        });
    };
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis('');
        const result = await analyzeResume(resumeData);
        setAnalysis(result);
        setIsLoading(false);
    };

    const handleExport = () => {
      exportResumeToPdf('resume-preview', `${resumeData.personalInfo.name || 'resume'}-export`);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Resume Builder</h1>
                <Card>
                    <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => handleChange('personalInfo', 'name', e.target.value)} />
                        <Input placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} />
                        <Input placeholder="Phone" value={resumeData.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} />
                        <Input placeholder="LinkedIn Profile URL" value={resumeData.personalInfo.linkedin} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} />
                        <Input placeholder="Personal Website/Portfolio" value={resumeData.personalInfo.website} onChange={e => handleChange('personalInfo', 'website', e.target.value)} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea placeholder="Write a brief summary of your skills and experience." value={resumeData.summary} onChange={e => setResumeData(p => ({...p, summary: e.target.value}))} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border rounded-md space-y-2">
                                <Input placeholder="Job Title" value={exp.jobTitle} onChange={e => handleListItemChange('experience', index, 'jobTitle', e.target.value)} />
                                <Input placeholder="Company" value={exp.company} onChange={e => handleListItemChange('experience', index, 'company', e.target.value)} />
                                <Input placeholder="Location" value={exp.location} onChange={e => handleListItemChange('experience', index, 'location', e.target.value)} />
                                <div className="flex gap-2">
                                    <Input placeholder="Start Date" value={exp.startDate} onChange={e => handleListItemChange('experience', index, 'startDate', e.target.value)} />
                                    <Input placeholder="End Date" value={exp.endDate} onChange={e => handleListItemChange('experience', index, 'endDate', e.target.value)} />
                                </div>
                                <Textarea placeholder="Job Description & Achievements" value={exp.description} onChange={e => handleListItemChange('experience', index, 'description', e.target.value)} />
                                <Button variant="destructive" size="sm" onClick={() => removeListItem('experience', index)}>Remove</Button>
                            </div>
                        ))}
                        <Button onClick={() => addListItem('experience')}>Add Experience</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="p-4 border rounded-md space-y-2">
                                <Input placeholder="Institution" value={edu.institution} onChange={e => handleListItemChange('education', index, 'institution', e.target.value)} />
                                <Input placeholder="Degree" value={edu.degree} onChange={e => handleListItemChange('education', index, 'degree', e.target.value)} />
                                <Input placeholder="Field of Study" value={edu.fieldOfStudy} onChange={e => handleListItemChange('education', index, 'fieldOfStudy', e.target.value)} />
                                <div className="flex gap-2">
                                    <Input placeholder="Start Date" value={edu.startDate} onChange={e => handleListItemChange('education', index, 'startDate', e.target.value)} />
                                    <Input placeholder="End Date" value={edu.endDate} onChange={e => handleListItemChange('education', index, 'endDate', e.target.value)} />
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => removeListItem('education', index)}>Remove</Button>
                            </div>
                        ))}
                        <Button onClick={() => addListItem('education')}>Add Education</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea placeholder="List your skills, separated by commas." value={resumeData.skills} onChange={e => setResumeData(p => ({...p, skills: e.target.value}))} />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleAnalyze} disabled={isLoading} className="w-full flex-1">
                        {isLoading ? <Spinner className="mr-2" /> : <Wand2Icon className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Analyzing...' : 'Analyze with ISAAC'}
                    </Button>
                     <Button onClick={handleExport} variant="secondary" className="w-full flex-1">
                        <DownloadIcon className="mr-2 h-4 w-4" /> Export to PDF
                    </Button>
                </div>

                {analysis && (
                    <Card>
                        <CardHeader><CardTitle>ISAAC's Analysis</CardTitle></CardHeader>
                        <CardContent className="prose prose-sm max-w-none">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </CardContent>
                    </Card>
                )}
                
                <h2 className="text-2xl font-bold">Live Preview</h2>
                <div id="resume-preview" ref={resumePreviewRef} className="p-8 border rounded-md bg-white text-black shadow-lg">
                    {/* Live preview content */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold">{resumeData.personalInfo.name || 'Your Name'}</h1>
                        <p className="text-sm">
                            {resumeData.personalInfo.email} {resumeData.personalInfo.phone && `| ${resumeData.personalInfo.phone}`}
                        </p>
                        <p className="text-sm">
                            {resumeData.personalInfo.linkedin} {resumeData.personalInfo.website && `| ${resumeData.personalInfo.website}`}
                        </p>
                    </div>
                    {resumeData.summary && (
                        <div className="mb-4">
                            <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">Summary</h2>
                            <p className="text-sm">{resumeData.summary}</p>
                        </div>
                    )}
                    {resumeData.experience.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">Experience</h2>
                            {resumeData.experience.map(exp => (
                                <div key={exp.id} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-md">{exp.jobTitle}</h3>
                                        <p className="text-sm font-light">{exp.startDate} - {exp.endDate}</p>
                                    </div>
                                    <p className="text-sm italic">{exp.company}, {exp.location}</p>
                                    <p className="text-sm whitespace-pre-wrap mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {resumeData.education.length > 0 && (
                         <div className="mb-4">
                            <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">Education</h2>
                            {resumeData.education.map(edu => (
                                <div key={edu.id} className="mb-3">
                                     <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-md">{edu.institution}</h3>
                                        <p className="text-sm font-light">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                    <p className="text-sm italic">{edu.degree}, {edu.fieldOfStudy}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {resumeData.skills && (
                         <div>
                            <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">Skills</h2>
                            <p className="text-sm">{resumeData.skills}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;