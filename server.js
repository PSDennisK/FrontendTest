const next = require('next')
const express = require('express')

// Zet NODE_NO_WARNINGS om de Buffer waarschuwing te onderdrukken
process.env.NODE_NO_WARNINGS = '1';

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
}).catch(err => {
  console.error(err)
  process.exit(1)
})