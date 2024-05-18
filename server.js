import express from 'express'
import api from './api/index.js'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(api)
