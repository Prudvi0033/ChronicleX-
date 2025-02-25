import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()



blogRouter.post("/", async (c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const response = await prisma.posts.create({
            data: {
                title: body.title,
                content: body.content,
                authorId : "1"
            }
        })

        return c.json({response})
    } catch (error) {
        c.status(403)
        return c.json({
            msg : "Error in creting post"
        })
    }
})

blogRouter.get("/bulk", async (c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const posts = await prisma.posts.findMany({})
    return c.json(posts)
})

blogRouter.get("/:id", async(c) => {
    const body = await c.req.json()
    const {id} = c.req.param()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const post = await prisma.posts.findUnique({
            where:{
                id : id
            }
        }) 

        return c.json(post)
    } catch (error) {
        c.status(403)
        c.json({
            msg : "Error in Geeting Post"
        })
    }
})

blogRouter.put("/:id", async(c) => {
    const body = await c.req.json()
    const {id} = c.req.param()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

})

blogRouter.delete("/:id", async(c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
})

