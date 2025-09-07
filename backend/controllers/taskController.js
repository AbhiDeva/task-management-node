const Task = require("../models/Task");

exports.getTasks = async (req,res) => {
  const tasks = await Task.find({});
  res.status(200).json(tasks);
};

 exports.createTask = async (req, res) => {
   try {
    const { title, description, priority, dueDate } = req.body;

    // Check for duplicate title
    const existing = await Task.findOne({ title: title.trim() });
    if (existing) return res.status(400).json({ message: "Task with this title already exists!" });

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "High", // default high
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req,res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new:true });
  if(!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json(task);
};

exports.deleteTask = async (req,res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if(!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json({ message: "Task deleted" });
};
