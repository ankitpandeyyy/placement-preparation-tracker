import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, Edit2, Trash2, FileText, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  
  // Modal states
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);

  // Form states
  const [companyForm, setCompanyForm] = useState({ name: '', role: '', status: 'Applied', applicationDate: new Date().toISOString().split('T')[0] });
  const [roundForm, setRoundForm] = useState({ name: 'Aptitude', status: 'Pending', date: '' });
  const [notesForm, setNotesForm] = useState({ questionsAsked: '', mistakesMade: '', keyLearnings: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCompany && currentCompany._id) {
        await axios.put(`http://localhost:5000/api/companies/${currentCompany._id}`, companyForm);
      } else {
        await axios.post('http://localhost:5000/api/companies', companyForm);
      }
      setIsCompanyModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company', error);
    }
  };

  const handleDeleteCompany = async (id) => {
    if(window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`http://localhost:5000/api/companies/${id}`);
        if(selectedCompanyId === id) setSelectedCompanyId(null);
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company', error);
      }
    }
  };

  const handleRoundSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/companies/${currentCompany._id}/rounds`, roundForm);
      setIsRoundModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding round', error);
    }
  };

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/companies/${currentCompany._id}/notes`, notesForm);
      setIsNotesModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating notes', error);
    }
  };

  const openEditCompany = (company) => {
    setCurrentCompany(company);
    setCompanyForm({
      name: company.name,
      role: company.role,
      status: company.status,
      applicationDate: new Date(company.applicationDate).toISOString().split('T')[0]
    });
    setIsCompanyModalOpen(true);
  };

  const openAddRound = (company) => {
    setCurrentCompany(company);
    setRoundForm({ name: 'Aptitude', status: 'Pending', date: '' });
    setIsRoundModalOpen(true);
  };

  const openEditNotes = (company) => {
    setCurrentCompany(company);
    setNotesForm({
      questionsAsked: company.notes?.questionsAsked || '',
      mistakesMade: company.notes?.mistakesMade || '',
      keyLearnings: company.notes?.keyLearnings || ''
    });
    setIsNotesModalOpen(true);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || company.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Rejected': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      case 'Interview': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
    }
  };

  const selectedCompany = companies.find(c => c._id === selectedCompanyId);

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Applications Tracker</h1>
          <p className="text-sm text-text-muted mt-1">Manage your job applications and interview rounds.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentCompany(null);
            setCompanyForm({ name: '', role: '', status: 'Applied', applicationDate: new Date().toISOString().split('T')[0] });
            setIsCompanyModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Application
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <select 
            className="pl-10 pr-8 py-2 bg-bg border border-border rounded-lg text-text appearance-none focus:outline-none focus:border-primary transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-text-muted">Loading applications...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-surface rounded-xl border border-border">
              <div className="w-16 h-16 bg-bg border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text mb-1">No applications found</h3>
              <p className="text-text-muted">Adjust your filters or add a new application to get started.</p>
            </div>
          ) : (
            filteredCompanies.map(company => (
              <div 
                key={company._id} 
                className="bg-surface border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full"
                onClick={() => setSelectedCompanyId(company._id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{company.name}</h3>
                    <p className="text-sm font-medium text-text-muted mt-0.5 line-clamp-1">{company.role}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </div>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-text-muted bg-bg px-3 py-2 rounded-lg border border-border/50">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    Applied: {new Date(company.applicationDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <div className="text-xs font-medium text-text-muted flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        {company.rounds?.slice(0,3).map((r,i) => (
                          <div key={i} className={`w-5 h-5 rounded-full border border-surface flex items-center justify-center ${r.status === 'Cleared' ? 'bg-emerald-500' : r.status === 'Not Cleared' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                        ))}
                      </div>
                      {company.rounds?.length} Rounds
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Side Drawer for Details */}
      {selectedCompany && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedCompanyId(null)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-bg shadow-2xl border-l border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-text mb-1">{selectedCompany.name}</h2>
                  <div className="text-text-muted font-medium">{selectedCompany.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditCompany(selectedCompany); }}
                    className="p-2 text-text-muted hover:text-primary bg-bg rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCompany(selectedCompany._id); }}
                    className="p-2 text-text-muted hover:text-rose-500 bg-bg rounded-lg border border-border hover:border-rose-500/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelectedCompanyId(null)} className="p-2 text-text-muted hover:text-text bg-bg rounded-lg border border-border hover:border-text-muted transition-colors ml-2">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-sm font-semibold border ${getStatusColor(selectedCompany.status)}`}>
                  Status: {selectedCompany.status}
                </span>
                <span className="px-3 py-1 bg-bg border border-border rounded-md text-sm text-text-muted font-medium">
                  Applied: {new Date(selectedCompany.applicationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Interview Rounds */}
              <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-text flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    Interview Rounds
                  </h4>
                  <button 
                    onClick={() => openAddRound(selectedCompany)}
                    className="text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                
                {selectedCompany.rounds && selectedCompany.rounds.length > 0 ? (
                  <div className="relative border-l-2 border-border ml-3 space-y-6">
                    {selectedCompany.rounds.map((round, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-surface flex items-center justify-center
                          ${round.status === 'Cleared' ? 'bg-emerald-500' : round.status === 'Not Cleared' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                        </div>
                        <div className="bg-bg p-4 rounded-lg border border-border hover:border-primary/30 transition-colors shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-text">{round.name}</h5>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusColor(round.status === 'Cleared' ? 'Selected' : round.status === 'Not Cleared' ? 'Rejected' : 'Interview')}`}>
                              {round.status}
                            </span>
                          </div>
                          {round.date && <div className="text-sm text-text-muted font-medium">{new Date(round.date).toLocaleDateString()}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-bg rounded-lg border border-dashed border-border">
                    <CalendarIcon className="w-8 h-8 text-border mx-auto mb-2" />
                    <p className="text-text-muted font-medium">No rounds tracked yet.</p>
                  </div>
                )}
              </div>

              {/* Interview Notes */}
              <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-text flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Interview Notes
                  </h4>
                  <button 
                    onClick={() => openEditNotes(selectedCompany)}
                    className="text-sm bg-bg border border-border hover:border-primary hover:text-primary text-text-muted px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-bg p-4 rounded-lg border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Questions Asked</h5>
                    <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{selectedCompany.notes?.questionsAsked || <span className="text-text-muted/60 italic">No questions recorded.</span>}</p>
                  </div>
                  
                  <div className="bg-bg p-4 rounded-lg border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <h5 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Mistakes Made</h5>
                    <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{selectedCompany.notes?.mistakesMade || <span className="text-text-muted/60 italic">No mistakes recorded.</span>}</p>
                  </div>
                  
                  <div className="bg-bg p-4 rounded-lg border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Key Learnings</h5>
                    <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{selectedCompany.notes?.keyLearnings || <span className="text-text-muted/60 italic">No learnings recorded.</span>}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Company Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-text">{currentCompany ? 'Edit Application' : 'New Application'}</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-text-muted hover:text-text">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCompanySubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company Name</label>
                <input required type="text" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
                <input required type="text" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={companyForm.role} onChange={e => setCompanyForm({...companyForm, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                <select className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={companyForm.status} onChange={e => setCompanyForm({...companyForm, status: e.target.value})}>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Application Date</label>
                <input type="date" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={companyForm.applicationDate} onChange={e => setCompanyForm({...companyForm, applicationDate: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsCompanyModalOpen(false)} className="px-4 py-2 text-text-muted hover:bg-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Round Modal */}
      {isRoundModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-surface w-full max-w-sm rounded-xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-text">Add Interview Round</h3>
              <button onClick={() => setIsRoundModalOpen(false)} className="text-text-muted hover:text-text">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRoundSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Round Type</label>
                <select className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={roundForm.name} onChange={e => setRoundForm({...roundForm, name: e.target.value})}>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Communication Round">Communication Round</option>
                  <option value="DSA Round">DSA Round</option>
                  <option value="Group Discussion">Group Discussion</option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                <select className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={roundForm.status} onChange={e => setRoundForm({...roundForm, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Not Cleared">Not Cleared</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Date (Optional)</label>
                <input type="date" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none" value={roundForm.date} onChange={e => setRoundForm({...roundForm, date: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsRoundModalOpen(false)} className="px-4 py-2 text-text-muted hover:bg-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors">Add Round</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-text">Interview Notes</h3>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-text-muted hover:text-text">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNotesSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Questions Asked</label>
                <textarea rows="3" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none resize-none" value={notesForm.questionsAsked} onChange={e => setNotesForm({...notesForm, questionsAsked: e.target.value})} placeholder="What did they ask?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-500 mb-1">Mistakes Made</label>
                <textarea rows="2" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none resize-none" value={notesForm.mistakesMade} onChange={e => setNotesForm({...notesForm, mistakesMade: e.target.value})} placeholder="What went wrong?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-500 mb-1">Key Learnings</label>
                <textarea rows="2" className="w-full p-2 bg-bg border border-border rounded-lg text-text focus:border-primary outline-none resize-none" value={notesForm.keyLearnings} onChange={e => setNotesForm({...notesForm, keyLearnings: e.target.value})} placeholder="What did you learn?" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsNotesModalOpen(false)} className="px-4 py-2 text-text-muted hover:bg-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors">Save Notes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
