"use client"
import { handleError, handleSuccess } from "@/utils";
import axios from "axios";
import { AlignCenter, AlignLeft, AlignRight, PaintBucket, Trash2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";

export default function TodoApp() {
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [fetchTodo, setFetchTodo] = useState([]);
  const descriptionRef = useRef(null);

  const handleChange = (e) => {
    setTodoData({
      ...todoData,
      [e.target.name]: e.target.value,
    });
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const formatColor = (color) => {
    document.execCommand("foreColor", false, color);
  };

  const formatAlignment = (alignment) => {
    document.execCommand("justify" + alignment, false, null);
  };

  const handleDescriptionChange = () => {
    setTodoData({
      ...todoData,
      description: descriptionRef.current.innerHTML,
    });
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todoData.title.trim() || !todoData.description.trim()) {
      handleError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("https://todos-backend-cehi.onrender.com/api/savetodo", {
        ...todoData,
        date: currentDate,
      });
      console.log("Todo data saved:", response.data);

      setTodoData({
        title: "",
        description: "",
        date: "",
      });

      handleSuccess ("todo add sucessfully");

      fetchData();
    } catch (err) {
      handleError("Error in saving todo:", err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("https://todos-backend-cehi.onrender.com/api/fetchdata");
      if (response.status === 200) {
        setFetchTodo(response.data);
        // setTodoData ("");
      }
    } catch (err) {
      console.log("Error in fetching todo data:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://todos-backend-cehi.onrender.com/api/deletetodo/${id}`);
      if (response.status === 200) {
        handleSuccess("Todo deleted successfully");
        setFetchTodo(fetchTodo.filter(todo => todo.id !== id));
        fetchData ();
      }
    } catch (err) {
      console.log("Error deleting todo:", err);
      handleError ("something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/5 bg-white shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">TODO</h1>
        </div>
        {fetchTodo.map((item) => (
  <li key={item._id} className="bg-white p-4 mb-3 rounded-lg shadow hover:shadow-lg transition duration-300 border-l-4 border-blue-500 list-none">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold text-gray-800"><strong>{item.title}</strong></p>
        <p className="text-gray-600"><strong></strong><span dangerouslySetInnerHTML={{ __html: item.description }}></span></p>
        <br />
        <p className="text-sm text-gray-500 italic"><strong>{item.date}</strong></p>
      </div>
      <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white p-1 px-2 rounded cursor-pointer">
        <Trash2 size={20} />
      </button>
    </div>
  </li>
))}
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={todoData.title}
            className="w-full p-2 mb-2 border-1 rounded-[10px]"
          />
          <br />
          <br />

          <div className="flex gap-3.5 mb-2">
            <button onClick={() => formatText("bold")} className="p-1 bg-gray-200 rounded w-8 cursor-pointer">B</button>
            <button onClick={() => formatText("italic")} className="p-1 bg-gray-200 rounded w-8 cursor-pointer">I</button>
            <button onClick={() => formatText("underline")} className="p-1 bg-gray-200 rounded w-8 cursor-pointer">U</button>
            <button onClick={() => formatAlignment("Left")} className="p-1 bg-gray-200 rounded cursor-pointer">
              <AlignLeft size={22} />
            </button>
            <button onClick={() => formatAlignment("Center")} className="p-1 bg-gray-200 rounded cursor-pointer">
              <AlignCenter size={22} />
            </button>
            <button onClick={() => formatAlignment("Right")} className="p-1 bg-gray-200 rounded cursor-pointer">
              <AlignRight size={22} />
            </button>
            <div className="relative flex items-center">
              <PaintBucket className="absolute left-2 text-gray-500" size={18} />
              <input type="color" onChange={(e) => formatColor(e.target.value)} className="h-8 w-10 cursor-pointer pl-6 rounded-4xl"/>
            </div>
          </div>

          <div
            ref={descriptionRef}
            contentEditable
            onInput={handleDescriptionChange}
            className="w-full p-2 border-1 rounded min-h-[200px] bg-white"
          ></div>
          <br />
          <button className="w-[15%] p-2 bg-blue-500 text-white rounded cursor-pointer mt-2" onClick={handleSubmit}>
            Add Todo
          </button>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
