import express from "express"
import path from "path"
import * as bodyParser from "body-parser";
import compression from "compression"
import { cfg } from "./utils/config";

const app = express()

// view engine setup
app.set('views', path.join(__dirname, '../client/views'))
app.set('view engine', 'jade')

if (cfg.compression) {
  app.use(compression())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (
  req: express.Request,
  res: express.Response
) => {
  res.render('index')
})

app.get('/memory', (
  req: express.Request,
  res: express.Response
) => {
  const mem = process.memoryUsage()

  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(`
<div>
    <div>rss: ${(mem.rss / 1024 / 1024).toFixed(2)}mb</div>
    <div>heapUsed: ${(mem.heapUsed / 1024 / 1024).toFixed(2)}mb</div>
    <div>heapTotal: ${(mem.heapTotal / 1024 / 1024).toFixed(2)}mb</div>
    <div>external: ${(mem.external / 1024 / 1024).toFixed(2)}mb</div>
</div>
`
  ))
})

// catch 404 and forward to error handler
app.use((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const err = new Error(`Not Found ${req.url}`)
  res.status(404)
  next(err)
})

// error handlers
app.use((
  err: any,
  req: express.Request,
  res: express.Response
) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: err
  })
})

// production error handler
app.use((
  err: any,
  req: express.Request,
  res: express.Response
) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

export default app
