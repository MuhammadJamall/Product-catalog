import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../store/taskSlice";
import TaskCard from "../components/TaskCard";

const TaskListPage = () => {
  const dispatch = useDispatch();

  const { items: tasks, status } = useSelector((state) => state.tasks);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteTask(id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    },[dispatch]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <h2>Task List</h2>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default TaskListPage;