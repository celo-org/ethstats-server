import express from "express"
import path from "path"
import * as bodyParser from "body-parser";
import compression from "compression"
import { cfg } from "./utils/config";

const expressConfig = express()

// view engine setup
expressConfig.set('views', path.join(__dirname, '../client/views'))
expressConfig.set('view engine', 'jade')

if (cfg.compression) {
  expressConfig.use(compression())
}

expressConfig.use(bodyParser.json())
expressConfig.use(bodyParser.urlencoded({extended: false}))
expressConfig.use(express.static(path.join(__dirname, '../../dist')))

export default expressConfig
