import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../store/authSlice";

const TaskCard = ({ task, onDelete }) => {
  const navigate = useNavigate();
  const role = useSelector(selectRole);

  const handleView = useCallback(() => {
    navigate(`/tasks/${task.id}`);
  }, [navigate, task.id]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", margin: "10px 0" }}>
      <h3>{task.title}</h3>

      <p>{task.description || "No description"}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Due:</strong> {task.due_date || "N/A"}</p>
      <p><strong>Assigned To:</strong> {task.assigned_to}</p>

      <button onClick={handleView}>View</button>
      {role === 'admin' && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default TaskCard;