import { Express, Router } from 'express'
// import fg from 'fast-glob'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesFolder = resolve(__dirname, '..', 'routes')
  readdirSync(routesFolder).map(async (file) => {
    if (!file.includes('.test.')) {
      ;(await import(resolve(routesFolder, file))).default(router)
    }
  })
  // fg.sync('**/src/main/routes/**routes.ts').map(async (file) =>
  //   (await import(`../../../${file}`)).default(router)
  // )
}
