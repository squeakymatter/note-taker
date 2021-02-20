const express = require('express')
const path = require('path')
const app = express()

app.use('/api/notes', require('./routes/api/notes'))
app.use(express.static(path.join(__dirname, 'public')))
//body parser middleware
app.use(express.json())
//handle url encoded data
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(PORT, () => console.log(`This server is listening on port ${PORT}`))
