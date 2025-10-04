import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './ProgressGraphs.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProgressGraphs = ({ subjects }) => {
  const topicsBySubject = subjects.map(subject => ({
    name: subject.name,
    Tópicos: subject.topics.length,
    Concluídos: subject.topics.filter(t => t.completed).length,
  }));

  const topicsByPriority = ['high', 'medium', 'low'].map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: subjects.flatMap(s => s.topics).filter(t => t.priority === priority).length,
  }));

  const completedOverTime = subjects.flatMap(s => s.topics)
    .filter(t => t.completed && t.completedAt)
    .reduce((acc, topic) => {
      const date = new Date(topic.completedAt).toLocaleDateString('pt-BR');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const completedData = Object.keys(completedOverTime).map(date => ({
    date,
    Tópicos: completedOverTime[date],
  })).sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));

  return (
    <div className="progress-graphs-container">
      <h2 className="progress-graphs-title">Gráficos de Progresso</h2>
      <div className="charts-grid">
        <div className="chart-wrapper">
          <h3>Tópicos por Matéria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicsBySubject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tópicos" fill="#8884d8" />
              <Bar dataKey="Concluídos" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Distribuição por Prioridade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={topicsByPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {topicsByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper full-width">
          <h3>Tópicos Concluídos ao Longo do Tempo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Tópicos" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressGraphs;
