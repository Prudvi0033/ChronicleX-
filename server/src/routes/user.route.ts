import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    }
}>()

userRouter.post('/signup', async (c) => {
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

userRouter.post("/login", async (c) => {
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