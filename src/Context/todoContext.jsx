import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // States
  const [todoList, setTodoList] = useState(() => {
    const savedData = localStorage.getItem("TodoList");
    return savedData ? JSON.parse(savedData) : [];
  });

  // Use Effect to store data in localStorage
  useEffect(() => {
    localStorage.setItem("TodoList", JSON.stringify(todoList));
  }, [todoList]);

   // Function to reset all completed tasks at midnight
   useEffect(() => {
    const resetTasksAtMidnight = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check if it's exactly midnight (12:00 AM)
      if (hours === 0 && minutes === 0) {
        setTodoList((prevTasks) =>
          prevTasks.map((task) => ({ ...task, completed: false }))
        );
        toast.info("All tasks reset for the new day!");
      }
    };

    // Run the check every minute
    const interval = setInterval(resetTasksAtMidnight, 60000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // Function to add todo
  const addTodo = (todo) => {
    setTodoList([...todoList, todo]);
    toast.success("Todo added!");
  };

  // Function to delete todo
  const deleteTodo = (taskToDelete) => {
    setTodoList((prevTasks) =>
      prevTasks.filter((task) => task !== taskToDelete)
    );
    toast.success("Task deleted!");
  };

  // Function to mark todo as completed
  const completeTodo = (todo) => {
    const updatedList = todoList.map((task) =>
      task === todo ? { ...task, completed: true } : task
    );
    setTodoList(updatedList);
    toast.success("Task completed!");
  };

  // Return with children
  return (
    <TodoContext.Provider
      value={{ todoList, addTodo, deleteTodo, completeTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
