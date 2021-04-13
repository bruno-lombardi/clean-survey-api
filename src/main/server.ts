import { mongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import mongoConfig from './config/mongo'

const port = process.env.PORT ?? 3333
mongoHelper
  .connect(mongoConfig.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    )
  })
  .catch(console.error)
