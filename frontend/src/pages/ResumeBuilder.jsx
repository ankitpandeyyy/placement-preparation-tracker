import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Download, Upload, 
  Eye, FileText, Briefcase, GraduationCap, Code, 
  User, CheckCircle, RefreshCw, Star, Sparkles, ExternalLink,
  Target, AlertTriangle, Lightbulb, Check, ChevronRight,
  MessageSquare, Send, X, Settings, Bot, Loader2, Info
} from 'lucide-react';

// Default empty state
const emptyState = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    summary: ''
  },
  experience: [],
  education: [],
  projects: [],
  skills: []
};

// Demo data state
const demoState = {
  personalInfo: {
    fullName: 'Ankit Pandey',
    title: 'Software Engineer',
    email: 'ap1667130@gmail.com',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    website: 'ankitpandey.dev',
    github: 'github.com/ankitpandeyyy',
    linkedin: 'linkedin.com/in/ankitpandey',
    summary: 'Innovative and detail-oriented Software Engineer with hands-on experience in building modern web applications. Strong foundation in Data Structures, Algorithms, and clean code practices. Passionate about solving complex optimization problems and designing intuitive user-centric interfaces.'
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Digital Heroes',
      role: 'Full Stack Developer Intern',
      location: 'Remote',
      startDate: 'Jan 2025',
      endDate: 'Present',
      current: true,
      description: 'Developed and shipped user-focused React applications with high-fidelity Tailwind CSS layouts.\nOptimized client-side rendering performance, reducing home page bundle sizes and improving page speed by 25%.\nCollaborated in an agile team environment using Git/GitHub for version control and Vercel for continuous deployment.'
    },
    {
      id: 'exp-2',
      company: 'Tech Solutions Inc.',
      role: 'Frontend Developer',
      location: 'New Delhi, India',
      startDate: 'Jun 2024',
      endDate: 'Dec 2024',
      current: false,
      description: 'Built highly responsive, interactive analytics dashboards using React and Tailwind CSS.\nIntegrated RESTful APIs with Axios for real-time dashboard data synchronization, achieving sub-second UI updates.\nImplemented web accessibility guidelines (WCAG AA standards), increasing platform usability and reach by 15%.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Delhi Technological University',
      degree: 'Bachelor of Technology',
      major: 'Computer Science and Engineering',
      location: 'Delhi, India',
      graduationDate: 'May 2026',
      gpa: '8.9 / 10.0'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Placement Preparation Tracker',
      techStack: 'React, Node.js, Express, MongoDB, Tailwind CSS, Recharts',
      link: 'github.com/ankitpandeyyy/placement-tracker',
      description: 'Designed and engineered a full-stack dashboard to track DSA progress and job application pipelines.\nIntegrated an AI Interview Coach powered by the Google Gemini API to analyze voice and text mock responses.\nCreated interactive performance charts with Recharts to visualize problem-solving statistics and interview success rates.'
    },
    {
      id: 'proj-2',
      name: 'Ultimate Resume Builder',
      techStack: 'React, Tailwind CSS, Lucide Icons, Media Query Stylesheets',
      link: 'github.com/ankitpandeyyy/resume-builder',
      description: 'Developed a client-side resume builder featuring dual-panel editing and real-time document rendering.\nBuilt three styled templates (Modern Tech, Elegant Serif, Minimalist Chic) with instant layout switching.\nLeveraged native print-styles and media queries to offer zero-dependency, high-resolution vector PDF export.'
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages',
      list: 'JavaScript (ES6+), HTML5/CSS3, Python, C++, SQL'
    },
    {
      id: 'skill-2',
      category: 'Frameworks & Libraries',
      list: 'React.js, Node.js, Express.js, Tailwind CSS, Bootstrap'
    },
    {
      id: 'skill-3',
      category: 'Developer Tools',
      list: 'Git, GitHub, VS Code, Postman, MongoDB Compass, Vercel'
    }
  ]
};

// NLP Stop Words list for ATS keyword extraction
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 
  'weren', 'won', 'wouldn', 'using', 'experience', 'work', 'job', 'skills', 'role', 'team',
  'join', 'working', 'help', 'company', 'candidate', 'requirements', 'duties', 'responsibilities'
]);

