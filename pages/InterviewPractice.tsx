
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Spinner } from '../components/ui/Spinner';
import { generateInterviewQuestions, getInterviewFeedback } from '../services/geminiService';
import { InterviewQuestion, InterviewTranscript } from '../types';
import ReactMarkdown from 'react-markdown';

type InterviewState = 'setup' | 'in_progress' | 'feedback';

const InterviewPractice = () => {
  const [state, setState] = useState<InterviewState>('setup');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [transcript, setTranscript] = useState<InterviewTranscript[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = async () => {
    setIsLoading(true);
    const questionsString = await generateInterviewQuestions(jobTitle, jobDescription);
    try {
        const parsed = JSON.parse(questionsString);
        if (parsed.questions && Array.isArray(parsed.questions)) {
            setQuestions(parsed.questions);
            setState('in_progress');
        } else {
           console.error("Unexpected JSON structure:", parsed);
           setQuestions([{ question: "Could not parse questions. Please try again." }]);
        }
    } catch (e) {
        console.error("Failed to parse questions:", e);
        setQuestions([{ question: "Could not generate questions. Please try again." }]);
    }
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    const newTranscriptEntry = { question: questions[currentQuestionIndex].question, answer: currentAnswer };
    setTranscript(prev => [...prev, newTranscriptEntry]);
    setCurrentAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishInterview(newTranscriptEntry);
    }
  };

  const finishInterview = async (lastEntry?: InterviewTranscript) => {
    setIsLoading(true);
    setState('feedback');
    const finalTranscript = lastEntry ? [...transcript, lastEntry] : transcript;
    const feedbackResult = await getInterviewFeedback(finalTranscript);
    setFeedback(feedbackResult);
    setIsLoading(false);
  };
  
  const resetInterview = () => {
    setState('setup');
    setJobTitle('');
    setJobDescription('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setTranscript([]);
    setFeedback('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Interview Practice</h1>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Spinner className="w-12 h-12" />
            <p className="text-muted-foreground">ISAAC is thinking...</p>
        </div>
      )}

      {!isLoading && state === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Your Mock Interview</CardTitle>
            <CardDescription>Tell us about the role you're practicing for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Job Title (e.g., Senior Frontend Developer)" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
            <Textarea placeholder="Paste the job description here (optional, but recommended)" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={6} />
            <Button onClick={startInterview} disabled={!jobTitle} className="w-full">Start Interview</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && state === 'in_progress' && questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold">{questions[currentQuestionIndex].question}</p>
            <Textarea 
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              rows={8}
            />
            <div className="flex justify-between">
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish & Get Feedback' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && state === 'feedback' && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Feedback from ISAAC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
            <Button onClick={resetInterview} className="w-full">Start New Interview</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewPractice;
