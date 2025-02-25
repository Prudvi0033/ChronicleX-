import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user.route'
import { blogRouter } from './routes/blog.route'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.use("/api/blog/*", async (c, next) => {
  const token = c.req.header('Authorization') || ""

  if (!token) {
    return c.json({ error: "Unauthorized: No token provided" }, 401)
  }

  try {
    const response = await verify(token, c.env.JWT_SECRET)

    if (!response.id) {
      return c.json({ error: "Unauthorized: Invalid token" }, 403)
    }

    await next()
  } catch (error) {
    return c.json({ error: "Unauthorized: Token verification failed" }, 403)
  }
})

app.route("/api",userRouter)
app.route("/api/blog",blogRouter)




export default app
