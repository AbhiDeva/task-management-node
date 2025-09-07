const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    maxlength: [40, "Title cannot exceed 40 characters"],
    unique: true, // ✅ ensures no duplicates
    trim: true
  },
  description: {
    type: String,
    maxlength: [255, "Description cannot exceed 255 characters"],
    trim: true,
    default: "",
  },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "High" },
  dueDate: {
    type: Date,
    required: false,
    validate: {
      validator: function (value) {
        if (!value) return true; // dueDate is optional
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today; // ✅ Cannot accept past dates
      },
      message: "Due date cannot be in the past",
    },
  },
  completed: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now, // ✅ Default current date
  },
});

module.exports = mongoose.model("Task", taskSchema);

