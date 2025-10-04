import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle, Circle, Clock, FileText, Calendar, Target, TrendingUp, Award, Filter, Search, Edit2, Save, X } from 'lucide-react';
import ProgressGraphs from './components/ProgressGraphs';

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
  const [showStats, setShowStats] = useState(JSON.parse(localStorage.getItem('showStats')) ?? true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentView, setCurrentView] = useState(localStorage.getItem('currentView') || 'main');

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
        setSubjects(JSON.parse(saved));
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
    localStorage.setItem('showStats', JSON.stringify(showStats));
  }, [showStats]);

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, {
        id: Date.now(),
        name: newSubject,
        topics: [],
        color: getRandomColor(),
        createdAt: new Date().toISOString()
      }]);
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
              <button
                onClick={toggleTheme}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center gap-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {showStats ? 'Ocultar' : 'Mostrar'} Estatísticas
              </button>
            </div>
          </div>

          {currentView === 'main' && (
            <>
              {showStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total de Tópicos</p>
                        <p className="text-3xl font-bold">{totalTopics}</p>
                      </div>
                      <FileText className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Concluídos</p>
                        <p className="text-3xl font-bold">{completedTopics}</p>
                        <p className="text-green-100 text-xs mt-1">{completionRate}% completo</p>
                      </div>
                      <CheckCircle className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Horas Estudadas</p>
                        <p className="text-3xl font-bold">{totalHours}h</p>
                      </div>
                      <Clock className="w-8 h-8 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">Atrasados</p>
                        <p className="text-3xl font-bold">{overdueTopics}</p>
                      </div>
                      <Target className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  placeholder="Nova matéria (ex: Matemática, Português...)"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                />
                <button
                  onClick={addSubject}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar tópicos..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none"
                >
                  <option value="all">Todas Prioridades</option>
                  <option value="high">Alta Prioridade</option>
                  <option value="medium">Média Prioridade</option>
                  <option value="low">Baixa Prioridade</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none"
                >
                  <option value="all">Todos Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="completed">Concluídos</option>
                  <option value="overdue">Atrasados</option>
                </select>

                <button
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition"
                >
                  {view === 'grid' ? '📋 Lista' : '📊 Grade'}
                </button>
              </div>
            </>
          )}
          {currentView === 'graphs' && <ProgressGraphs subjects={subjects} />}
        </div>

        {currentView === 'main' && (
          <>
            <div className={view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
              {filteredSubjects.map(subject => (
                <div key={subject.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    {editingSubject === subject.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-indigo-400 rounded-lg focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditSubject(subject.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingSubject(null)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
                          <button
                            onClick={() => startEditSubject(subject)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-bold text-indigo-600">{getProgress(subject)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${getProgress(subject)}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {subject.topics.map(topic => (
                      <div key={topic.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTopic(subject.id, topic.id)}
                            className="mt-1"
                          >
                            {topic.completed ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className={`font-medium ${topic.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {topic.name}
                              </span>
                              <button
                                onClick={() => deleteTopic(subject.id, topic.id)}
                                className="text-red-400 hover:text-red-600 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(topic.priority)}`}>
                                {getPriorityLabel(topic.priority)}
                              </span>
                              
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {topic.studyTime}h
                              </span>
                              
                              {topic.deadline && (
                                <span className={`text-xs flex items-center gap-1 ${isOverdue(topic.deadline) && !topic.completed ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                  <Calendar className="w-3 h-3" />
                                  {new Date(topic.deadline).toLocaleDateString('pt-BR')}
                                  {isOverdue(topic.deadline) && !topic.completed && ' ⚠️'}
                                </span>
                              )}
                            </div>
                            
                            <textarea
                              value={topic.notes}
                              onChange={(e) => updateNotes(subject.id, topic.id, e.target.value)}
                              placeholder="Adicionar anotações..."
                              className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none resize-none"
                              rows="2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <input
                      type="text"
                      value={newTopic[subject.id] || ''}
                      onChange={(e) => setNewTopic({ ...newTopic, [subject.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && addTopic(subject.id)}
                      placeholder="Novo tópico..."
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={studyTime[subject.id] || ''}
                        onChange={(e) => setStudyTime({ ...studyTime, [subject.id]: e.target.value })}
                        placeholder="Horas"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                      />
                      
                      <select
                        value={priority[subject.id] || 'medium'}
                        onChange={(e) => setPriority({ ...priority, [subject.id]: e.target.value })}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                      >
                        <option value="low">Baixa Prioridade</option>
                        <option value="medium">Média Prioridade</option>
                        <option value="high">Alta Prioridade</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={deadline[subject.id] || ''}
                        onChange={(e) => setDeadline({ ...deadline, [subject.id]: e.target.value })}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none text-sm"
                      />
                      
                      <button
                        onClick={() => addTopic(subject.id)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma matéria ainda</h3>
                <p className="text-gray-400">Comece adicionando uma matéria acima!</p>
              </div>
            )}

            {subjects.length > 0 && filteredSubjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-400">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}