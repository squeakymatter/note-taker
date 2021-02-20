const express = require('express')
const uuid = require('uuid')
const path = require('path')
const notes = require('./db/db.json')
const fs = require('fs')

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

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(), //generate random id
    title: req.body.title,
    text: req.body.text,
  }
  //require title/text input
  if (!newNote.title || !newNote.text) {
    return res.status(400).json({ msg: 'Please include title and text' })
  }
  notes.push(newNote)
  fs.writeFile(
    path.join(__dirname, 'db', 'db.json'),
    JSON.stringify(notes),
    (err) => {
      if (err) throw err
    }
  )
  res.json(notes)
})

//delete note
app.delete('/api/notes/:id', (req, res) => {
  const found = notes.some((note) => note.id === req.params.id)
  if (!found) res.status(404).json({ msg: `No note with id ${req.params.id}` })

  const index = notes.indexOf(found)
  notes.splice(index, 1)
  fs.writeFile(
    path.join(__dirname, 'db', 'db.json'),
    JSON.stringify(notes),
    (err) => {
      if (err) throw err
    }
  )
  res.send(notes)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(PORT, () => console.log(`This server is listening on port ${PORT}`))