// Weak/Passive action words mapping for ATS resume optimization
const WEAK_WORDS_MAP = {
  'managed': ['orchestrated', 'spearheaded', 'directed', 'coordinated'],
  'helped': ['collaborated', 'facilitated', 'supported'],
  'assisted': ['collaborated', 'expedited', 'partnered'],
  'worked': ['engineered', 'navigated', 'contributed', 'pioneered'],
  'did': ['executed', 'implemented', 'dispatched'],
  'responsible': ['accountable', 'spearheaded', 'pioneered'],
  'made': ['architected', 'crafted', 'generated', 'forged'],
  'created': ['authored', 'innovated', 'developed', 'established'],
  'handled': ['resolved', 'steered', 'administered'],
  'used': ['leveraged', 'deployed', 'utilized', 'harnessed']
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState(() => {
    // Load from local storage if available, otherwise load demo data so it's not empty
    const saved = localStorage.getItem('dh_trial_resume');
    return saved ? JSON.parse(saved) : demoState;
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [template, setTemplate] = useState('modern'); // 'modern', 'serif', 'minimal'
  const [strength, setStrength] = useState(0);
  const [checklist, setChecklist] = useState([]);
  const [forceSinglePage, setForceSinglePage] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState({ summary: false, skills: false });
  
  // ATS Specific States
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [weakWordsFound, setWeakWordsFound] = useState([]);
  const [atsAudit, setAtsAudit] = useState([]);
  
  // AI Feature States
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('dh_trial_gemini_key') || '';
  });
  const [groqKey, setGroqKey] = useState(() => {
    return localStorage.getItem('dh_trial_groq_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi Ankit! I'm PrepCoach AI, your interactive career assistant. Paste a target Job Description in the ATS tab to evaluate your match rate, or talk to me to optimize your resume bullet points. To activate full generative AI power, click the settings icon ⚙️ above and enter a free Gemini or Groq API Key!" 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Sync to local storage & calculate stats
  useEffect(() => {
    localStorage.setItem('dh_trial_resume', JSON.stringify(resume));
    calculateStrength();
    runAtsAnalysis();
  }, [resume, jobDescription]);

  const calculateStrength = () => {
    let score = 0;
    const items = [];
    const p = resume.personalInfo;

    // Contact checklist
    if (p.fullName) { score += 15; items.push({ text: 'Full Name filled', done: true }); }
    else { items.push({ text: 'Add your Full Name', done: false }); }

    if (p.email && p.phone) { score += 15; items.push({ text: 'Primary contact info complete', done: true }); }
    else { items.push({ text: 'Add both email and phone number', done: false }); }

    if (p.summary && p.summary.length > 50) { score += 15; items.push({ text: 'Detailed professional summary', done: true }); }
    else { items.push({ text: 'Write a summary (at least 50 chars)', done: false }); }

    // Sections check
    if (resume.experience.length > 0) { score += 20; items.push({ text: 'Work experience added', done: true }); }
    else { items.push({ text: 'Add at least one work experience entry', done: false }); }

    if (resume.education.length > 0) { score += 15; items.push({ text: 'Education details added', done: true }); }
    else { items.push({ text: 'Add at least one education entry', done: false }); }

    if (resume.projects.length > 0) { score += 10; items.push({ text: 'Projects added', done: true }); }
    else { items.push({ text: 'Add at least one key project', done: false }); }

    if (resume.skills.length >= 2) { score += 10; items.push({ text: 'Categorized skills (2+ categories)', done: true }); }
    else { items.push({ text: 'Add at least 2 skill categories', done: false }); }

    setStrength(score);
    setChecklist(items);
  };

  // Client-side NLP keyword & match rate analysis
  const runAtsAnalysis = () => {
    if (!jobDescription.trim()) {
      setAtsScore(0);
      setMatchedKeywords([]);
      setMissingKeywords([]);
      setWeakWordsFound([]);
      setAtsAudit([]);
      return;
    }

    // 1. Extract keywords from Job Description
    const jdWords = jobDescription.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
      .split(/\s+/);
    
    const frequencies = {};
    jdWords.forEach(w => {
      const trimmed = w.trim();
      if (trimmed.length > 2 && !STOP_WORDS.has(trimmed) && isNaN(trimmed)) {
        frequencies[trimmed] = (frequencies[trimmed] || 0) + 1;
      }
    });

    // Extract top 15 most frequent/relevant terms
    const keywords = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);

    // 2. Compile entire resume content corpus
    let corpus = ` ${resume.personalInfo.title} ${resume.personalInfo.summary}`;
    resume.experience.forEach(exp => {
      corpus += ` ${exp.company} ${exp.role} ${exp.location} ${exp.description}`;
    });
    resume.education.forEach(edu => {
      corpus += ` ${edu.school} ${edu.degree} ${edu.major}`;
    });
    resume.projects.forEach(proj => {
      corpus += ` ${proj.name} ${proj.techStack} ${proj.description}`;
    });
    resume.skills.forEach(skill => {
      corpus += ` ${skill.category} ${skill.list}`;
    });
    const lowerCorpus = corpus.toLowerCase();

    // 3. Compare keywords
    const matched = [];
    const missing = [];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lowerCorpus) || lowerCorpus.includes(kw)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    setMatchedKeywords(matched);
    setMissingKeywords(missing);

    // 4. Calculate Score
    const matchScore = keywords.length > 0 
      ? Math.round((matched.length / keywords.length) * 100) 
      : 0;
    setAtsScore(matchScore);

    // 5. Audit Weak/Passive Verbs in Resume
    const weakFound = [];
    Object.entries(WEAK_WORDS_MAP).forEach(([weak, suggestions]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'i');
      if (regex.test(lowerCorpus)) {
        weakFound.push({ weak, suggestions });
      }
    });
    setWeakWordsFound(weakFound);

    // 6. Formatting & Layout Audit Checks
    const audits = [];
    const wordCount = lowerCorpus.split(/\s+/).filter(w => w.length > 0).length;

    // Word length check
    if (wordCount > 600) {
      audits.push({ 
        title: 'Resume is too wordy', 
        desc: `Your resume has around ${wordCount} words. High-impact resumes keep it under 600 words for single-page compatibility.`, 
        type: 'warning' 
      });
    } else if (wordCount < 150) {
      audits.push({ 
        title: 'Thin content profile', 
        desc: 'Write more details in your experience and project sections to maximize match indexing.', 
        type: 'warning' 
      });
    } else {
      audits.push({ 
        title: 'Excellent word length', 
        desc: `Your resume is ${wordCount} words, which sits in the sweet spot for single-page layout scanning.`, 
        type: 'success' 
      });
    }

    // Contact info presence
    if (!resume.personalInfo.email || !resume.personalInfo.phone) {
      audits.push({ 
        title: 'Missing critical contact fields', 
        desc: 'Ensure both an email address and telephone number are filled so recruiting parsers can extract contact paths.', 
        type: 'error' 
      });
    } else {
      audits.push({ 
        title: 'Contact details verified', 
        desc: 'Email and phone fields are filled and accessible.', 
        type: 'success' 
      });
    }

    // Template warnings for legacy portfolios
    if (template === 'modern' && matchScore < 50) {
      audits.push({ 
        title: 'Multi-column template notice', 
        desc: 'Multi-column structures can sometimes confuse older ATS software. Consider switching to the single-column "Minimalist" template to maximize readability if applying to legacy portals.', 
        type: 'info' 
      });
    }

    setAtsAudit(audits);
  };

  // REST API Client Call to free Gemini-1.5-flash
  const queryGemini = async (prompt) => {
    if (!geminiKey) throw new Error('No API key provided.');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API error (Status: ${response.status})`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  // REST API Client Call to Groq Llama 3
  const queryGroq = async (prompt, systemInstruction = '') => {
    if (!groqKey) throw new Error('No Groq API key provided.');
    
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.2
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Groq API error (Status: ${response.status})`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Real-time AI Resume Tailoring (Generative vs. NLP Rule-based Fallback)
  const tailorResume = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a target Job Description first.');
      return;
    }

    setAiLoading(true);

    try {
      if (geminiKey || groqKey) {
        // Real Generative AI Mode
        const prompt = `You are a professional resume writer and recruitment system auditor. 
Here is a candidate's resume in JSON format:
${JSON.stringify(resume, null, 2)}

Here is the target job description:
${jobDescription}

Please optimize the resume JSON to match this job description. Strictly follow these constraints:
1. Keep the name, email, phone, location, and dates EXACTLY the same. Do not make up fake jobs, companies, or universities.
2. Rewrite the professional summary to specifically align with the key themes in the job description.
3. Tailor experience and project descriptions to emphasize accomplishments, metrics, and technologies mentioned in the JD.
4. Integrate missing skills naturally into the skills lists.
5. Return ONLY a valid JSON string starting with "{" and ending with "}" representing the modified resume. Do not include markdown codeblocks (like \`\`\`json), comments, or conversational text.`;

        let responseText = '';
        if (geminiKey) {
          responseText = await queryGemini(prompt);
        } else {
          responseText = await queryGroq(prompt);
        }

        let cleanedText = responseText.trim();
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText
            .replace(/^```json/, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();
        }

        const parsedResume = JSON.parse(cleanedText);
        if (parsedResume && parsedResume.personalInfo) {
          setResume(parsedResume);
          // Highlight modified sections for 3 seconds
          setHighlightedFields({ summary: true, skills: true });
          setTimeout(() => {
            setHighlightedFields({ summary: false, skills: false });
          }, 3000);
          alert(`Success! Your resume has been customized and tailored to this job description using ${geminiKey ? 'Google Gemini' : 'Groq Llama 3'} AI.`);
        } else {
          throw new Error('Parsed response does not match resume schema.');
        }
      } else {
        // Offline / Hybrid NLP Fallback Mode (Simulated AI)
        // Simulates latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Dynamic matching and insertion
        setResume(prev => {
          const tailored = JSON.parse(JSON.stringify(prev)); // Deep clone
          
          // Tailor summary
          const targetTerms = missingKeywords.slice(0, 3).join(', ');
          if (targetTerms) {
            tailored.personalInfo.summary = `Detail-oriented professional with specialized focus on ${targetTerms}. ` + tailored.personalInfo.summary;
          }

          // Inject missing keywords into skills
          if (missingKeywords.length > 0) {
            const injectedList = missingKeywords.slice(0, 5).join(', ');
            if (tailored.skills.length > 0) {
              tailored.skills[0].list = injectedList + ', ' + tailored.skills[0].list;
            } else {
              tailored.skills.push({
                id: 'skill-tailored',
                category: 'Key Competencies',
                list: injectedList
              });
            }
          }

          return tailored;
        });

        // Highlight modified sections for 3 seconds
        setHighlightedFields({ summary: true, skills: true });
        setTimeout(() => {
          setHighlightedFields({ summary: false, skills: false });
        }, 3000);

        alert('Resume updated locally! (Simulated Mode). Paste a free Gemini or Groq API Key in the chat toolkit settings to unlock advanced LLM-powered content rewrite capability.');
      }
    } catch (error) {
      console.error(error);
      alert(`AI Tailoring failed: ${error.message || 'Check your internet connection or API Key.'}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Chatbot send handler
  const sendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      if (geminiKey || groqKey) {
        // Real-time LLM chat mode
        const systemPrompt = `You are "PrepCoach AI", a helpful, professional career coach. 
The user's name is ${resume.personalInfo.fullName || 'Ankit'}. 
Here is their current resume JSON context:
${JSON.stringify(resume, null, 2)}

Provide specific, actionable advice on resume writing, portfolio building, and job interviewing. Keep responses concise, supportive, and formatted in markdown. If asked to write bullet points, ensure they start with strong action verbs.`;

        let aiResponse = '';
        if (geminiKey) {
          const promptText = `${systemPrompt}\n\nUser: ${userMsg}\nAssistant:`;
          aiResponse = await queryGemini(promptText);
        } else {
          aiResponse = await queryGroq(userMsg, systemPrompt);
        }
        setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        // Local Rule-based mock chatbot
        await new Promise(resolve => setTimeout(resolve, 800));
        let reply = "I'm in local offline mode. To chat dynamically, click the settings icon ⚙️ above and enter a free Google Gemini or Groq API Key. \n\nHere are some quick shortcuts you can ask me:\n1. Type **'verbs'** to see action verb suggestions.\n2. Type **'summary'** to see professional summary templates.\n3. Type **'dsa'** to get placement interview practice tips.";
        
        const lowerInput = userMsg.toLowerCase();
        if (lowerInput.includes('verb')) {
          reply = "Use strong action verbs to start your experience bullets. Avoid passive terms:\n- *Created* ➔ **Architected** or **Engineered**\n- *Managed* ➔ **Spearheaded** or **Orchestrated**\n- *Helped* ➔ **Collaborated** or **Facilitated**\n- *Used* ➔ **Leveraged** or **Deployed**";
        } else if (lowerInput.includes('summary')) {
          reply = "Here is a standard template for a summary:\n\n*\"Highly motivated [Professional Title] with a strong foundation in [Skill 1] and [Skill 2]. Experienced in building [types of applications] with clean code. Passionate about solving complex algorithms and contributing in collaborative development teams.\"*";
        } else if (lowerInput.includes('dsa') || lowerInput.includes('interview')) {
          reply = "Top placement interview preparation tips:\n1. **Mock Code**: Always speak out loud while writing algorithms. Explain time and space complexity ($O(N)$ or $O(1)$) before coding.\n2. **STAR Method**: Describe projects using **Situation, Task, Action, Result**.\n3. **Follow up**: Prepare 2 insightful questions to ask the interviewer.";
        }

        setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Chat error: ${err.message || 'API connection failed.'}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // State handlers for Personal Info
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  // State handlers for dynamic lists (experience, education, projects, skills)
  const addListItem = (type) => {
    const newItem = { id: `${type}-${Date.now()}` };
    if (type === 'experience') {
      newItem.company = '';
      newItem.role = '';
      newItem.location = '';
      newItem.startDate = '';
      newItem.endDate = '';
      newItem.current = false;
      newItem.description = '';
    } else if (type === 'education') {
      newItem.school = '';
      newItem.degree = '';
      newItem.major = '';
      newItem.location = '';
      newItem.graduationDate = '';
      newItem.gpa = '';
    } else if (type === 'projects') {
      newItem.name = '';
      newItem.techStack = '';
      newItem.link = '';
      newItem.description = '';
    } else if (type === 'skills') {
      newItem.category = '';
      newItem.list = '';
    }

    setResume(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const updateListItem = (type, index, field, value) => {
    setResume(prev => {
      const list = [...prev[type]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });
  };

  const deleteListItem = (type, index) => {
    setResume(prev => {
      const list = [...prev[type]];
      list.splice(index, 1);
      return { ...prev, [type]: list };
    });
  };

  const moveItem = (type, index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === resume[type].length - 1) return;

    setResume(prev => {
      const list = [...prev[type]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, [type]: list };
    });
  };

  // Load Demo Data
  const loadDemo = () => {
    if (window.confirm('This will overwrite current resume content with professional sample data. Proceed?')) {
      setResume(demoState);
      setActiveTab('personal');
    }
  };

  // Reset Form
  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear all contents? This cannot be undone.')) {
      setResume(emptyState);
      setActiveTab('personal');
    }
  };

  // Export JSON
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resume_${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'workspace'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const importJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.personalInfo) {
          setResume(parsed);
          alert('Resume workspace restored successfully!');
        } else {
          alert('Invalid file format. Please upload a valid resume workspace JSON file.');
        }
      } catch (err) {
        alert('Failed to parse file. Ensure it is a valid JSON file.');
      }
    };
    fileReader.readAsText(file);
  };

  const triggerPrint = () => {
    window.print();
  };

  // Helper: parse multiline strings into bullets
  const parseBullets = (text) => {
    if (!text) return [];
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col antialiased">
      {/* Stylesheet specifically for printing PDFs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide non-printable elements */
          .no-print, header, sidebar, nav, footer, button, .tabs, .editor-panel {
            display: none !important;
          }
          /* Reset page margins and main wrappers */
          body, html, #root, main, .app-layout {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Styles for printable paper sheet */
          .resume-sheet {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0.5in !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            overflow: visible !important;
            page-break-after: avoid;
            page-break-before: avoid;
          }
          .page-break-avoid {
            page-break-inside: avoid;
          }
        }
      `}} />

      {/* Trial Task Top Banner */}
      <div className="no-print bg-slate-900 border-b border-slate-800 text-white py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase animate-pulse">
            Trial Project
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Custom Software Developer — Trial Task</h1>
            <p className="text-xs text-slate-400">Unique Offline ATS Scanner & Live Gemini AI Coach. Perfect vector PDF generation.</p>
          </div>
        </div>
        
        {/* Creator reachable info */}
        <div className="flex items-center flex-wrap gap-4 justify-end">
          <div className="text-right text-xs">
            <span className="text-slate-400">Developer:</span> <strong className="text-slate-200">Ankit Pandey</strong>
            <span className="mx-2 text-slate-600">|</span>
            <span className="text-slate-400">Email:</span> <a href="mailto:ap1667130@gmail.com" className="text-blue-400 hover:underline">ap1667130@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-65px)]">
        
        {/* LEFT PANEL: Editor */}
        <div className="no-print w-full lg:w-1/2 flex flex-col bg-surface border-r border-border overflow-y-auto">
          {/* Quick Actions Panel */}
          <div className="p-4 border-b border-border bg-bg/50 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 animate-bounce" />
              <span className="font-semibold text-sm">Resume Toolkit</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={loadDemo}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1 transition-colors"
                title="Populate fields with sample data to test"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Load Demo
              </button>
              <button 
                onClick={resetForm}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/20 dark:hover:bg-red-950/45 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-center gap-1 transition-colors"
                title="Clear all fields"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
              <div className="h-6 w-px bg-border mx-1"></div>
              
              <button 
                onClick={exportJSON}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-bg border border-border text-text-muted hover:text-text flex items-center gap-1 transition-colors"
                title="Download current workspace state as JSON file"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              
              <label 
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-bg border border-border text-text-muted hover:text-text cursor-pointer flex items-center gap-1 transition-colors"
                title="Restore workspace from previously exported JSON file"
              >
                <Upload className="w-3.5 h-3.5" />
                Import
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importJSON} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Strength and Checklist Gauge */}
          <div className="p-4 border-b border-border bg-bg/25">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Profile Strength Score</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                strength > 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300' :
                strength > 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-emerald-300' :
                'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300'
              }`}>
                {strength}% {strength === 100 ? 'Complete!' : 'In Progress'}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  strength > 80 ? 'bg-emerald-500' :
                  strength > 50 ? 'bg-amber-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>

            {/* Micro Collapsible Tips */}
            <details className="text-xs text-text-muted group">
              <summary className="cursor-pointer select-none font-medium hover:text-text flex items-center gap-1">
                <span>View Recommendations Checklist</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 border-t border-border/50">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 py-0.5">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${item.done ? 'text-emerald-500' : 'text-border'}`} />
                    <span className={item.done ? 'line-through text-text-muted/60' : 'text-text'}>{item.text}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Form Navigation Tabs */}
          <div className="flex border-b border-border bg-bg/50 sticky top-0 z-10 shrink-0 overflow-x-auto scrollbar-none">
            {[
              { id: 'personal', name: 'Personal', icon: User },
              { id: 'experience', name: 'Experience', icon: Briefcase },
              { id: 'education', name: 'Education', icon: GraduationCap },
              { id: 'projects', name: 'Projects', icon: Code },
              { id: 'skills', name: 'Skills', icon: Star },
              { id: 'ats', name: 'ATS Optimizer', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              const isATS = tab.id === 'ats';
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[75px] py-3 px-1 border-b-2 font-semibold text-xs md:text-sm flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all relative shrink-0 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600 bg-blue-50/5' 
                      : 'border-transparent text-text-muted hover:text-text hover:bg-bg/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isATS ? 'text-orange-500 animate-pulse' : ''}`} />
                  <span>{tab.name}</span>
                  
                  {isATS && jobDescription.trim().length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Box */}
          <div className="p-6 flex-1">
            
            {/* 1. PERSONAL INFO TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-text mb-2 flex items-center gap-2 border-b border-border pb-1">
                  <User className="w-4 h-4 text-blue-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="e.g. Ankit Pandey"
                      value={resume.personalInfo.fullName}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Professional Title</label>
                    <input 
                      type="text" 
                      name="title"
                      placeholder="e.g. Full Stack Developer"
                      value={resume.personalInfo.title}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="e.g. ankit.dev@example.com"
                      value={resume.personalInfo.email}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      placeholder="e.g. +91 99999 88888"
                      value={resume.personalInfo.phone}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Location / City</label>
                    <input 
                      type="text" 
                      name="location"
                      placeholder="e.g. New Delhi, India"
                      value={resume.personalInfo.location}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Website URL</label>
                    <input 
                      type="text" 
                      name="website"
                      placeholder="e.g. ankitpandey.dev"
                      value={resume.personalInfo.website}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">GitHub Username / URL</label>
                    <input 
                      type="text" 
                      name="github"
                      placeholder="e.g. github.com/ankitpandeyyy"
                      value={resume.personalInfo.github}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">LinkedIn URL</label>
                    <input 
                      type="text" 
                      name="linkedin"
                      placeholder="e.g. linkedin.com/in/ankitpandey"
                      value={resume.personalInfo.linkedin}
                      onChange={handlePersonalChange}
                      className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Professional Bio / Summary</label>
                  <textarea 
                    name="summary"
                    rows={4}
                    placeholder="Brief summary describing your experience, core strengths, and goals..."
                    value={resume.personalInfo.summary}
                    onChange={handlePersonalChange}
                    className="w-full px-3.5 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors resize-y"
                  ></textarea>
                </div>
              </div>
            )}

            {/* 2. EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-1 mb-2">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    Work Experience
                  </h3>
                  <button 
                    onClick={() => addListItem('experience')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Job
                  </button>
                </div>

                {resume.experience.length === 0 ? (
                  <div className="text-center py-8 text-text-muted bg-bg/25 border border-dashed border-border rounded-lg">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-border" />
                    <p className="text-sm font-medium">No experience added yet</p>
                    <p className="text-xs mt-1">Click the button above to add work history details.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resume.experience.map((exp, idx) => (
                      <div key={exp.id} className="p-4 border border-border rounded-xl bg-bg/40 relative group">
                        
                        {/* Entry Order Controls & Delete */}
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button 
                            onClick={() => moveItem('experience', idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveItem('experience', idx, 'down')}
                            disabled={idx === resume.experience.length - 1}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteListItem('experience', idx)}
                            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-text-muted/65 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-20">
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Company / Organization</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              placeholder="e.g. Google"
                              onChange={(e) => updateListItem('experience', idx, 'company', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Job Role / Title</label>
                            <input 
                              type="text" 
                              value={exp.role}
                              placeholder="e.g. Software Engineer"
                              onChange={(e) => updateListItem('experience', idx, 'role', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Location</label>
                            <input 
                              type="text" 
                              value={exp.location}
                              placeholder="e.g. New York, NY (or Remote)"
                              onChange={(e) => updateListItem('experience', idx, 'location', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Start Date</label>
                              <input 
                                type="text" 
                                value={exp.startDate}
                                placeholder="e.g. June 2023"
                                onChange={(e) => updateListItem('experience', idx, 'startDate', e.target.value)}
                                className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">End Date</label>
                              <input 
                                type="text" 
                                value={exp.endDate}
                                placeholder="e.g. Present"
                                disabled={exp.current}
                                onChange={(e) => updateListItem('experience', idx, 'endDate', e.target.value)}
                                className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors disabled:opacity-40"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Current Checkbox */}
                        <div className="mt-3 flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`current-exp-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => {
                              updateListItem('experience', idx, 'current', e.target.checked);
                              if (e.target.checked) {
                                updateListItem('experience', idx, 'endDate', 'Present');
                              }
                            }}
                            className="rounded border-border text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <label htmlFor={`current-exp-${exp.id}`} className="text-xs font-semibold text-text-muted select-none">
                            I currently work here
                          </label>
                        </div>

                        <div className="mt-3">
                          <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider flex justify-between">
                            <span>Description & Achievements</span>
                            <span className="text-[10px] text-text-muted/65 font-normal normal-case">Enter details, one per line. They will render as bullets.</span>
                          </label>
                          <textarea 
                            rows={3}
                            value={exp.description}
                            placeholder="Collaborated with dev team to build...&#10;Spearheaded frontend optimization project...&#10;Fixed high-priority core bugs..."
                            onChange={(e) => updateListItem('experience', idx, 'description', e.target.value)}
                            className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors resize-y font-mono text-xs"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-1 mb-2">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    Education
                  </h3>
                  <button 
                    onClick={() => addListItem('education')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Education
                  </button>
                </div>

                {resume.education.length === 0 ? (
                  <div className="text-center py-8 text-text-muted bg-bg/25 border border-dashed border-border rounded-lg">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-border" />
                    <p className="text-sm font-medium">No education added yet</p>
                    <p className="text-xs mt-1">Click the button above to add educational backgrounds.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resume.education.map((edu, idx) => (
                      <div key={edu.id} className="p-4 border border-border rounded-xl bg-bg/40 relative">
                        
                        {/* Entry Order Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button 
                            onClick={() => moveItem('education', idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveItem('education', idx, 'down')}
                            disabled={idx === resume.education.length - 1}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteListItem('education', idx)}
                            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-text-muted/65 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-20">
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Institution / School</label>
                            <input 
                              type="text" 
                              value={edu.school}
                              placeholder="e.g. Stanford University"
                              onChange={(e) => updateListItem('education', idx, 'school', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Degree</label>
                            <input 
                              type="text" 
                              value={edu.degree}
                              placeholder="e.g. Bachelor of Science"
                              onChange={(e) => updateListItem('education', idx, 'degree', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Major / Field of Study</label>
                            <input 
                              type="text" 
                              value={edu.major}
                              placeholder="e.g. Computer Science"
                              onChange={(e) => updateListItem('education', idx, 'major', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Graduation Date</label>
                              <input 
                                type="text" 
                                value={edu.graduationDate}
                                placeholder="e.g. May 2025"
                                onChange={(e) => updateListItem('education', idx, 'graduationDate', e.target.value)}
                                className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">GPA / Marks</label>
                              <input 
                                type="text" 
                                value={edu.gpa}
                                placeholder="e.g. 3.8 / 4.0"
                                onChange={(e) => updateListItem('education', idx, 'gpa', e.target.value)}
                                className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Location / City</label>
                            <input 
                              type="text" 
                              value={edu.location}
                              placeholder="e.g. Stanford, CA"
                              onChange={(e) => updateListItem('education', idx, 'location', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-1 mb-2">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-500" />
                    Key Projects
                  </h3>
                  <button 
                    onClick={() => addListItem('projects')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                {resume.projects.length === 0 ? (
                  <div className="text-center py-8 text-text-muted bg-bg/25 border border-dashed border-border rounded-lg">
                    <Code className="w-8 h-8 mx-auto mb-2 text-border" />
                    <p className="text-sm font-medium">No projects added yet</p>
                    <p className="text-xs mt-1">Click the button above to add key development projects.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resume.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 border border-border rounded-xl bg-bg/40 relative">
                        
                        {/* Entry Order Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button 
                            onClick={() => moveItem('projects', idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveItem('projects', idx, 'down')}
                            disabled={idx === resume.projects.length - 1}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteListItem('projects', idx)}
                            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-text-muted/65 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-20">
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Project Name</label>
                            <input 
                              type="text" 
                              value={proj.name}
                              placeholder="e.g. E-Commerce Platform"
                              onChange={(e) => updateListItem('projects', idx, 'name', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Project Demo / Code Link</label>
                            <input 
                              type="text" 
                              value={proj.link}
                              placeholder="e.g. github.com/user/project"
                              onChange={(e) => updateListItem('projects', idx, 'link', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Tech Stack (comma separated)</label>
                            <input 
                              type="text" 
                              value={proj.techStack}
                              placeholder="e.g. React, Node.js, Express, MongoDB"
                              onChange={(e) => updateListItem('projects', idx, 'techStack', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider flex justify-between">
                            <span>Project Achievements & Description</span>
                            <span className="text-[10px] text-text-muted/65 font-normal normal-case">Enter details, one per line. They will render as bullets.</span>
                          </label>
                          <textarea 
                            rows={3}
                            value={proj.description}
                            placeholder="Architected database models for optimized performance...&#10;Integrated Stripe payment gateway securely...&#10;Refactored code to follow OOP design patterns..."
                            onChange={(e) => updateListItem('projects', idx, 'description', e.target.value)}
                            className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors resize-y font-mono text-xs"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-1 mb-2">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    Skills Inventory
                  </h3>
                  <button 
                    onClick={() => addListItem('skills')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Category
                  </button>
                </div>

                {resume.skills.length === 0 ? (
                  <div className="text-center py-8 text-text-muted bg-bg/25 border border-dashed border-border rounded-lg">
                    <Star className="w-8 h-8 mx-auto mb-2 text-border" />
                    <p className="text-sm font-medium">No skills added yet</p>
                    <p className="text-xs mt-1">Click the button above to add categories of skills.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resume.skills.map((skill, idx) => (
                      <div key={skill.id} className="p-4 border border-border rounded-xl bg-bg/40 relative">
                        
                        {/* Entry Order Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button 
                            onClick={() => moveItem('skills', idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveItem('skills', idx, 'down')}
                            disabled={idx === resume.skills.length - 1}
                            className="p-1.5 rounded hover:bg-bg text-text-muted hover:text-text disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteListItem('skills', idx)}
                            className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-text-muted/65 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mr-20">
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Skill Category Name</label>
                            <input 
                              type="text" 
                              value={skill.category}
                              placeholder="e.g. Backend Technologies, Languages, soft skills"
                              onChange={(e) => updateListItem('skills', idx, 'category', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-text-muted mb-1 uppercase tracking-wider">Skills List (comma-separated)</label>
                            <input 
                              type="text" 
                              value={skill.list}
                              placeholder="e.g. Node.js, Express, Django, PostgreSQL, GraphQL"
                              onChange={(e) => updateListItem('skills', idx, 'list', e.target.value)}
                              className="w-full px-3.5 py-1.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-blue-600 text-sm transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. ATS OPTIMIZER & AI TAILOR TAB */}
            {activeTab === 'ats' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-text mb-2 flex items-center gap-2 border-b border-border pb-1">
                  <Target className="w-5 h-5 text-orange-500 animate-pulse" />
                  ATS Scanner & AI Matcher
                </h3>

                <div className="bg-orange-500/10 border border-orange-500/35 p-4 rounded-xl">
                  <div className="flex gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-text-muted leading-relaxed">
                      <p>Most medium-to-large companies use **Applicant Tracking Systems (ATS)** to filter resumes. Paste your target Job Description below; we will extract the key competencies in real-time, compute a matching score, and show you exactly what words to add to pass the filter!</p>
                    </div>
                  </div>
                </div>

                {/* Job Description Input */}
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wider">Target Job Description</label>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-bg text-text focus:outline-none focus:border-orange-500 text-sm transition-colors font-mono text-xs"
                  ></textarea>
                </div>

                {/* Score, AI Tailor Button and Keywords Section */}
                {jobDescription.trim().length > 0 && (
                  <div className="space-y-6 border-t border-border pt-4">
                    
                    {/* Score Bar & AI Tailor CTA */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-border bg-bg/50 rounded-xl relative overflow-hidden">
                      <div className="text-center md:text-left">
                        <h4 className="text-sm font-bold text-text">Job Match Index</h4>
                        <p className="text-xs text-text-muted mt-0.5">Based on relevant keyword matching densities.</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg ${
                              atsScore > 75 ? 'border-emerald-500 text-emerald-500' :
                              atsScore > 40 ? 'border-amber-500 text-amber-500' :
                              'border-red-500 text-red-500'
                            }`}>
                              {atsScore}%
                            </div>
                          </div>
                        </div>

                        {/* Standout AI Auto-Tailor Button */}
                        <button
                          onClick={tailorResume}
                          disabled={aiLoading}
                          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                          {aiLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Tailoring Resume...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Auto-Tailor Resume with AI
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Keywords Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Target Keyword Coverage</h4>
                      <div className="flex flex-col gap-3">
                        {/* Matched list */}
                        <div>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Matched Keywords ({matchedKeywords.length})</span>
                          {matchedKeywords.length === 0 ? (
                            <span className="text-xs italic text-text-muted">None found yet.</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {matchedKeywords.map(kw => (
                                <span key={kw} className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Missing list */}
                        <div>
                          <span className="text-[11px] font-bold text-red-500 dark:text-red-400 block mb-1">Missing Critical Keywords ({missingKeywords.length})</span>
                          {missingKeywords.length === 0 ? (
                            <span className="text-xs italic text-emerald-600">Perfect! You matched all major keywords.</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {missingKeywords.map(kw => (
                                <span key={kw} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Passive/Weak Verbs Advisor */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Action Verb Advisor</h4>
                        <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded font-bold">Vocabulary Enhancer</span>
                      </div>

                      {weakWordsFound.length === 0 ? (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Excellent! Your resume uses high-impact action verbs.
                        </div>
                      ) : (
                        <div className="border border-border rounded-xl overflow-hidden text-xs">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-bg/70 border-b border-border text-left">
                                <th className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-text-muted">Weak Word Used</th>
                                <th className="p-2.5 font-bold text-[11px] uppercase tracking-wider text-text-muted">Stronger Alternatives</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {weakWordsFound.map(({ weak, suggestions }) => (
                                <tr key={weak} className="hover:bg-bg/25">
                                  <td className="p-2.5 font-bold text-red-500/90 dark:text-red-400 font-mono text-[11.5px]">{weak}</td>
                                  <td className="p-2.5">
                                    <div className="flex flex-wrap gap-1">
                                      {suggestions.map(s => (
                                        <span key={s} className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30 font-mono text-[10.5px]">
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Layout and Length Audit */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Layout & Format Audit</h4>
                      <div className="space-y-2">
                        {atsAudit.map((a, idx) => (
                          <div key={idx} className={`p-3.5 border rounded-xl flex gap-3 text-xs ${
                            a.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-800 dark:text-emerald-300' :
                            a.type === 'error' ? 'bg-red-500/5 border-red-500/25 text-red-800 dark:text-red-400' :
                            a.type === 'warning' ? 'bg-amber-500/5 border-amber-500/25 text-amber-800 dark:text-amber-300' :
                            'bg-blue-500/5 border-blue-500/25 text-blue-800 dark:text-blue-300'
                          }`}>
                            {a.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" /> :
                             a.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" /> :
                             a.type === 'warning' ? <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" /> :
                             <Lightbulb className="w-5 h-5 shrink-0 text-blue-500" />}
                            
                            <div>
                              <strong className="font-bold block">{a.title}</strong>
                              <span className="text-text-muted mt-0.5 block leading-relaxed">{a.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Document Canvas & Style Controls */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-100 dark:bg-slate-900/60 overflow-y-auto">
          {/* Header Controls for Preview Box */}
          <div className="no-print p-4 border-b border-border bg-bg/50 flex flex-wrap gap-4 justify-between items-center sticky top-0 z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-sm">Resume Preview</span>
            </div>

            {/* Template & Print Controls */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none bg-bg hover:bg-bg/85 border border-border px-3 py-1.5 rounded-lg text-text-muted hover:text-text">
                <input 
                  type="checkbox" 
                  checked={forceSinglePage}
                  onChange={(e) => setForceSinglePage(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-border"
                />
                Single Page Fit
              </label>

              <div className="flex bg-bg rounded-lg border border-border p-0.5">
                {[
                  { id: 'modern', name: 'Modern' },
                  { id: 'serif', name: 'Elegant' },
                  { id: 'minimal', name: 'Minimalist' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setTemplate(opt.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      template === opt.id 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>

              <button
                onClick={triggerPrint}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow transition-all hover:scale-105"
                title="Open system print dialog to save as PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Actual Printable Page Area */}
          <div className="flex-1 p-6 flex justify-center items-start">
            {forceSinglePage && (
              <style>{`
                .resume-sheet {
                  height: 297mm !important;
                  min-height: 297mm !important;
                  max-height: 297mm !important;
                  overflow: hidden !important;
                  padding: 1.5rem !important;
                }
                .resume-sheet h2 {
                  font-size: 1.5rem !important;
                }
                .resume-sheet h3 {
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.25rem !important;
                }
                .resume-sheet p, .resume-sheet li, .resume-sheet span, .resume-sheet a {
                  font-size: 10.5px !important;
                  line-height: 1.35 !important;
                  margin-bottom: 0.1rem !important;
                }
                .resume-sheet ul {
                  margin-top: 0.15rem !important;
                  margin-bottom: 0.15rem !important;
                }
                .resume-sheet .grid {
                  gap: 0.75rem !important;
                }
                .resume-sheet .space-y-6 > * + * {
                  margin-top: 0.5rem !important;
                }
                .resume-sheet .space-y-5 > * + * {
                  margin-top: 0.4rem !important;
                }
                .resume-sheet .space-y-4 > * + * {
                  margin-top: 0.3rem !important;
                }
                .resume-sheet .page-break-avoid {
                  page-break-inside: avoid !important;
                }
                @media print {
                  html, body {
                    height: 297mm !important;
                    overflow: hidden !important;
                  }
                  .resume-sheet {
                    border: none !important;
                    box-shadow: none !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: 1.5rem !important;
                    margin: 0 !important;
                  }
                }
              `}</style>
            )}
            
            {/* The A4 Canvas Sheet */}
            <div className={`resume-sheet w-full max-w-[8.27in] bg-white text-black p-8 md:p-12 shadow-xl border border-slate-200/60 rounded-sm font-sans min-h-[11.69in] transition-all text-[13px] leading-relaxed select-text`}>
              
              {/* STYLE 1: MODERN TECH */}
              {template === 'modern' && (
                <div className="space-y-6">
                  {/* Modern Header */}
                  <div className="-mx-8 -mt-8 md:-mx-12 md:-mt-12 p-8 bg-slate-800 text-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-t-sm">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{resume.personalInfo.fullName || 'Name Placeholder'}</h2>
                      <p className="text-sm font-semibold text-blue-400 mt-1 tracking-wider uppercase">{resume.personalInfo.title || 'Professional Title'}</p>
                    </div>
                    
                    <div className="text-left md:text-right text-xs space-y-1 text-slate-300">
                      {resume.personalInfo.email && (
                        <p>Email: <a href={`mailto:${resume.personalInfo.email}`} className="hover:text-white hover:underline">{resume.personalInfo.email}</a></p>
                      )}
                      {resume.personalInfo.phone && <p>Phone: {resume.personalInfo.phone}</p>}
                      {resume.personalInfo.location && <p>Location: {resume.personalInfo.location}</p>}
                      {resume.personalInfo.website && (
                        <p>Web: <a href={`https://${resume.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{resume.personalInfo.website}</a></p>
                      )}
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-start md:justify-end text-[11px] text-slate-400 mt-1">
                        {resume.personalInfo.github && (
                          <a href={`https://${resume.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{resume.personalInfo.github}</a>
                        )}
                        {resume.personalInfo.linkedin && (
                          <a href={`https://${resume.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{resume.personalInfo.linkedin}</a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Block */}
                  {resume.personalInfo.summary && (
                    <div className="page-break-avoid">
                      <p className={`text-slate-700 italic leading-relaxed text-[12.5px] border-l-4 pl-4 py-2.5 rounded-r transition-all duration-500 ${
                        highlightedFields.summary 
                          ? 'bg-amber-100 text-amber-950 font-bold scale-[1.01] shadow-md border-l-amber-500 ring-2 ring-amber-400' 
                          : 'bg-slate-50 border-l-blue-600'
                      }`}>
                        {resume.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {/* Two-Column Grid for Modern */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* Left Column (Narrow): Education & Skills */}
                    <div className="md:col-span-1 space-y-6">
                      
                      {/* Skills Section */}
                      {resume.skills.length > 0 && (
                        <div className={`space-y-3 page-break-avoid p-1.5 rounded transition-all duration-500 ${
                          highlightedFields.skills 
                            ? 'bg-amber-100 text-amber-950 scale-[1.02] shadow-md ring-2 ring-amber-400' 
                            : ''
                        }`}>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            Skills
                          </h3>
                          <div className="space-y-3">
                            {resume.skills.map((s) => (
                              <div key={s.id}>
                                <h4 className="text-[11.5px] font-bold text-slate-700">{s.category || 'Category'}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {s.list.split(',').map((skill, sIdx) => {
                                    const sk = skill.trim();
                                    if (!sk) return null;
                                    return (
                                      <span key={sIdx} className="bg-slate-100 text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200">
                                        {sk}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Section */}
                      {resume.education.length > 0 && (
                        <div className="space-y-3 page-break-avoid">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            Education
                          </h3>
                          <div className="space-y-4">
                            {resume.education.map((edu) => (
                              <div key={edu.id} className="space-y-1">
                                <h4 className="font-bold text-slate-800 text-[12px]">{edu.degree}</h4>
                                {edu.major && <p className="text-[11.5px] text-slate-700 font-medium">{edu.major}</p>}
                                <p className="text-[11px] text-slate-600">{edu.school}</p>
                                <div className="flex justify-between text-[10.5px] text-slate-500 font-medium">
                                  <span>{edu.graduationDate}</span>
                                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column (Wide): Experience & Projects */}
                    <div className="md:col-span-2 space-y-6">
                      
                      {/* Work Experience Section */}
                      {resume.experience.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            Work History
                          </h3>
                          <div className="space-y-5">
                            {resume.experience.map((exp) => (
                              <div key={exp.id} className="space-y-1.5 page-break-avoid">
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                                  <h4 className="font-bold text-slate-800 text-[13px]">{exp.role || 'Role'} <span className="text-slate-400 font-normal">at</span> {exp.company || 'Company'}</h4>
                                  <span className="text-[11px] text-slate-500 font-semibold mt-0.5 sm:mt-0">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-semibold">{exp.location}</p>
                                
                                {exp.description && (
                                  <ul className="list-disc pl-4 text-slate-700 space-y-1 text-[12px]">
                                    {parseBullets(exp.description).map((bullet, bIdx) => (
                                      <li key={bIdx}>{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects Section */}
                      {resume.projects.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-1 flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            Projects
                          </h3>
                          <div className="space-y-5">
                            {resume.projects.map((proj) => (
                              <div key={proj.id} className="space-y-1.5 page-break-avoid">
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                                  <h4 className="font-bold text-slate-800 text-[13px]">{proj.name || 'Project Name'}</h4>
                                  {proj.link && (
                                    <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline font-semibold mt-0.5 sm:mt-0">
                                      {proj.link}
                                    </a>
                                  )}
                                </div>
                                {proj.techStack && (
                                  <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">
                                    Tech Stack: {proj.techStack}
                                  </p>
                                )}
                                
                                {proj.description && (
                                  <ul className="list-disc pl-4 text-slate-700 space-y-1 text-[12px]">
                                    {parseBullets(proj.description).map((bullet, bIdx) => (
                                      <li key={bIdx}>{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STYLE 2: ELEGANT SERIF */}
              {template === 'serif' && (
                <div className="font-serif space-y-5">
                  {/* Serif Header */}
                  <div className="text-center pb-4 border-b border-slate-300">
                    <h2 className="text-3xl font-normal text-slate-900 tracking-wide">{resume.personalInfo.fullName || 'Name Placeholder'}</h2>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-1.5">{resume.personalInfo.title || 'Professional Title'}</p>
                    
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-slate-500 text-xs mt-3">
                      {resume.personalInfo.email && (
                        <span><a href={`mailto:${resume.personalInfo.email}`} className="hover:underline">{resume.personalInfo.email}</a></span>
                      )}
                      {resume.personalInfo.phone && <span>• {resume.personalInfo.phone}</span>}
                      {resume.personalInfo.location && <span>• {resume.personalInfo.location}</span>}
                      {resume.personalInfo.website && (
                        <span>• <a href={`https://${resume.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{resume.personalInfo.website}</a></span>
                      )}
                    </div>

                    <div className="flex justify-center gap-4 text-[10.5px] text-slate-400 mt-1">
                      {resume.personalInfo.github && (
                        <span>GitHub: <a href={`https://${resume.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{resume.personalInfo.github}</a></span>
                      )}
                      {resume.personalInfo.linkedin && (
                        <span>LinkedIn: <a href={`https://${resume.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{resume.personalInfo.linkedin}</a></span>
                      )}
                    </div>
                  </div>

                  {/* Summary Block */}
                  {resume.personalInfo.summary && (
                    <div className="page-break-avoid">
                      <p className={`text-slate-800 leading-relaxed text-[12.5px] text-center max-w-2xl mx-auto italic transition-all duration-500 p-1.5 rounded ${
                        highlightedFields.summary 
                          ? 'bg-amber-100 text-amber-950 font-bold scale-[1.01] shadow-md ring-2 ring-amber-400' 
                          : ''
                      }`}>
                        {resume.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience Section */}
                  {resume.experience.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5">
                        Professional Experience
                      </h3>
                      <div className="space-y-4">
                        {resume.experience.map((exp) => (
                          <div key={exp.id} className="space-y-1 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[13px] text-slate-900">{exp.company || 'Company'} <span className="font-normal italic text-slate-500">— {exp.role || 'Role'}</span></h4>
                              <span className="text-[11.5px] text-slate-600 font-semibold">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 italic">
                              <span>{exp.location}</span>
                            </div>
                            
                            {exp.description && (
                              <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[12px] leading-relaxed">
                                {parseBullets(exp.description).map((bullet, bIdx) => (
                                  <li key={bIdx} className="pl-1">{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {resume.projects.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5">
                        Selected Projects
                      </h3>
                      <div className="space-y-4">
                        {resume.projects.map((proj) => (
                          <div key={proj.id} className="space-y-1 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[13px] text-slate-900">{proj.name || 'Project Name'}</h4>
                              {proj.link && (
                                <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[11.5px] text-blue-800 hover:underline italic font-medium">
                                  {proj.link}
                                </a>
                              )}
                            </div>
                            {proj.techStack && (
                              <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-widest">
                                Technologies: {proj.techStack}
                              </p>
                            )}
                            
                            {proj.description && (
                              <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[12px] leading-relaxed">
                                {parseBullets(proj.description).map((bullet, bIdx) => (
                                  <li key={bIdx} className="pl-1">{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {resume.education.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-0.5">
                        Education History
                      </h3>
                      <div className="space-y-3">
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[13px] text-slate-900">{edu.school || 'School'}</h4>
                              <span className="text-[11.5px] text-slate-600 font-semibold">{edu.graduationDate}</span>
                            </div>
                            <div className="flex justify-between text-[11.5px] text-slate-700 italic">
                              <span>{edu.degree} in {edu.major} {edu.location && `— ${edu.location}`}</span>
                              {edu.gpa && <span className="not-italic text-[11px] text-slate-500 font-medium">GPA: {edu.gpa}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {resume.skills.length > 0 && (
                    <div className={`space-y-2.5 page-break-avoid p-1.5 rounded transition-all duration-500 ${
                      highlightedFields.skills 
                        ? 'bg-amber-100 text-amber-950 scale-[1.02] shadow-md ring-2 ring-amber-400' 
                        : ''
                    }`}>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-900 pb-0.5">
                        Skills Summary
                      </h3>
                      <div className="space-y-1.5">
                        {resume.skills.map((s) => (
                          <p key={s.id} className="text-[12px] text-slate-700 leading-relaxed">
                            <strong className="text-slate-950 font-bold">{s.category}:</strong> {s.list}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STYLE 3: MINIMALIST CHIC */}
              {template === 'minimal' && (
                <div className="space-y-5 font-sans text-slate-800">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900">{resume.personalInfo.fullName || 'Name Placeholder'}</h2>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{resume.personalInfo.title || 'Professional Title'}</p>
                    </div>

                    <div className="text-left sm:text-right text-[11.5px] space-y-0.5 text-slate-500 font-medium">
                      {resume.personalInfo.email && <p><a href={`mailto:${resume.personalInfo.email}`} className="hover:underline">{resume.personalInfo.email}</a></p>}
                      {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
                      {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
                      {resume.personalInfo.website && <p><a href={`https://${resume.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{resume.personalInfo.website}</a></p>}
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-end text-[10px] text-slate-400 font-normal">
                        {resume.personalInfo.github && <span>GitHub: {resume.personalInfo.github}</span>}
                        {resume.personalInfo.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Summary Block */}
                  {resume.personalInfo.summary && (
                    <div className="page-break-avoid">
                      <p className={`text-[12px] text-slate-600 leading-relaxed transition-all duration-500 p-1.5 rounded ${
                        highlightedFields.summary 
                          ? 'bg-amber-100 text-amber-950 font-bold scale-[1.01] shadow-md ring-2 ring-amber-400' 
                          : ''
                      }`}>
                        {resume.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5">
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {resume.experience.map((exp) => (
                          <div key={exp.id} className="space-y-1 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[12.5px] text-slate-900">{exp.role || 'Role'} <span className="font-normal text-slate-400">@</span> {exp.company || 'Company'}</h4>
                              <span className="text-[11px] text-slate-500 font-medium">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{exp.location}</p>
                            
                            {exp.description && (
                              <ul className="list-disc pl-4 text-slate-600 space-y-1 text-[11.5px]">
                                {parseBullets(exp.description).map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resume.projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5">
                        Projects
                      </h3>
                      <div className="space-y-4">
                        {resume.projects.map((proj) => (
                          <div key={proj.id} className="space-y-1 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[12.5px] text-slate-900">{proj.name || 'Project Name'}</h4>
                              {proj.link && (
                                <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline">
                                  {proj.link}
                                </a>
                              )}
                            </div>
                            {proj.techStack && (
                              <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-widest">
                                [{proj.techStack}]
                              </p>
                            )}
                            
                            {proj.description && (
                              <ul className="list-disc pl-4 text-slate-600 space-y-1 text-[11.5px]">
                                {parseBullets(proj.description).map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5 page-break-avoid">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-[12.5px] text-slate-900">{edu.school || 'School'}</h4>
                              <span className="text-[11px] text-slate-500 font-medium">{edu.graduationDate}</span>
                            </div>
                            <p className="text-[11.5px] text-slate-600">
                              {edu.degree} in {edu.major} {edu.location && `(${edu.location})`}
                              {edu.gpa && <span className="text-slate-400 font-medium ml-2">| GPA: {edu.gpa}</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {resume.skills.length > 0 && (
                    <div className={`space-y-3 page-break-avoid p-1.5 rounded transition-all duration-500 ${
                      highlightedFields.skills 
                        ? 'bg-amber-100 text-amber-950 scale-[1.02] shadow-md ring-2 ring-amber-400' 
                        : ''
                    }`}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-0.5">
                        Skills
                      </h3>
                      <div className="space-y-1.5">
                        {resume.skills.map((s) => (
                          <p key={s.id} className="text-[11.5px] text-slate-600">
                            <strong className="text-slate-900 font-semibold">{s.category}:</strong> {s.list}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* CHATBOT TRIGGER BUTTON */}
      <button 
        onClick={() => setIsChatOpen(prev => !prev)}
        className="no-print fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer z-50 group"
        title="Open Career Coach Chat"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 border-2 border-surface rounded-full"></span>
        )}
      </button>

      {/* CHAT WINDOW INTERFACE */}
      {isChatOpen && (
        <div className="no-print fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bot className="w-6 h-6 text-blue-400" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${(geminiKey || groqKey) ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">PrepCoach AI</h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  {geminiKey ? 'Powered by Google Gemini' : groqKey ? 'Powered by Groq Llama 3' : 'Offline Local Mode'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSettingsOpen(prev => !prev)}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isSettingsOpen ? 'bg-white/15' : ''}`}
                title="Toggle AI API Key Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Settings Sub-Panel */}
          {isSettingsOpen && (
            <div className="p-4 bg-slate-900 text-slate-200 border-b border-slate-800 shrink-0 text-xs space-y-3.5 max-h-[220px] overflow-y-auto">
              {/* Gemini API Key */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <strong className="font-bold flex items-center gap-1"><Settings className="w-3.5 h-3.5 text-blue-400" /> Gemini API Config</strong>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline flex items-center gap-0.5 font-semibold text-[10px]"
                  >
                    Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={geminiKey}
                    onChange={(e) => {
                      setGeminiKey(e.target.value);
                      localStorage.setItem('dh_trial_gemini_key', e.target.value);
                    }}
                    placeholder="Paste Gemini key here..."
                    className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-blue-600"
                  />
                  {geminiKey && (
                    <button 
                      onClick={() => {
                        setGeminiKey('');
                        localStorage.removeItem('dh_trial_gemini_key');
                      }}
                      className="px-2 bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 text-red-300 font-bold rounded-lg transition-colors text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Groq API Key */}
              <div className="space-y-1 border-t border-slate-800 pt-2">
                <div className="flex justify-between items-center">
                  <strong className="font-bold flex items-center gap-1"><Settings className="w-3.5 h-3.5 text-orange-400" /> Groq API Config</strong>
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-400 hover:underline flex items-center gap-0.5 font-semibold text-[10px]"
                  >
                    Get Groq Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={groqKey}
                    onChange={(e) => {
                      setGroqKey(e.target.value);
                      localStorage.setItem('dh_trial_groq_key', e.target.value);
                    }}
                    placeholder="Paste Groq API Key..."
                    className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-orange-500"
                  />
                  {groqKey && (
                    <button 
                      onClick={() => {
                        setGroqKey('');
                        localStorage.removeItem('dh_trial_groq_key');
                      }}
                      className="px-2 bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 text-red-300 font-bold rounded-lg transition-colors text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/20">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : 'bg-surface text-text border border-border rounded-bl-none shadow-sm whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-3 text-xs bg-surface border border-border rounded-bl-none flex items-center gap-1.5 text-text-muted shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  PrepCoach is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Quick Prompts list */}
          {!chatLoading && (
            <div className="px-4 py-2 bg-bg/40 border-t border-border flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {[
                { label: 'Suggest verbs', text: 'verbs' },
                { label: 'Summary templates', text: 'summary' },
                { label: 'Interview tips', text: 'dsa' }
              ].map(qp => (
                <button
                  key={qp.text}
                  onClick={() => {
                    setChatInput(qp.text);
                    // trigger send directly
                    setTimeout(() => sendChatMessage(), 50);
                  }}
                  className="bg-surface hover:bg-bg border border-border text-text-muted hover:text-text text-[10.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={sendChatMessage} className="p-3 border-t border-border bg-surface flex gap-2 shrink-0">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask PrepCoach anything..."
              className="flex-1 px-3.5 py-2 border border-border rounded-xl bg-bg text-text focus:outline-none focus:border-blue-600 text-xs transition-colors"
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim() || chatLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
