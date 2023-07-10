import bodyParser from 'body-parser'
import {parse} from 'csv-parse/sync'
import express from 'express'
import fs from 'fs'
import md5 from 'md5'

const app = express()
const port = 3000
const host = '0.0.0.0'

app.set('view engine', 'ejs')
app.set('views', './templates')

app.use(bodyParser.urlencoded({extended: false}))

const outputFile = './data/result.csv'
const tweets = parse(fs.readFileSync('./data/tweets.csv', 'utf8'))
    .filter((item) => item[1].length >= 50 && !item[1].includes('#holytrainer'))


function renderForm(res, counter) {
    const done = counter > 15
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)]
    const tweet = {text: randomTweet[1], hash: md5(randomTweet[1])}
    const startTime = Date.now()
    res.render('survey', {tweet: tweet, counter: counter, done: done, startTime: startTime})
}

app.post('/', (req, res) => {
    const startTime = parseInt(req.body.starttime)
    const endTime = Date.now()
    const counter = parseInt(req.body.counter)
    const record = [req.body.hash, req.body.positive, req.body.negative, counter, startTime, endTime]
    fs.appendFileSync(outputFile, record.join(',') + '\n')
    renderForm(res, counter + 1)
})

app.get('/', (req, res) => {
    renderForm(res, 1)
})

app.get('/skip', (req, res) => {
    const counter = req.query.counter
    renderForm(res, counter)
})

app.listen(port, host, () => {
    console.log(`Listening on port ${port} and host ${host}`)
})
