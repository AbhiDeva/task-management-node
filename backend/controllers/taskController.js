const Task = require('../models/Task');

exports.getTasks = async (req,res) => {
  const tasks = await Task.find({});
  res.status(200).json(tasks);
};

 exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    //  Check duplicate by title (case-insensitive)
    const existingTask = await Task.findOne({ title: new RegExp(`^${title}$`, "i") });
    if (existingTask) {
      return res.status(400).json({ message: "Task with this title already exists" });
    }

    const task = await Task.create({ title, description, priority, dueDate });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req,res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new:true });
  if(!task) return res.status(404).json({ message: 'Task not found' });
  res.status(200).json(task);
};

exports.deleteTask = async (req,res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if(!task) return res.status(404).json({ message: 'Task not found' });
  res.status(200).json({ message: 'Task deleted' });
};
