const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching tasks.' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, stage } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      stage: stage || 'Todo',
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating task.' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, stage } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) {
      if (!['Todo', 'In Progress', 'Done'].includes(stage)) {
        return res.status(400).json({ message: 'Invalid stage.' });
      }
      task.stage = stage;
    }

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating task.' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    await task.deleteOne();
    return res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting task.' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
