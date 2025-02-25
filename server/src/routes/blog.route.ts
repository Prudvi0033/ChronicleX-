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

blogRouter.use(async (c, next) => {
    if (c.req.path === "/bulk") {
        return await next();  
    }

    const token = c.req.header("Authorization");

    if (!token) {
        return c.json({ msg: "No token found" }, 401); // Return early if no token
    }

    try {
        //@ts-ignore
        const response = await verify(token, c.env.JWT_SECRET);
        if (!response) {
            return c.json({ msg: "Unauthorized user" }, 401); // Return early if verification fails
        }

        //@ts-ignore
        c.set("userId", response.id);

        return await next(); // Call next middleware only if authenticated
    } catch (error) {
        return c.json({ error: "Error in Middleware" }, 403); // Return proper error response
    }
});



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
                //@ts-ignore
                authorId: c.get("userId")
            }
        })

        return c.json({ response })
    } catch (error) {
        c.status(403)
        return c.json({
            msg: "Error in creting post"
        })
    }
})

blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const posts = await prisma.posts.findMany({})
    return c.json(posts)
    } catch (error) {
        console.log("Error in bulk",error);
        c.json({msg : "Error in bulk"})
    }
})

blogRouter.get("/:id", async (c) => {
    const { id } = c.req.param()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const post = await prisma.posts.findUnique({
            where: {
                id
            }
        })

        return c.json(post)
    } catch (error) {
        c.status(403)
        c.json({
            msg: "Error in Geeting Post"
        })
    }
})

blogRouter.put("/:id", async (c) => {
    const body = await c.req.json()
    const { id } = c.req.param()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const updatedPost = await prisma.posts.update({
            where: { id },
            data: { title: body.title, content: body.content }
        })

        return c.json(updatedPost)
    } catch (error) {
        c.status(403);
        return c.json({ msg: "Error in updating post" });
    }
})

blogRouter.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const post = await prisma.posts.findUnique({
            where: { id }
        });
        if (!post) {
            return c.json({ msg: "Post not found" },404);
        }
        await prisma.posts.delete({
            where : {id}
        })
        return c.json({ msg: "Post deleted successfully" });
    } catch (error) {
        c.status(500);
        console.log(error);
        return c.json({ msg: "Error in deleting post"});
    }
});


