import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getSingleNote,
} from "./crudOperation.js";

const route = express.Router();

route.get("/", function (req, res) {
  res.send("Welcome to backend");
});

route.post("/notes/create", createNote);
route.get("/notes/get", getNotes);
route.put("/notes/update", updateNote);
route.delete("/notes/delete/:id", deleteNote);
route.get("/notes/singleNote/:id", getSingleNote);

export default route;

