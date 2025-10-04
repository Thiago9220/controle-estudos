import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle, Circle, Clock, FileText, Calendar, Target, TrendingUp, Award, Filter, Search, Edit2, Save, X } from 'lucide-react';
import ProgressGraphs from './components/ProgressGraphs';
import PomodoroTimer from './components/PomodoroTimer';
import ExportPDF from './components/ExportPDF';
import Reminders from './components/Reminders';
import Pagination from './components/Pagination';
import StudyHistory from './components/StudyHistory';

export default function StudyTracker() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState({});
  const [studyTime, setStudyTime] = useState({});
  const [priority, setPriority] = useState({});
  const [deadline, setDeadline] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState(localStorage.getItem('filterPriority') || 'all');
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem('filterStatus') || 'all');
  const [view, setView] = useState(localStorage.getItem('view') || 'grid');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentView, setCurrentView] = useState(localStorage.getItem('currentView') || 'main');
  const [collapsedSubjects, setCollapsedSubjects] = useState(JSON.parse(localStorage.getItem('collapsedSubjects')) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('studySubjects');
    if (saved) {
      try {
        const parsedSubjects = JSON.parse(saved);
        setSubjects(parsedSubjects);
        if (parsedSubjects.length > 0) {
          setSelectedSubject(parsedSubjects[0]);
        }
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studySubjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('filterPriority', filterPriority);
  }, [filterPriority]);

  useEffect(() => {
    localStorage.setItem('filterStatus', filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    localStorage.setItem('view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('collapsedSubjects', JSON.stringify(collapsedSubjects));
  }, [collapsedSubjects]);

  const addSubject = () => {
    if (newSubject.trim()) {
      const newSub = {
        id: Date.now(),
        name: newSubject,
        topics: [],
        color: getRandomColor(),
        createdAt: new Date().toISOString()
      };
      setSubjects([...subjects, newSub]);
      setSelectedSubject(newSub);
      setNewSubject('');
    }
  };

  const getRandomColor = () => {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#fa709a', '#30cfd0', '#a8edea'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const deleteSubject = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const startEditSubject = (subject) => {
    setEditingSubject(subject.id);
    setEditingName(subject.name);
  };

  const saveEditSubject = (id) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, name: editingName } : s
    ));
    setEditingSubject(null);
  };

  const toggleSubjectCollapse = (id) => {
    if (collapsedSubjects.includes(id)) {
      setCollapsedSubjects(collapsedSubjects.filter(subId => subId !== id));
    } else {
      setCollapsedSubjects([...collapsedSubjects, id]);
    }
  };

  const addTopic = (subjectId) => {
    const topicName = newTopic[subjectId];
    const hours = studyTime[subjectId] || '0';
    const priorityLevel = priority[subjectId] || 'medium';
    const deadlineDate = deadline[subjectId] || '';
    
    if (topicName && topicName.trim()) {
      setSubjects(subjects.map(s => 
        s.id === subjectId 
          ? {
              ...s,
              topics: [...s.topics, {
                id: Date.now(),
                name: topicName,
                completed: false,
                notes: '',
                studyTime: hours,
                priority: priorityLevel,
                deadline: deadlineDate,
                createdAt: new Date().toISOString()
              }]
            }
          : s
      ));
      setNewTopic({ ...newTopic, [subjectId]: '' });
      setStudyTime({ ...studyTime, [subjectId]: '' });
      setPriority({ ...priority, [subjectId]: 'medium' });
      setDeadline({ ...deadline, [subjectId]: '' });
    }
  };

  const toggleTopic = (subjectId, topicId) => {
    setSubjects(subjects.map(s => 
      s.id === subjectId
        ? {
            ...s,
            topics: s.topics.map(t =>
              t.id === topicId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
            )
          }
        : s
    ));
  };

  const deleteTopic = (subjectId, topicId) => {
    setSubjects(subjects.map(s =>
      s.id === subjectId
        ? { ...s, topics: s.topics.filter(t => t.id !== topicId) }
        : s
    ));
  };

  const updateNotes = (subjectId, topicId, notes) => {
    setSubjects(subjects.map(s =>
      s.id === subjectId
        ? {
            ...s,
            topics: s.topics.map(t =>
              t.id === topicId ? { ...t, notes } : t
            )
          }
        : s
    ));
  };

  const getProgress = (subject) => {
    if (subject.topics.length === 0) return 0;
    const completed = subject.topics.filter(t => t.completed).length;
    return Math.round((completed / subject.topics.length) * 100);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const filteredSubjects = subjects.map(subject => ({
    ...subject,
    topics: subject.topics.filter(topic => {
      const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || topic.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && topic.completed) ||
        (filterStatus === 'pending' && !topic.completed) ||
        (filterStatus === 'overdue' && isOverdue(topic.deadline) && !topic.completed);
      
      return matchesSearch && matchesPriority && matchesStatus;
    })
  })).filter(subject => subject.topics.length > 0 || searchTerm === '');

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce((acc, s) => 
    acc + s.topics.filter(t => t.completed).length, 0
  );
  const totalHours = subjects.reduce((acc, s) =>
    acc + s.topics.reduce((sum, t) => sum + parseInt(t.studyTime || 0), 0), 0
  );
  const overdueTopics = subjects.reduce((acc, s) =>
    acc + s.topics.filter(t => isOverdue(t.deadline) && !t.completed).length, 0
  );

  const completionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Controle de Estudos Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('main')} className={`px-4 py-2 rounded-lg ${currentView === 'main' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Principal</button>
              <button onClick={() => setCurrentView('graphs')} className={`px-4 py-2 rounded-lg ${currentView === 'graphs' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Gráficos</button>
              <button onClick={() => setCurrentView('timer')} className={`px-4 py-2 rounded-lg ${currentView === 'timer' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Timer</button>
              <button onClick={() => setCurrentView('reminders')} className={`px-4 py-2 rounded-lg ${currentView === 'reminders' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Lembretes</button>
              <button onClick={() => setCurrentView('history')} className={`px-4 py-2 rounded-lg ${currentView === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Histórico</button>
              <button
                onClick={toggleTheme}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center gap-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <ExportPDF />
            </div>
          </div>

          {currentView === 'main' && (
            <div className="flex gap-6">
              <div className="w-1/3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Matérias</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                      placeholder="Nova matéria..."
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                    />
                    <button
                      onClick={addSubject}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {subjects.map(subject => (
                    <div 
                      key={subject.id} 
                      className={`p-4 rounded-lg cursor-pointer ${selectedSubject?.id === subject.id ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-sm text-gray-500">{getProgress(subject)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ 
                            width: `${getProgress(subject)}%`,
                            backgroundColor: subject.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-2/3">
                {selectedSubject ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedSubject.name}</h2>
                      <button
                        onClick={() => deleteSubject(selectedSubject.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {selectedSubject.topics.map(topic => (
                        <div key={topic.id} className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-200 dark:hover:border-indigo-500 transition">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTopic(selectedSubject.id, topic.id)}
                              className="mt-1"
                            >
                              {topic.completed ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-300 dark:text-gray-500" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className={`font-medium ${topic.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                  {topic.name}
                                </span>
                                <button
                                  onClick={() => deleteTopic(selectedSubject.id, topic.id)}
                                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(topic.priority)}`}>
                                  {getPriorityLabel(topic.priority)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.studyTime}h
                                </span>
                                {topic.deadline && (
                                  <span className={`text-xs flex items-center gap-1 ${isOverdue(topic.deadline) && !topic.completed ? 'text-red-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <Calendar className="w-3 h-3" />
                                    {new Date(topic.deadline).toLocaleDateString('pt-BR')}
                                    {isOverdue(topic.deadline) && !topic.completed && ' ⚠️'}
                                  </span>
                                )}
                              </div>
                              <textarea
                                value={topic.notes}
                                onChange={(e) => updateNotes(selectedSubject.id, topic.id, e.target.value)}
                                placeholder="Adicionar anotações..."
                                className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-400 focus:outline-none resize-none"
                                rows="2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 border-t dark:border-gray-700 pt-4">
                      <input
                        type="text"
                        value={newTopic[selectedSubject.id] || ''}
                        onChange={(e) => setNewTopic({ ...newTopic, [selectedSubject.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addTopic(selectedSubject.id)}
                        placeholder="Novo tópico..."
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={studyTime[selectedSubject.id] || ''}
                          onChange={(e) => setStudyTime({ ...studyTime, [selectedSubject.id]: e.target.value })}
                          placeholder="Horas"
                          className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                        />
                        <select
                          value={priority[selectedSubject.id] || 'medium'}
                          onChange={(e) => setPriority({ ...priority, [selectedSubject.id]: e.target.value })}
                          className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                        >
                          <option value="low">Baixa Prioridade</option>
                          <option value="medium">Média Prioridade</option>
                          <option value="high">Alta Prioridade</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={deadline[selectedSubject.id] || ''}
                          onChange={(e) => setDeadline({ ...deadline, [selectedSubject.id]: e.target.value })}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                        />
                        <button
                          onClick={() => addTopic(selectedSubject.id)}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Selecione uma matéria para ver os detalhes.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'graphs' && <ProgressGraphs subjects={subjects} />}
          {currentView === 'timer' && <PomodoroTimer />}
          {currentView === 'reminders' && <Reminders />}
          {currentView === 'history' && <StudyHistory subjects={subjects} />}
        </div>
      </div>
    </div>
  );
}