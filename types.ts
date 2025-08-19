
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  date: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
}

export interface CareerStep {
  step: number;
  title: string;
  description: string;
}

export interface InterviewQuestion {
  question: string;
}

export interface InterviewTranscript {
  question: string;
  answer: string;
}
