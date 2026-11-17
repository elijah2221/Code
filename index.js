import express from "express";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
app.use(express.json());

// Get all users
app.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//Get a single user
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: parseInt(id) } });
    res.json(user);
  } catch (error) {
    if (error.code === "P2025") res.status(404).send("User not found");
    res.status(500).send(error);
  }
});

// Create a new user
app.post("/User", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, email, age } });
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user (full)
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email, age },
  });
  res.json(user);
} catch (error) {
  res.status(500).send(error);
}
});

//Update a user (partial)
app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email, age },
  });
  res.json(user);
} catch (error) {
  res.status(500).send(error);
}
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({ where: { id: parseInt(id) } });
    res.send(`User ${deletedUser.name} deleted`);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
