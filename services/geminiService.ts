
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ResumeData, InterviewTranscript } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A real app would have better error handling, maybe a state that shows an error message.
  // For this example, we throw an error at initialization if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContent = async (prompt: string, jsonResponse = false, schema?: any) => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: jsonResponse ? {
            responseMimeType: "application/json",
            responseSchema: schema,
        } : {}
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};


const resumeToText = (resumeData: ResumeData): string => {
    const { personalInfo, summary, experience, education, skills } = resumeData;
  
    const experienceText = experience.map(exp => 
      `Job Title: ${exp.jobTitle}\nCompany: ${exp.company}\nLocation: ${exp.location}\nDates: ${exp.startDate} - ${exp.endDate}\nDescription:\n${exp.description}`
    ).join('\n\n');
  
    const educationText = education.map(edu =>
      `Institution: ${edu.institution}\nDegree: ${edu.degree}, ${edu.fieldOfStudy}\nDates: ${edu.startDate} - ${edu.endDate}`
    ).join('\n\n');
  
    return `
  # RESUME
  
  ## Personal Information
  Name: ${personalInfo.name}
  Email: ${personalInfo.email}
  Phone: ${personalInfo.phone}
  LinkedIn: ${personalInfo.linkedin}
  Website: ${personalInfo.website}
  
  ## Professional Summary
  ${summary}
  
  ## Work Experience
  ${experienceText}
  
  ## Education
  ${educationText}
  
  ## Skills
  ${skills}
    `;
};


export const analyzeResume = async (resumeData: ResumeData): Promise<string> => {
    const resumeText = resumeToText(resumeData);
    const prompt = `You are an expert career coach named ISAAC. Analyze the following resume text and provide specific, actionable suggestions for improvement. Focus on clarity, impact, and keyword optimization for Applicant Tracking Systems (ATS). Structure your feedback in clear sections: Summary, Experience, Skills, and Overall Impression. Use markdown for formatting, including headings, bold text, and bullet points.
    
    Resume to analyze:
    ---
    ${resumeText}
    ---
    `;
    return generateContent(prompt);
};

export const generateInterviewQuestions = async (jobTitle: string, jobDescription: string): Promise<string> => {
    const prompt = `You are an expert interviewer. Generate 5 behavioral and 3 technical interview questions for a candidate applying for the role of '${jobTitle}'. The job description is: '${jobDescription}'.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: {
                            type: Type.STRING
                        }
                    },
                    required: ["question"]
                }
            }
        },
        required: ["questions"]
    };
    return generateContent(prompt, true, schema);
};

export const getInterviewFeedback = async (transcript: InterviewTranscript[]): Promise<string> => {
    const transcriptText = transcript.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n---\n\n');
    const prompt = `You are an expert career coach named ISAAC. The following is a transcript of a mock interview. Provide constructive feedback on the user's answers. Analyze them based on the STAR method (Situation, Task, Action, Result) where applicable. Give an overall summary and then specific feedback for each answer. Use markdown for formatting.
    
    Interview Transcript:
    ---
    ${transcriptText}
    ---
    `;
    return generateContent(prompt);
};

export const generateCareerRoadmap = async (currentSkills: string, targetRole: string): Promise<string> => {
    const prompt = `You are an expert career advisor named ISAAC. A user with skills in '${currentSkills}' wants to become a '${targetRole}'. Create a detailed, step-by-step career roadmap for them. Include technical skills to learn, soft skills to develop, recommended certifications, types of projects to build for a portfolio, and networking advice.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            roadmap: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        step: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["step", "title", "description"]
                }
            }
        },
        required: ["roadmap"]
    };
    return generateContent(prompt, true, schema);
};
