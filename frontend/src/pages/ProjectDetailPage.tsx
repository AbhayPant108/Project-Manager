import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '../components/Layout';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  handleProjectDetails, handleProjectTasks,
  type ProjectDetailsValues,
  type ProjectTasksInfo
} from '../features/projects/project';
import { taskSchema, type TaskFormValues } from '../schemas/task';
import {
  Plus,
  Users,
  Settings,
  Calendar,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { ta } from 'zod/v4/locales';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsValues | null>(null)
  const [projectTasks, setProjectTasks] = useState<ProjectTasksInfo | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      Promise.allSettled([handleProjectDetails(setProjectDetails, setIsLoadingDetails), handleProjectTasks(setProjectTasks, setIsLoadingTasks)])
    }
    return () => { isMounted = false }
  }, [])
  // Form for adding a quick task
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'TODO',
      priority: 'MEDIUM',
    }
  });

  const onAddTask = (data: TaskFormValues) => {
    console.log('Adding task to project', id, data);
    reset();
  };

  return (
    <Layout>
      {isLoadingDetails?<Loader2 className='relative top-1/2 left-1/2 ' />:<div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">{projectDetails?.title}</h2>
            <p className="max-w-2xl text-gray-500">
              {projectDetails?.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Users size={18} className="mr-2" />
              Members
            </Button>
            <Button variant="outline">
              <Settings size={18} />
            </Button>
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            Started: {projectDetails?.created_at}
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-2" />
            Owner: {projectDetails?.owner.full_name || projectDetails?.owner.username}
          </div>
          <div className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-medium">
            Active
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Tasks List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Tasks</h3>
              <span className="text-sm text-gray-500">{projectTasks?.tasks_completed} of {projectTasks?.tasks_count} completed</span>
            </div>

           {isLoadingTasks?<Loader2 className='relative top-1/2 left-1/2 ' />:<div className="space-y-2">
              {projectTasks?.tasks_list.map((task) => (
                <Card key={task.id} className="flex items-center justify-between p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-green-500">
                      <Circle size={20} />
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500">Due {task.due_date} • Assigned to</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">HIGH</span>
                  </div>
                </Card>
              ))}
              <Card className="flex items-center justify-between p-4 bg-gray-50 border-dashed">
                <div className="flex items-center space-x-4">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-400 line-through">Setup Dev Environment</h4>
                    <p className="text-sm text-gray-400">Completed 2 days ago</p>
                  </div>
                </div>
              </Card>
            </div>}
          </div>

          {/* Quick Add Task & Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Quick Add Task" />
              <form onSubmit={handleSubmit(onAddTask)} className="space-y-4">
                <Input
                  label="Task Title"
                  placeholder="What needs to be done?"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">Priority</label>
                    <select
                      className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500"
                      {...register('priority')}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                    <select
                      className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500"
                      {...register('status')}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" size="sm" className="w-full">
                  <Plus size={16} className="mr-1" />
                  Add Task
                </Button>
              </form>
            </Card>

            <Card>
              <CardHeader title="Project Members" />
              <div className="space-y-3">
                <div key={projectDetails?.owner.id} className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {projectDetails?.owner.full_name?.[0] || projectDetails?.owner.username[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{projectDetails?.owner.full_name || projectDetails?.owner.username} (Owner)</span>
                </div>
                {projectDetails?.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {member.full_name?.[0] || member.username[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{member.full_name || member.username}</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600">
                  Invite Member
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>}
    </Layout>
  );
};
