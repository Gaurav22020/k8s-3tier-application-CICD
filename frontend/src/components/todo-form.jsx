import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormText, Spinner } from "reactstrap";

const TodoForm = ({ saveTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await saveTodo({ title, description, due_date: dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() && description.trim() && dueDate;

  return (
    <Form>
      <FormGroup>
        <Label for="title">
          <strong>📌 Title</strong>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="What needs to be done?"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          invalid={!!errors.title}
          maxLength="100"
        />
        {errors.title && (
          <FormText color="danger">{errors.title}</FormText>
        )}
        <FormText color="muted">{title.length}/100 characters</FormText>
      </FormGroup>

      <FormGroup>
        <Label for="description">
          <strong>📝 Description</strong>
        </Label>
        <Input
          id="description"
          name="description"
          placeholder="Add more details about your task..."
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          invalid={!!errors.description}
          rows="4"
          maxLength="500"
        />
        {errors.description && (
          <FormText color="danger">{errors.description}</FormText>
        )}
        <FormText color="muted">{description.length}/500 characters</FormText>
      </FormGroup>

      <FormGroup>
        <Label for="duedate">
          <strong>🗓️ Due Date</strong>
        </Label>
        <Input
          id="duedate"
          name="duedate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          invalid={!!errors.dueDate}
        />
        {errors.dueDate && (
          <FormText color="danger">{errors.dueDate}</FormText>
        )}
      </FormGroup>

      <Button
        color="primary"
        onClick={onSubmit}
        disabled={!isFormValid || loading}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner size="sm" /> Saving...
          </>
        ) : (
          "✨ Save Todo"
        )}
      </Button>
    </Form>
  );
};

export default TodoForm;
