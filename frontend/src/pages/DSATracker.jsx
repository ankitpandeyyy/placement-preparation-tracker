import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, ExternalLink, CheckCircle2, Circle, Edit2, Trash2, XCircle, Code, AlignLeft } from 'lucide-react';

export default function DSATracker() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  
  // Added description and code to the form state
  const [form, setForm] = useState({ name: '', difficulty: 'Easy', topic: '', link: '', status: 'Unsolved', description: '', code: '' });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dsa');
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching DSA problems', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProblem && currentProblem._id) {
        await axios.put(`http://localhost:5000/api/dsa/${currentProblem._id}`, form);
      } else {
        await axios.post('http://localhost:5000/api/dsa', form);
      }
      setIsModalOpen(false);
      setIsDetailsModalOpen(false);
      setCurrentProblem(null);
      fetchProblems();
    } catch (error) {
      console.error('Error saving problem', error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await axios.delete(`http://localhost:5000/api/dsa/${id}`);
        fetchProblems();
      } catch (error) {
        console.error('Error deleting problem', error);
      }
    }
  };

  const toggleStatus = async (problem, e) => {
    e.stopPropagation();
    const newStatus = problem.status === 'Solved' ? 'Unsolved' : 'Solved';
    try {
      await axios.put(`http://localhost:5000/api/dsa/${problem._id}`, { ...problem, status: newStatus });
      fetchProblems();
      
      // Update the current problem if details modal is open
      if (currentProblem && currentProblem._id === problem._id) {
        setCurrentProblem({ ...problem, status: newStatus });
        setForm({ ...form, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const openEdit = (problem, e) => {
    if (e) e.stopPropagation();
    setCurrentProblem(problem);
    setForm({
      name: problem.name,
      difficulty: problem.difficulty,
      topic: problem.topic,
      link: problem.link || '',
      status: problem.status,
      description: problem.description || '',
      code: problem.code || ''
    });
    setIsModalOpen(true);
  };

  const openDetails = (problem) => {
    setCurrentProblem(problem);
    setForm({
      name: problem.name,
      difficulty: problem.difficulty,
      topic: problem.topic,
      link: problem.link || '',
      status: problem.status,
      description: problem.description || '',
      code: problem.code || ''
    });
    setIsDetailsModalOpen(true);
  };

  const saveDetailsCode = async () => {
    try {
      await axios.put(`http://localhost:5000/api/dsa/${currentProblem._id}`, form);
      fetchProblems();
      alert('Progress saved!');
    } catch (error) {
      console.error('Error saving details', error);
    }
  };

  const topics = [...new Set(problems.map(p => p.topic))];

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'All' || p.topic === topicFilter;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-text-muted';
    }
  };

  const stats = {
    total: problems.length,
    solved: problems.filter(p => p.status === 'Solved').length,
    easy: problems.filter(p => p.difficulty === 'Easy' && p.status === 'Solved').length,
    medium: problems.filter(p => p.difficulty === 'Medium' && p.status === 'Solved').length,
    hard: problems.filter(p => p.difficulty === 'Hard' && p.status === 'Solved').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">DSA Practice Tracker</h1>
          <p className="text-sm text-text-muted mt-1">
            {stats.solved} / {stats.total} Solved • <span className="text-emerald-500">{stats.easy} Easy</span> • <span className="text-amber-500">{stats.medium} Medium</span> • <span className="text-rose-500">{stats.hard} Hard</span>
          </p>
        </div>
        <button 
          onClick={() => {
            setCurrentProblem(null);
            setForm({ name: '', difficulty: 'Easy', topic: '', link: '', status: 'Unsolved', description: '', code: '' });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <select 
              className="pl-10 pr-8 py-2 bg-bg border border-border rounded-lg text-text appearance-none focus:outline-none focus:border-primary transition-colors"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="relative hidden sm:block">
            <select 
              className="px-4 pr-8 py-2 bg-bg border border-border rounded-lg text-text appearance-none focus:outline-none focus:border-primary transition-colors"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Topics</option>
              {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-text-muted">Loading problems...</div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              No problems found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg/50 border-b border-border">
                    <th className="p-4 font-semibold text-text-muted text-sm w-12">Status</th>
                    <th className="p-4 font-semibold text-text-muted text-sm">Problem</th>
                    <th className="p-4 font-semibold text-text-muted text-sm">Topic</th>
                    <th className="p-4 font-semibold text-text-muted text-sm">Difficulty</th>
                    <th className="p-4 font-semibold text-text-muted text-sm w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProblems.map(problem => (
                    <tr 
                      key={problem._id} 
                      onClick={() => openDetails(problem)}
                      className={`hover:bg-bg/50 transition-colors cursor-pointer group ${problem.status === 'Solved' ? 'opacity-70' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <button onClick={(e) => toggleStatus(problem, e)} className="text-text-muted hover:text-primary transition-colors relative z-10">
                          {problem.status === 'Solved' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium group-hover:text-primary transition-colors ${problem.status === 'Solved' ? 'line-through text-text-muted' : 'text-text'}`}>
                            {problem.name}
                          </span>
                          {problem.link && (
                            <a href={problem.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-primary hover:text-primary-hover relative z-10">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-text-muted">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopicFilter(problem.topic);
                          }}
                          className="px-2.5 py-1 bg-bg border border-border rounded-md hover:border-primary hover:text-primary transition-colors relative z-10"
                        >
                          {problem.topic}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 relative z-10">
                          <button onClick={(e) => openEdit(problem, e)} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(problem._id); }} className="p-1.5 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-text">{currentProblem ? 'Edit Problem' : 'New Problem'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 shrink-1">
              <form id="problem-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Problem Name</label>
                  <input required type="text" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Difficulty</label>
                    <select className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                    <select className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="Unsolved">Unsolved</option>
                      <option value="Attempted">Attempted</option>
                      <option value="Solved">Solved</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Topic (e.g. Arrays, DP)</label>
                  <input required type="text" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} list="topic-list" />
                  <datalist id="topic-list">
                    {topics.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Link (Optional)</label>
                  <input type="url" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://leetcode.com/problems/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Description (Optional)</label>
                  <textarea rows="3" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Paste problem description here..." />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-muted hover:bg-bg rounded-lg transition-colors">Cancel</button>
              <button type="submit" form="problem-form" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Problem Details Full Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-bg z-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-text-muted hover:text-text transition-colors flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                <span className="font-medium hidden sm:inline">Back to list</span>
              </button>
              <div className="h-6 w-px bg-border mx-2"></div>
              <h2 className="text-xl font-bold text-text truncate max-w-sm sm:max-w-md">{form.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border hidden sm:block ${getDifficultyColor(form.difficulty)}`}>
                {form.difficulty}
              </span>
              <span className="px-2.5 py-0.5 bg-bg border border-border rounded-md text-xs text-text-muted hidden sm:block">
                {form.topic}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => toggleStatus(currentProblem, e)} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                  form.status === 'Solved' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-surface border-border text-text-muted hover:text-text'
                }`}
              >
                {form.status === 'Solved' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                <span className="text-sm font-medium">{form.status}</span>
              </button>
              {form.link && (
                <a href={form.link} target="_blank" rel="noopener noreferrer" className="p-2 text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-bg">
            {/* Description Panel */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-border bg-surface">
              <div className="p-4 border-b border-border bg-bg/50 shrink-0 flex items-center gap-2 text-text font-medium">
                <AlignLeft className="w-4 h-4 text-primary" />
                Problem Description
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {form.description ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-text leading-relaxed whitespace-pre-wrap">
                    {form.description}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-50">
                    <AlignLeft className="w-12 h-12 mb-2" />
                    <p>No description provided.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Code Panel */}
            <div className="flex-1 flex flex-col relative bg-[#1e1e1e] dark:bg-[#0d1117]">
              <div className="p-4 border-b border-[#333] dark:border-[#30363d] bg-[#252526] dark:bg-[#161b22] shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#cccccc] dark:text-[#c9d1d9] font-medium text-sm">
                  <Code className="w-4 h-4 text-[#4fc1ff] dark:text-[#58a6ff]" />
                  Your Solution
                </div>
                <button 
                  onClick={saveDetailsCode}
                  className="px-3 py-1 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded transition-colors"
                >
                  Save Code
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <textarea 
                  className="absolute inset-0 w-full h-full p-6 bg-transparent text-[#d4d4d4] dark:text-[#e6edf3] font-mono text-sm leading-relaxed outline-none resize-none"
                  value={form.code}
                  onChange={e => setForm({...form, code: e.target.value})}
                  spellCheck={false}
                  placeholder="// Write your solution here..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
