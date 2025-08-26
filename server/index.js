import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: 'Aprender Vue', done: false },
  { id: 2, text: 'Crear API con Express', done: true }
];

// Rutas API
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text es requerido' });
  const newTodo = { id: Date.now(), text, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'No existe' });
  Object.assign(todo, req.body);
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
