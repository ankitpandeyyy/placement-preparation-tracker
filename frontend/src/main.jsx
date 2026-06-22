import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Helper to fetch current logged-in user's email or default to guest
const getUserEmail = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.email || 'guest';
  } catch (e) {
    return 'guest';
  }
};

const getCompaniesKey = (email) => `mock_companies_${email || getUserEmail()}`;
const getDsaKey = (email) => `mock_dsa_${email || getUserEmail()}`;

// Initialize mock data in localStorage for Demo Mode
const initMockData = (email) => {
  const userEmail = email || getUserEmail();
  const companiesKey = getCompaniesKey(userEmail);
  const dsaKey = getDsaKey(userEmail);

  if (!localStorage.getItem(companiesKey)) {
    localStorage.setItem(companiesKey, JSON.stringify([
      {
        _id: 'mock_co_1',
        name: 'HighRadius',
        role: 'Software Engineer',
        status: 'Interview',
        applicationDate: '2026-04-20',
        rounds: [
          { name: 'Aptitude', status: 'Cleared', date: '2026-04-22' },
          { name: 'Technical Interview', status: 'Pending', date: '2026-04-28' }
        ],
        notes: { questionsAsked: 'OOP concepts, React lifecycle', keyLearnings: 'Need to review system design' }
      },
      {
        _id: 'mock_co_2',
        name: 'Google',
        role: 'Frontend Developer',
        status: 'Applied',
        applicationDate: '2026-04-25',
        rounds: [],
        notes: {}
      },
      {
        _id: 'mock_co_3',
        name: 'Amazon',
        role: 'SDE 1',
        status: 'Rejected',
        applicationDate: '2026-04-10',
        rounds: [
          { name: 'Aptitude', status: 'Not Cleared', date: '2026-04-15' }
        ],
        notes: { mistakesMade: 'Missed edge cases in DP problem' }
      }
    ]));
  }
  if (!localStorage.getItem(dsaKey)) {
    localStorage.setItem(dsaKey, JSON.stringify([
      {
        _id: 'mock_dsa_1',
        name: 'Two Sum',
        difficulty: 'Easy',
        topic: 'Arrays',
        status: 'Solved',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}'
      },
      {
        _id: 'mock_dsa_2',
        name: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        topic: 'Strings',
        status: 'Attempted',
        description: 'Given a string s, return the longest palindromic substring in s.',
        code: 'function longestPalindrome(s) {\n  // TODO: implement expand around center\n  return "";\n}'
      },
      {
        _id: 'mock_dsa_3',
        name: 'Merge K Sorted Lists',
        difficulty: 'Hard',
        topic: 'Linked List',
        status: 'Unsolved',
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
        code: ''
      }
    ]));
  }
};

