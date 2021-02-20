const express = require('express')
const uuid = require('uuid')
const path = require('path')
const notes = require('./db/db.json')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
//body parser middleware
app.use(express.json())
//handle url encoded data
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('/api/notes', (req, res) => res.json(notes))

// app.get('/api/notes:id', (req, res) => {
//     res.send(req.params.id)
// })

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(), //generate random id
    title: req.body.title,
    text: req.body.text,
  }
  if (!newNote.title || !newNote.text) {
    return res.status(400).json({ msg: 'Please include title and text' })
  }
  notes.push(newNote)
  res.json(notes)
})
// //get single note
// app.get('/api/notes/:id', (req, res) => {
//     const found = notes.some((note) => note.id === req.params.id)
//     if (found) {
//       res.json({
//         msg: 'Note deleted',
//         notes: notes.filter((note) => note.id !== req.params.id),
//       })
//     } else {
//       res.status(400).json({ msg: `No note with id ${req.params.id}` })
//     }
//   })

//delete note
app.delete('/api/notes/:id', (req, res) => {
  const found = notes.some((note) => note.id === req.params.id)
  if (found) {
    res.json({
      msg: 'Note deleted',
      notes: notes.filter((note) => note.id !== req.params.id),
    })
  } else {
    res.status(400).json({ msg: `No note with id ${req.params.id}` })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(PORT, () => console.log(`This server is listening on port ${PORT}`))
