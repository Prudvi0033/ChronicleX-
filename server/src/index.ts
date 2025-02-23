import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'

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



app.post('/api/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })
  } catch (error) {
    c.status(403)
    return c.json({ error: "Error in Signing Up" })
  }
})

app.post("/api/login", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user) {
      c.json({ "Error": "User Not found" })
    }

    const jwt = await sign({ id: user?.id }, c.env.JWT_SECRET)
    return c.json({jwt})
  } catch (error) {
    c.status(403)
    return c.json({ Error: "Error in Login" })
  }

})

app.post("/api/blog", (c) => {
  return c.json("Create Blog")
})

app.get("/api/blog/:id", (c) => {
  const { id } = c.req.param()
  return c.json("Get Blog")
})

app.put("/api/blog/:id", (c) => {
  const { id } = c.req.param()
  return c.json("Edit Blog")
})

app.delete("/api/blog/:id", (c) => {
  const { id } = c.req.param()
  return c.json("Delete Blog")
})

app.get("/api/blog", (c) => {
  return c.text("All Blogs")
})

export default app
