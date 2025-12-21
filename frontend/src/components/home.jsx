import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Alert,
  Badge,
} from "reactstrap";
import TodoForm from "./todo-form";

const API_URL = "/api";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      setError("Failed to load todos. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/todos/${id}`, {
        is_complete: !currentStatus,
      });
      await getTodos();
      showNotification(
        !currentStatus ? "Todo marked complete! ✨" : "Todo marked incomplete!"
      );
    } catch (err) {
      showNotification("Failed to update todo.", "danger");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      await getTodos();
      showNotification("Todo deleted successfully!");
    } catch (err) {
      showNotification("Failed to delete todo.", "danger");
      console.error(err);
    }
  };

  const handleNewTodo = async (todo) => {
    try {
      await axios.post(`${API_URL}/todos`, todo);
      await getTodos();
      setModalOpen(false);
      showNotification("Todo added successfully! 🎯");
    } catch (err) {
      showNotification("Failed to add todo.", "danger");
      console.error(err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.is_complete;
    if (filter === "active") return !todo.is_complete;
    return true;
  });

  const completedCount = todos.filter((t) => t.is_complete).length;

  return (
    <>
      <Card className="shadow-sm mt-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <CardTitle tag="h1" className="mb-0">
                📝 My Todos
              </CardTitle>
              <small className="text-muted">
                {completedCount} of {todos.length} completed
              </small>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              color="success"
              className="rounded-pill"
            >
              ✨ Add Todo
            </Button>
          </div>

          {notification && (
            <Alert color={notification.type} className="alert-dismissible">
              {notification.message}
            </Alert>
          )}

          {error && <Alert color="danger">❌ {error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-3">Loading todos...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No todos yet! 🎯</h5>
              <p>Create your first todo to get started.</p>
            </div>
          ) : (
            <>
              <div className="mb-3 d-flex gap-2">
                <Button
                  outline
                  color="primary"
                  size="sm"
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All ({todos.length})
                </Button>
                <Button
                  outline
                  color="warning"
                  size="sm"
                  active={filter === "active"}
                  onClick={() => setFilter("active")}
                >
                  Active ({todos.filter((t) => !t.is_complete).length})
                </Button>
                <Button
                  outline
                  color="success"
                  size="sm"
                  active={filter === "completed"}
                  onClick={() => setFilter("completed")}
                >
                  Completed ({completedCount})
                </Button>
              </div>
              <ListGroup>
                {filteredTodos.map((todo) => (
                  <ListGroupItem key={todo._id} className="todo-item">
                    <div className="d-flex w-100 align-items-start gap-3">
                      <input
                        className="form-check-input mt-1"
                        type="checkbox"
                        onChange={() =>
                          handleToggleTodo(todo._id, todo.is_complete)
                        }
                        checked={todo.is_complete}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className={`mb-1 ${
                            todo.is_complete
                              ? "text-decoration-line-through text-muted"
                              : ""
                          }`}
                        >
                          {todo.title}
                        </h6>
                        <p className="mb-2 text-muted small">
                          {todo.description}
                        </p>
                        <div className="d-flex gap-2 align-items-center">
                          <Badge color="info">📅 {todo.due_date}</Badge>
                          {todo.is_complete && (
                            <Badge color="success">✅ Done</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        close
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="text-danger"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          ✨ Add New Todo
        </ModalHeader>
        <ModalBody>
          <TodoForm saveTodo={handleNewTodo} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default Home;
