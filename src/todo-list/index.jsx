import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/todo";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_BASE_URL + "/");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      setError("Please enter a task");
      return;
    }
    try {
      const response = await fetch(API_BASE_URL + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.trim() }),
      });
      if (response.ok) {
        fetchTasks();
        setNewTask("");
        setError("");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (id, newText) => {
    if (!newText.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newText.trim() }),
      });
      if (response.ok) {
        fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Task Manager</h1>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="Enter new task..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button onClick={addTask} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FiPlus className="h-5 w-5 mr-2" /> Add
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.p className="text-center text-gray-500 my-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                No tasks yet. Add some to get started!
              </motion.p>
            ) : (
              <motion.ul className="space-y-3" layout initial="hidden" animate="visible" exit="exit">
                {tasks.map((task) => (
                  <motion.li
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center flex-1">
                      <span className={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>{task.title}</span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button onClick={() => setEditingTask(task.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
