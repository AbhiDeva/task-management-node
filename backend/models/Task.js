const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // ✅ ensures no duplicates
    trim: true
  },
  description: String,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  dueDate: Date,
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);

