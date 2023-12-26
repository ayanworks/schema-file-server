import { Application, Middleware } from "https://deno.land/x/oak@v12.6.1/mod.ts"
import {
  IgnorePattern,
  jwtMiddleware,
} from "https://deno.land/x/oak_middleware_jwt@2.2.2/mod.ts"
import { APP_PORT } from "./config.ts"
import { secretKey } from "./utils/utils.ts"
import schemaRouter from "./routes/schema.ts"

const app = new Application()

const ignorePatterns: IgnorePattern[] = [
  {
    path: "/",
    methods: ["GET"],
  },
  {
    path: /[a-zA-Z0-9]+/,
    methods: ["GET"],
  },
  {
    path: /^\/schemas\/[a-zA-Z0-9]+/,
    methods: ["GET"],
  },
]

app.use(
  jwtMiddleware<Middleware>({
    key: secretKey,
    algorithm: "HS256",
    ignorePatterns,
  })
)

app.use(schemaRouter.routes())
app.use(schemaRouter.allowedMethods())

// 404 page
app.use(({ response }) => {
  response.status = 404
  response.body = "404 Not Found"
})

app.listen({ port: Number(APP_PORT) })

console.log(`Listening on port: ${APP_PORT}...`)

// Get auth token
// const { token, payload } = await getAuthToken()
// console.log("getAuthToken", token, payload)
