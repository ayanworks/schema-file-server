import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts"

// routes
import schemaRouter from "./routes/schema.ts"
import { APP_PORT } from "./config.ts"

const app = new Application()

app.use(schemaRouter.routes())
app.use(schemaRouter.allowedMethods())

// 404 page
app.use(({ response }) => {
  response.status = 404
  response.body = "404 Not Found"
})

app.listen({ port: Number(APP_PORT) })

console.log(`Listening on port: ${APP_PORT}...`)
