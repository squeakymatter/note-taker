const express = require('express')
const router = express.Router()
const fs = require('fs')
const { send } = require('process')
const uuid = require('uuid')
const notes = require('../../db/db.json')

router.use(express.json())

router.get('/', (req, res) => res.json(notes))

router.post('/', (req, res) => {
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
  fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
    if (err) throw err
  })
  res.json(notes)
})

//delete note
router.delete('/:id', (req, res, ext) => {
  const { id } = req.params
  const index = notes.findIndex((note) => note.id == id)
  notes.splice(index, 1)
  console.log(notes)

  fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
    if (err) throw err
  })
  return res.send()
})

module.exports = router
