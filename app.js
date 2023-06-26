import bodyParser from 'body-parser'
import {parse} from 'csv-parse/sync'
import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', './templates')

app.use(bodyParser.urlencoded({extended: false}))

const outputFile = '/data/result.csv'
const tweets = parse(fs.readFileSync('tweets_ostrava.csv', 'utf8'))
    .filter((item) => item[1].length >= 50 && !item[1].includes('#holytrainer'))


function renderForm(res, counter) {
    const done = counter > 15
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)]
    const tweet = {text: randomTweet[1], id: randomTweet[0]}
    res.render('survey', {tweet: tweet, counter: counter, done: done})
}

app.post('/', (req, res) => {
    const record = [req.body.id, req.body.positive, req.body.negative]
    const counter = parseInt(req.body.counter)
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
