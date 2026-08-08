import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../store/taskSlice";
import { useNavigate } from "react-router-dom";

const CreateTaskForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
    assigned_to: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.assigned_to) {
      newErrors.assigned_to = "Assigned user is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(
        createTask({
          ...formData,
          assigned_to: Number(formData.assigned_to),
          due_date: formData.due_date || null,
        })
      ).unwrap();

      navigate("/tasks");
    } catch (err) {
      console.error(err);
      if (err?.detail) {
        setErrors({ api: JSON.stringify(err.detail) });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <p>{errors.title}</p>}

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <input
        name="assigned_to"
        placeholder="Assigned User ID"
        value={formData.assigned_to}
        onChange={handleChange}
      />
      {errors.assigned_to && <p>{errors.assigned_to}</p>}

      <button type="submit">Create Task</button>

      {errors.api && <p>{errors.api}</p>}
    </form>
  );
};

export default CreateTaskForm;