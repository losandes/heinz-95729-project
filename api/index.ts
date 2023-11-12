import express from 'express'
import loadPalettes from './domains/about/src/io/load-palettes'

export const app: ReturnType<typeof express> = express()

app.get('/api/hello', (_req, res) => {
  res.send({ hello: 'world' })
})

app.get('/api/palettes', async (_req, res) => {
  const palettes = await loadPalettes()
  res.send(palettes)
})

export default app