// Global Axios mock routing handler for Demo Mode (Vercel / serverless fallback)
const mockRequest = (config) => {
  const url = config.url;
  const method = config.method.toLowerCase();
  const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : null;

  // Extract email if logging in/registering, and initialize their database.
  let activeEmail = null;
  if (url.includes('/api/auth/login') || url.includes('/api/auth/register')) {
    activeEmail = data?.email || 'test@example.com';
    initMockData(activeEmail);
  } else {
    initMockData();
    activeEmail = getUserEmail();
  }

  console.warn(`[Demo Mode] Mocking API call: ${method.toUpperCase()} ${url}`, data);

  let responseData = null;

  // Auth routes
  if (url.includes('/api/auth/login')) {
    responseData = {
      _id: 'mock_user_' + Date.now(),
      username: data?.email ? data.email.split('@')[0] : 'testuser',
      email: data?.email || 'test@example.com',
      token: 'mock_jwt_token'
    };
  } else if (url.includes('/api/auth/register')) {
    responseData = {
      _id: 'mock_user_' + Date.now(),
      username: data?.username || 'testuser',
      email: data?.email || 'test@example.com',
      token: 'mock_jwt_token'
    };
  }
  // Companies routes
  else if (url.includes('/api/companies')) {
    const companiesKey = getCompaniesKey(activeEmail);
    let companies = JSON.parse(localStorage.getItem(companiesKey) || '[]');

    if (method === 'get') {
      responseData = companies;
    } else if (method === 'post') {
      // If adding a round: /api/companies/:id/rounds
      if (url.match(/\/api\/companies\/[^\/]+\/rounds/)) {
        const matches = url.match(/\/api\/companies\/([^\/]+)\/rounds/);
        const companyId = matches[1];
        companies = companies.map(c => {
          if (c._id === companyId) {
            return { ...c, rounds: [...(c.rounds || []), data] };
          }
          return c;
        });
        localStorage.setItem(companiesKey, JSON.stringify(companies));
        responseData = companies.find(c => c._id === companyId);
      } else {
        // Otherwise, creating a new company
        const newCompany = { ...data, _id: 'mock_co_' + Date.now(), rounds: [], notes: {} };
        companies.push(newCompany);
        localStorage.setItem(companiesKey, JSON.stringify(companies));
        responseData = newCompany;
      }
    } else if (method === 'put') {
      // If updating notes: /api/companies/:id/notes
      if (url.match(/\/api\/companies\/[^\/]+\/notes/)) {
        const matches = url.match(/\/api\/companies\/([^\/]+)\/notes/);
        const companyId = matches[1];
        companies = companies.map(c => {
          if (c._id === companyId) {
            return { ...c, notes: data };
          }
          return c;
        });
        localStorage.setItem(companiesKey, JSON.stringify(companies));
        responseData = companies.find(c => c._id === companyId);
      } else {
        // Otherwise, updating company basic info
        const matches = url.match(/\/api\/companies\/([^\/]+)/);
        const companyId = matches[1];
        companies = companies.map(c => {
          if (c._id === companyId) {
            return { ...c, ...data };
          }
          return c;
        });
        localStorage.setItem(companiesKey, JSON.stringify(companies));
        responseData = companies.find(c => c._id === companyId);
      }
    } else if (method === 'delete') {
      const matches = url.match(/\/api\/companies\/([^\/]+)/);
      const companyId = matches[1];
      companies = companies.filter(c => c._id !== companyId);
      localStorage.setItem(companiesKey, JSON.stringify(companies));
      responseData = { success: true };
    }
  }
  // DSA routes
  else if (url.includes('/api/dsa')) {
    const dsaKey = getDsaKey(activeEmail);
    let dsa = JSON.parse(localStorage.getItem(dsaKey) || '[]');

    if (method === 'get') {
      responseData = dsa;
    } else if (method === 'post') {
      const newDsa = { ...data, _id: 'mock_dsa_' + Date.now() };
      dsa.push(newDsa);
      localStorage.setItem(dsaKey, JSON.stringify(dsa));
      responseData = newDsa;
    } else if (method === 'put') {
      const matches = url.match(/\/api\/dsa\/([^\/]+)/);
      const dsaId = matches[1];
      dsa = dsa.map(d => {
        if (d._id === dsaId) {
          return { ...d, ...data };
        }
        return d;
      });
      localStorage.setItem(dsaKey, JSON.stringify(dsa));
      responseData = dsa.find(d => d._id === dsaId);
    } else if (method === 'delete') {
      const matches = url.match(/\/api\/dsa\/([^\/]+)/);
      const dsaId = matches[1];
      dsa = dsa.filter(d => d._id !== dsaId);
      localStorage.setItem(dsaKey, JSON.stringify(dsa));
      responseData = { success: true };
    }
  }
  // Dashboard stats route
  else if (url.includes('/api/dashboard/stats')) {
    const companiesKey = getCompaniesKey(activeEmail);
    const dsaKey = getDsaKey(activeEmail);
    const companies = JSON.parse(localStorage.getItem(companiesKey) || '[]');
    const dsa = JSON.parse(localStorage.getItem(dsaKey) || '[]');

    const totalApplications = companies.length;
    const inProgress = companies.filter(c => c.status === 'Interview' || c.status === 'Applied').length;
    const selected = companies.filter(c => c.status === 'Selected').length;
    const rejected = companies.filter(c => c.status === 'Rejected').length;

    const solved = dsa.filter(d => d.status === 'Solved').length;
    const totalDsa = dsa.length;

    // Upcoming Interviews (rounds that are pending)
    const upcomingInterviews = [];
    companies.forEach(company => {
      if (company.rounds) {
        company.rounds.forEach(round => {
          if (round.status === 'Pending') {
            upcomingInterviews.push({
              companyName: company.name,
              roundName: round.name,
              date: round.date || new Date().toISOString()
            });
          }
        });
      }
    });

    responseData = {
      companyStats: { totalApplications, inProgress, selected, rejected },
      dsaStats: { solved, total: totalDsa },
      upcomingInterviews,
      activityData: [
        { date: 'Mon', applications: 1 },
        { date: 'Tue', applications: 2 },
        { date: 'Wed', applications: 0 },
        { date: 'Thu', applications: 1 },
        { date: 'Fri', applications: 3 }
      ]
    };
  }

  return Promise.resolve({
    data: responseData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: config
  });
};

// 1. Request interceptor: If running in Vercel/production, bypass network request and run mockAdapter immediately.
axios.interceptors.request.use(
  config => {
    const isVercel = window.location.hostname !== 'localhost';
    if (isVercel) {
      config.adapter = async (cfg) => {
        return mockRequest(cfg);
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

// 2. Response interceptor: If running on localhost but server is offline, fall back to mockAdapter.
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    const isNetworkError = !error.response;
    const isVercel = window.location.hostname !== 'localhost';

    if ((isNetworkError || isVercel) && config) {
      return mockRequest(config);
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
