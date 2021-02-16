import puppeteer from 'puppeteer'
import fse from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import replace from 'replace-in-file'
import handler from 'serve-handler'
import http from 'http'
import events from 'events'

const createStaticServer = (port, distFolder) =>
  http.createServer((request, response) =>
    handler(request, response, {
      public: distFolder,
      rewrites: [
        { source: '**/*', 'destination': '/index.html' }
      ]
    })
  ).listen(port)


interface StaticOptions {
  port?: number;
  distFolder?: string;
  entryPoint?: string;
  extraPages?: string[]
}


const renderPages = async ({ port = 54322, distFolder = 'dist', entryPoint = '/', extraPages = [] }: StaticOptions) => {
  try {

    // Spin up a static server to use for prerendering with pupeteer
    await createStaticServer(port, distFolder)

    console.log('Rendering site...')

    const baseUrl = `http://localhost:${port}`

    const cache = {}

    const renderEvents = new events.EventEmitter();

    // Initial render queue
    const renderQueue = [
      entryPoint,
      ...extraPages
    ]

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.exposeFunction('registerPath', (path: string) => {
      if (!renderQueue.includes(path)) {
        console.log(`Found path ${path}, adding to render queue`);
        renderQueue.push(path);
      }
    });

    await page.exposeFunction('cacheData', (key: string, data: any) => {
      cache[key] = data;
    });

    await page.exposeFunction('pathRendered', (path: string) => {
      renderEvents.emit(`${path}-rendered`);
    });

    // Load page
    await page.goto(`${baseUrl}${entryPoint}`, { waitUntil: 'networkidle0' });

    // Pre-render loop
    for (let i = 0; i < renderQueue.length; i++) {
      const pagePath = renderQueue[i]

      console.log(`Rendering page: ${pagePath} ...`)

      page.on('pageerror', function (err) {
        console.log(`Runtime error in page: ${pagePath} Error: ${err.toString()}`)
        process.exit(1)
      })

      const pathRendered = new Promise<void>((resolve) => {
        renderEvents.once(`${pagePath}-rendered`, resolve)
      })

      // Navigate to the page client-side
      await page.evaluate((path) => {
        window.history.pushState(null, '', path)
        window.dispatchEvent(new CustomEvent("pushstate"))
      }, pagePath)

      // Wait for page to render
      await pathRendered;

      // Get HTML string from page DOM.
      const html = await page.content();

      // Convert URI path to absolute disk path in the output dir
      const pageFilePath = pagePath === '/' ? '/index.html' : `${pagePath}/index.html`
      const pageFileAbsolutePath = path.join(process.cwd(), distFolder, pageFilePath)

      // Remove basepath from rendered HTML
      // Ex: <script src="http://localhost/about" /> becomes just <script src="/about" />
      const cleanedUpHtml = html.replace(new RegExp(baseUrl, 'gi'), '')

      await fse.outputFile(pageFileAbsolutePath, cleanedUpHtml)
      console.log(`Page created: ${pageFileAbsolutePath}`)
    }

    await browser.close();

    console.log('Pages rendered!')



    console.log('Saving loadStatic data cache...')

    const cacheKeys = Object.keys(cache)

    let cacheUrlArray = []

    for (let i = 0; i < cacheKeys.length; i++) {
      const key = cacheKeys[i]
      const data = cache[key]
      const fileName = crypto.createHash('md5').update(key).digest('hex') + '.json'
      const filePath = '/data/' + fileName

      cacheUrlArray.push(filePath)

      const dataAbsolutePath = path.join(distFolder, filePath)
      await fse.outputFile(dataAbsolutePath, JSON.stringify(data))
      console.log(`Data saved: ${dataAbsolutePath}`)
    }

    const cacheFetchUrls = cacheKeys.reduce((obj, curr, i) => ({
      ...obj,
      [curr]: cacheUrlArray[i]
    }), {})

    console.log('Updating pages...')

    const inlineData = {
      cache: cacheFetchUrls,
    }

    const results = await replace({
      files: distFolder + '/**/*.html',
      from: '</body>',
      to: `<script>window.HYPERSTATIC_DATA = ${JSON.stringify(inlineData)}</script></body>`,
      countMatches: true
    })
    console.log(`${results.length} pages updated!`)

  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('Rendering complete! 🎉')

  process.exit(0)
}

renderPages({})
