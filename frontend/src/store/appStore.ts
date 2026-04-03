import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: [string, string, string];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export type ActiveTab = 'resume' | 'coverLetter';

interface AppState {
  jobDescription: string;
  userProfile: UserProfile;
  resumeLatex: string;
  coverLetterLatex: string;
  currentView: 'dashboard' | 'builder';
  activeTab: ActiveTab;
  isGenerating: boolean;
  isStreaming: boolean;
  chatHistory: ChatMessage[];
  hasGenerated: boolean;
  currentPage: 'dashboard' | 'builder' | 'chat' | 'settings' | 'profile';
  setCurrentPage: (page: AppState['currentPage']) => void;

  setJobDescription: (desc: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  setResumeLatex: (latex: string) => void;
  setCoverLetterLatex: (latex: string) => void;
  setCurrentView: (view: 'dashboard' | 'builder') => void;
  appendResumeLatex: (chunk: string) => void;
  appendCoverLetterLatex: (chunk: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setIsGenerating: (val: boolean) => void;
  setIsStreaming: (val: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (content: string, isStreaming: boolean) => void;
  resetDocuments: () => void;
  setHasGenerated: (val: boolean) => void;
}

// Pre-filled with Preshak's details
const defaultProfile: UserProfile = {
  name: 'Preshak Bhattarai',
  email: 'preshak07@gmail.com',
  phone: '(920) 489-5575',
  linkedin: 'linkedin.com/in/preshak',
  github: 'github.com/preshak',
  skills: [
    'Python', 'Java', 'SQL', 'Bash',
    'Network Security', 'Threat Detection', 'Incident Response',
    'API Integration', 'AI/ML', 'React',
    'AWS', 'Google Cloud', 'Git', 'Linux',
    'Computer Vision', 'Deep Learning',
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'University of Wisconsin-Green Bay',
      role: 'Undergraduate Research Assistant',
      startDate: 'Feb 2026',
      endDate: 'Present',
      bullets: [
        'Investigating ML algorithms with biometric authentication systems to fortify identity verification against presentation attacks and deepfakes',
        'Developing deep learning models (CNNs) using Python and OpenCV to detect liveness and spoofing attempts, reducing False Acceptance Rates in security protocols',
        'Analyzing adversarial AI techniques to stress-test biometric standards and propose robust defense mechanisms for digital identity systems',
      ],
    },
    {
      id: 'exp-2',
      company: 'Spring Fall USA',
      role: 'Database Management Intern',
      startDate: 'Aug 2024',
      endDate: 'Dec 2025',
      bullets: [
        'Designed and maintained a secure database for international student records, including SEVIS and visa documentation',
        'Engineered Role-Based Access Controls (RBAC) to restrict unauthorized data exposure, mitigating insider threat risks for sensitive visa documentation',
        'Automated data validation pipelines using Python scripts, reducing manual verification time by 40% and eliminating human error in SEVIS record-keeping',
      ],
    },
    {
      id: 'exp-3',
      company: 'BKVM',
      role: 'Summer IT Intern',
      startDate: 'March 2024',
      endDate: 'May 2024',
      bullets: [
        'Administered IT security protocols for confidential student records and maintained academic SQL databases',
        'Maintained and troubleshot web infrastructure supporting campus operations',
        '',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'UW-Green Bay',
      degree: 'B.S. Computer Science - Cyber Security',
      year: 'Dec 2029',
    },
  ],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      jobDescription: '',
      userProfile: defaultProfile,
      resumeLatex: '',
      coverLetterLatex: '',
      currentView: 'dashboard',
      activeTab: 'resume',
      isGenerating: false,
      isStreaming: false,
      chatHistory: [],
      hasGenerated: false,
      currentPage: 'dashboard',

      setJobDescription: (desc) => set({ jobDescription: desc }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setResumeLatex: (latex) => set({ resumeLatex: latex }),
      setCoverLetterLatex: (latex) => set({ coverLetterLatex: latex }),
      appendResumeLatex: (chunk) =>
        set((state) => ({ resumeLatex: state.resumeLatex + chunk })),
      appendCoverLetterLatex: (chunk) =>
        set((state) => ({ coverLetterLatex: state.coverLetterLatex + chunk })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsGenerating: (val) => set({ isGenerating: val }),
      setIsStreaming: (val) => set({ isStreaming: val }),
      addChatMessage: (msg) =>
        set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
      updateLastAssistantMessage: (content, isStreaming) =>
        set((state) => {
          const history = [...state.chatHistory];
          const lastIdx = history.map((m) => m.role).lastIndexOf('assistant');
          if (lastIdx !== -1) {
            history[lastIdx] = { ...history[lastIdx], content, isStreaming };
          }
          return { chatHistory: history };
        }),
      resetDocuments: () =>
        set({ resumeLatex: '', coverLetterLatex: '', chatHistory: [] }),
      setHasGenerated: (val) => set({ hasGenerated: val }),
    }),
    {
      name: 'applyai-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        jobDescription: state.jobDescription,
      }),
    }
  )
);
