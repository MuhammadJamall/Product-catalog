import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskByID,
  updateTask,
  deleteTask,
} from "../store/taskSlice";
import { useParams, useNavigate } from "react-router-dom";
import { selectRole } from "../store/authSlice";

const TaskDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector(selectRole);

  const { selectedTask, status, error } = useSelector((state) => state.tasks);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
    assigned_to: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchTaskByID(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        status: selectedTask.status || "todo",
        due_date: selectedTask.due_date || "",
        assigned_to: selectedTask.assigned_to || "",
      });
    }
  }, [selectedTask]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(
        updateTask({
          id,
          ...formData,
          assigned_to: Number(formData.assigned_to),
          due_date: formData.due_date || null,
        })
      ).unwrap();

      navigate("/tasks");
    } catch (err) {
      if (err?.detail) {
        setErrors({ api: JSON.stringify(err.detail) });
      }
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteTask(id));
    navigate("/tasks");
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!selectedTask) return <p>No task found</p>;

  return (
    <div>
      {!isEditing ? (
        <>
          {/* VIEW MODE */}
          <h2>{selectedTask.title}</h2>
          <p>{selectedTask.description}</p>
          <p>Status: {selectedTask.status}</p>
          <p>Due: {selectedTask.due_date || "N/A"}</p>
          <p>Assigned To: {selectedTask.assigned_to}</p>

          {(role === 'manager' || role === 'admin') && (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
          {role === 'admin' && (
            <button onClick={async () => {
              if (!window.confirm('Delete this task?')) return;
              try {
                await dispatch(deleteTask(id)).unwrap();
                alert('Task deleted');
                navigate('/tasks');
              } catch (err) {
                const msg = typeof err === 'string' ? err : err?.detail || err?.message || 'Delete failed';
                alert(msg);
              }
            }}>Delete</button>
          )}
        </>
      ) : (
        (role === 'manager' || role === 'admin') ? (
          <>
            {/* EDIT MODE */}
            <form onSubmit={handleUpdate}>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p>{errors.title}</p>}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <input
                type="date"
                name="due_date"
                value={formData.due_date || ""}
                onChange={handleChange}
              />

              <input
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
              />
              {errors.assigned_to && <p>{errors.assigned_to}</p>}

              <button type="submit">Update Task</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>

              {errors.api && <p>{errors.api}</p>}
            </form>
          </>
        ) : (
          <p>You do not have permission to edit this task.</p>
        )
      )}
    </div>
  );
};

export default TaskDetailPage;