`var path`
'use strict'
 
express = require 'express'
request = require 'request'
path = require 'path'
http = require 'http'
path = require 'path'
async = require 'async'
serveStatic = require 'serve-static'





app = express()
 
 
app.disable 'etag'
app.set 'trust proxy', true
app.use serveStatic('./bower_components/jquery/dist')
app.use serveStatic('./bower_components/d3')
app.use serveStatic('./bower_components/paper/dist')
app.use serveStatic('./bower_components/three.js/build')
app.use serveStatic('./node_modules/three-orbit-controls')
app.use serveStatic('./scripts')
app.use serveStatic('./styles')



app.use serveStatic('./', 'index': [
  'index.html'
  'index.htm'
])
 
app.get '/', (req, res) ->
  res.render 'index', (err, html) ->
    res.send html
    return
  return

module.exports =
  app: app
  port: 8080