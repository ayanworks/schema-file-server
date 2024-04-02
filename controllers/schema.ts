import {
  Response as Res,
  Request,
} from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { existsSync } from "https://deno.land/std@0.209.0/fs/mod.ts"

export default {
  createSchema: async ({
    response,
    request,
  }: {
    response: Res
    request: Request
  }) => {
    const { value } = request.body({ type: "json" })
    const data: { schemaId: string; schema: object } = await value

    if (!data.schemaId || !data.schema) {
      response.status = 400
      response.body = {
        success: false,
        message: "Invalid schema data",
        data: null,
      }
      return
    }

    const filePath = `schemas/${data?.schemaId}.json`

    const pathFound = existsSync(filePath)

    if (pathFound) {
      console.log(
        `Schema already exists in the system with id: ${data?.schemaId}}`
      )
      response.status = 400
      response.body = {
        success: false,
        message: "Schema already exists",
        data: null,
      }
      return
    }

    console.log(`Creating schema with id: ${data?.schemaId} on system`)

    await Deno.writeTextFile(filePath, JSON.stringify(data.schema, null, 2), {})

    response.body = {
      success: true,
      message: "Schema created successfully",
      data,
    }
  },
  getSchemaById: async ({
    response,
    request,
  }: {
    response: Res
    request: Request
  }) => {
    const url = new URL(request.url)
    const filepath = decodeURIComponent(url.pathname)

    // Try opening the file
    let file
    try {
      file = await Deno.open("." + filepath + ".json", { read: true })
    } catch {
      // If the file cannot be opened, return a "404 Not Found" response
      const notFoundResponse = new Response("404 Not Found", { status: 404 })
      response.body = notFoundResponse.body
      return
    }

    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
    const readableStream = file?.readable

    // Build and send the response
    const result = new Response(readableStream)

    response.body = await result.json()
  },
}
