


// app/tasks/page.tsx
import { Metadata } from 'next';
import TasksComponent from './taskForm';

export const metadata: Metadata = {
  title: 'Task Management',
  description: 'Manage your tasks and assignments'
};

export default function TaskPage() {
  return <TasksComponent />;
}
