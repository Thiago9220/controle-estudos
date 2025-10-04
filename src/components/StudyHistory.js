import React from 'react';
import './StudyHistory.css';

const StudyHistory = ({ subjects }) => {
  const studyHistoryData = subjects.flatMap(subject => 
    subject.topics
      .filter(topic => topic.completed)
      .map(topic => ({
        id: topic.id,
        date: new Date(topic.completedAt).toLocaleDateString('pt-BR'),
        discipline: subject.name,
        category: 'N/A', // This data is not available in the current data structure
        time: `${topic.studyTime}h`,
        exercises: { acert: 0, err: 0, total: 0, perc: '0%' }, // This data is not available
        activity: 'Estudo de Tópico',
        subtopic: topic.name,
        pages: { start: 0, end: 0 }, // This data is not available
        video: { start: 'N/A', end: 'N/A' }, // This data is not available
        comment: topic.notes,
        revisions: { r1: false, r7: false, r30: false, r60: false, r120: false }, // This data is not available
        nextRevision: 'N/A', // This data is not available
      }))
  );

  const totalHours = studyHistoryData.reduce((acc, item) => acc + parseFloat(item.time), 0);
  const totalExercises = { acert: 0, err: 0, total: 0, perc: '0%' }; // This data is not available
  const totalPagesRead = 0; // This data is not available

  return (
    <div className="study-history-container">
      <div className="summary-indicators">
        <div>
          <h3>Horas Líquidas Totais</h3>
          <p>{totalHours}</p>
        </div>
        <div>
          <h3>Exercícios</h3>
          <p>{`${totalExercises.perc} (${totalExercises.acert}/${totalExercises.total})`}</p>
        </div>
        <div>
          <h3>Páginas Lidas</h3>
          <p>{totalPagesRead}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Disciplina</th>
              <th>Categoria</th>
              <th>Tempo</th>
              <th>Exercícios (A, E, T, %)</th>
              <th>Atividade</th>
              <th>Subtópico</th>
              <th>Páginas (Início/Fim)</th>
              <th>Videoaulas (Início/Fim)</th>
              <th>Comentário</th>
              <th>Revisões (1, 7, 30, 60, 120)</th>
              <th>Próxima Revisão</th>
            </tr>
          </thead>
          <tbody>
            {studyHistoryData.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.discipline}</td>
                <td>{item.category}</td>
                <td>{item.time}</td>
                <td>{`${item.exercises.acert}, ${item.exercises.err}, ${item.exercises.total}, ${item.exercises.perc}`}</td>
                <td>{item.activity}</td>
                <td>{item.subtopic}</td>
                <td>{`${item.pages.start}-${item.pages.end}`}</td>
                <td>{`${item.video.start}-${item.video.end}`}</td>
                <td>{item.comment}</td>
                <td className="revisions">
                  <span className={item.revisions.r1 ? 'done' : 'pending'}>1</span>
                  <span className={item.revisions.r7 ? 'done' : 'pending'}>7</span>
                  <span className={item.revisions.r30 ? 'done' : 'pending'}>30</span>
                  <span className={item.revisions.r60 ? 'done' : 'pending'}>60</span>
                  <span className={item.revisions.r120 ? 'done' : 'pending'}>120</span>
                </td>
                <td>{item.nextRevision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudyHistory;
