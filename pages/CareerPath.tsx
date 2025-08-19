
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Spinner } from '../components/ui/Spinner';
import { generateCareerRoadmap } from '../services/geminiService';
import { CareerStep } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';

const CareerPath = () => {
    const [currentSkills, setCurrentSkills] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [roadmap, setRoadmap] = useLocalStorage<CareerStep[]>(LOCAL_STORAGE_KEYS.CAREER_PATH, []);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateRoadmap = async () => {
        setIsLoading(true);
        setRoadmap([]);
        const resultString = await generateCareerRoadmap(currentSkills, targetRole);
        try {
            const parsed = JSON.parse(resultString);
            if (parsed.roadmap && Array.isArray(parsed.roadmap)) {
                setRoadmap(parsed.roadmap);
            } else {
                // Handle case where JSON is valid but not in expected format
                console.error("Roadmap not found in response", parsed);
            }
        } catch (error) {
            console.error("Failed to parse roadmap:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Career Path Generator</h1>
                <p className="text-muted-foreground">Let ISAAC chart your course to professional success.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Define Your Goal</CardTitle>
                    <CardDescription>Enter your current skills and your desired role to generate a personalized roadmap.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="List your current skills (e.g., React, TypeScript, Node.js, Agile Methodologies)" 
                        value={currentSkills}
                        onChange={e => setCurrentSkills(e.target.value)}
                        rows={4}
                    />
                    <Input 
                        placeholder="Enter your target job role (e.g., AI/ML Engineer, Product Manager)"
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                    />
                    <Button onClick={handleGenerateRoadmap} disabled={isLoading || !currentSkills || !targetRole} className="w-full">
                        {isLoading ? <Spinner className="mr-2" /> : null}
                        {isLoading ? 'Generating...' : 'Generate Roadmap'}
                    </Button>
                </CardContent>
            </Card>

            {roadmap.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Roadmap to Becoming a {targetRole}</h2>
                    <div className="relative border-l-2 border-primary/20 pl-6 space-y-8">
                        {roadmap.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                                <p className="font-bold text-primary">Step {step.step}</p>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerPath;
