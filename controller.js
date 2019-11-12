const puppeteer = require('puppeteer');
const translate = require('translate')
const { API_KEY, ENGINE, IPA_URL } = require('./config')
translate.engine = ENGINE
translate.key = API_KEY


module.exports = {
    words: async (parent, args) => {
        const words = args.text.split(' ') 
        const results = [] 
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()

        await page.goto(IPA_URL, {waitUntil: 'networkidle2'})
        await page.type("#text_to_transcribe", words)
        await page.evaluate(() => {
            const inputs = document.getElementsByName('output_dialect')
            for (var i = 0; i < inputs.length; i++){
                if (inputs[i].value == 'am')
                    inputs[i].checked = true
                inputs[i].checked = false
            }
        })

        await Promise.all([
            page.waitForNavigation(),
            page.click("#submit")
        ])

        const ipas = await page.evaluate(() => 
            [...document.querySelectorAll('span.transcribed_word')].map(elem => elem.innerText)
        )

        for (var i = 0; i < ipas.length; i++){
            const zh = await translate(words[i], 'zh')
            results.push({
              text: words[i],
              ipa: ipas[i],
              zh: zh
            })
        }

        browser.close()
        console.log(results)
        return results 
    }
}