import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TodoApp from './index';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true,
  })
);

describe('TodoApp Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders without crashing', () => {
    render(<TodoApp />);
    expect(screen.getByText(/Task List/i)).toBeInTheDocument();
  });

  test('displays no tasks message when task list is empty', async () => {
    render(<TodoApp />);
    expect(screen.getByText(/No tasks yet. Add some to get started!/i)).toBeInTheDocument();
  });

  test('adds a new task', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(/Enter new task.../i);
    const addButton = screen.getByText(/Add/i);

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // One for fetchTasks and one for addTask
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/'), expect.objectContaining({ method: 'POST' }));
  });

  test('deletes a task', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Task 1', completed: false }]),
        ok: true,
      })
    );

    render(<TodoApp />);
    await waitFor(() => expect(screen.getByText(/Task 1/i)).toBeInTheDocument());

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // One for fetchTasks and one for deleteTask
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'DELETE' }));
  });

  test('updates a task', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, title: 'Task 1', completed: false }]),
        ok: true,
      })
    );

    render(<TodoApp />);
    await waitFor(() => expect(screen.getByText(/Task 1/i)).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue(/Task 1/i);
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.blur(input);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // One for fetchTasks and one for updateTask
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'PUT' }));
  });
});