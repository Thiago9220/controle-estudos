import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import './Reminders.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const checkReminders = () => {
    const now = new Date();
    reminders.forEach(reminder => {
      const reminderDateTime = new Date(reminder.time);
      if (reminderDateTime.getFullYear() === now.getFullYear() &&
          reminderDateTime.getMonth() === now.getMonth() &&
          reminderDateTime.getDate() === now.getDate() &&
          reminderDateTime.getHours() === now.getHours() &&
          reminderDateTime.getMinutes() === now.getMinutes()) {
        showNotification(reminder.text);
      }
    });
  };

  const showNotification = (text) => {
    if (Notification.permission === 'granted') {
      new Notification('Lembrete de Estudo', {
        body: text,
        icon: '/logo192.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Lembrete de Estudo', {
            body: text,
            icon: '/logo192.png',
          });
        }
      });
    }
  };

  const addReminder = () => {
    if (newReminder.trim() && reminderTime) {
      setReminders([...reminders, { id: Date.now(), text: newReminder, time: reminderTime }]);
      setNewReminder('');
      setReminderTime('');
    }
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="reminders-container">
      <h2 className="reminders-title"><Bell /> Lembretes</h2>
      <div className="add-reminder-form">
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          placeholder="O que você quer lembrar?"
        />
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <button onClick={addReminder}><Plus /> Adicionar</button>
      </div>
      <ul className="reminders-list">
        {reminders.map(reminder => (
          <li key={reminder.id}>
            <span>{reminder.text} - {new Date(reminder.time).toLocaleString('pt-BR')}</span>
            <button onClick={() => deleteReminder(reminder.id)}><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;
