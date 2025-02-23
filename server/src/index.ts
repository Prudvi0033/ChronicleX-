import 'dotenv/config'
import { Hono } from 'hono'

const app = new Hono()

app.post('/api/signup', (c) => {
  return c.text('Signup')
})

app.post("/api/login",(c) => {
  return c.json("Login")
})

app.post("/api/blog",(c) => {
  return c.json("Create Blog")
})

app.get("/api/blog/:id",(c) => {
  const { id } = c.req.param()
  return c.json("Get Blog")
})

app.put("/api/blog/:id",(c) => {
  const {id} = c.req.param()
  return c.json("Edit Blog")
})

app.delete("/api/blog/:id",(c) => {
  const {id} = c.req.param()
  return c.json("Delete Blog")
})

app.get("/api/blog",(c) => {
  return c.text("All Blogs")
})

export default app
