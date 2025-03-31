const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json()); // req.body

// Routes

//  ROUTE 1:  Create a todo : POST "/todos"
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

    res.json(newTodo.rows[0])
  } catch (err) {
    console.log(err.message);
  }
});

//  ROUTE 2:  Get all todos : GET "/todos"
app.get("/todos", async (req,res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows)
      } catch (err) {
        console.log(err.message);
      }
})

//  ROUTE 3: Get a todo by id : GET "/todos/:id"
app.get("/todos/:id", async (req,res)=>{
    try {
        const {id} = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE tid= $1",[id])
        res.json(todo.rows[0])
      } catch (err) {
        console.log(err.message);
      }
})

// ROUTE 4: update a todo by id : PUT "/todos/:id"
app.put("/todos/:id", async (req,res)=>{
    try {
        const {id} = req.params
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE tid=$2", [description, id])
        res.json("todo was updated!")
      } catch (err) {
        console.log(err.message);
      }
})

// ROUTE 5: delete a todo by id : DELETE "/todos/:id"
app.delete("/todos/:id",  async (req,res)=>{
    try {
        const {id} = req.params
        const deleteTodo = await pool.query("DELETE FROM todo WHERE tid=$1", [id])
        res.json("todo was deleted!")
      } catch (err) {
        console.log(err.message);
      }
})

app.listen(5000, () => {
  console.log("Server has started on Port 5000");
});
