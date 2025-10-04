const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let subjects = [];

// Get all subjects
app.get('/api/subjects', (req, res) => {
  res.json(subjects);
});

// Add a new subject
app.post('/api/subjects', (req, res) => {
  const newSubject = { ...req.body, id: Date.now() };
  subjects.push(newSubject);
  res.status(201).json(newSubject);
});

// Update a subject
app.put('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  const updatedSubject = req.body;
  subjects = subjects.map(subject => (subject.id === parseInt(id) ? updatedSubject : subject));
  res.json(updatedSubject);
});

// Delete a subject
app.delete('/api/subjects/:id', (req, res) => {
  const { id } = req.params;
  subjects = subjects.filter(subject => subject.id !== parseInt(id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
