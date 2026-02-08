import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Loader,
  Loader2
} from 'lucide-react';
import {type DashBoardValues,handleDashboard } from '../features/users/user';
import AddProjectForm from './AddProject';

// Mock data for demonstration

const mockProjects = [
  { id: '1', title: 'Website Redesign', description: 'Revamp the corporate website', members: 4, tasksDone: 12, totalTasks: 20 },
  { id: '2', title: 'Mobile App', description: 'Build a React Native app', members: 3, tasksDone: 5, totalTasks: 15 },
  { id: '3', title: 'Marketing Campaign', description: 'Q1 Social media push', members: 2, tasksDone: 8, totalTasks: 10 },
];

const mockTasks = [
  { id: 't1', title: 'Fix Navbar Bug', project: 'Website Redesign', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2024-03-25' },
  { id: 't2', title: 'Design Login Flow', project: 'Mobile App', status: 'TODO', priority: 'MEDIUM', dueDate: '2024-03-26' },
  { id: 't3', title: 'Write Blog Post', project: 'Marketing Campaign', status: 'DONE', priority: 'LOW', dueDate: '2024-03-24' },
];

export const DashboardPage: React.FC = () => {
  const [dashboardValues, setDashboardValues] = useState<DashBoardValues|null>(null);
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false)
  const [addProject,setAddProject] = useState(false)
  
  useEffect(() => {
    let isMounted = true; // 1. Track if component is still on screen
    const fetchProjects = async () => {
      // Only call if still mounted
      if (isMounted) {
        await handleDashboard(setDashboardValues, setIsLoading);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false; // 2. Cleanup: stop updates if user leaves page
    };
  }, []); // 3. Re-run whenever the query (owned/updated) changes
console.log(dashboardValues);



  return (
    <>
    {addProject && 
        <div className='w-screen flex items-center bg-white/30 backdrop-blur-xs h-screen absolute z-10'>
          <div className='w-full'><AddProjectForm onclick={setAddProject} /></div>
        </div>}
    <Layout>
      {isLoading?<Loader2 className='relative top-1/2 left-1/2 ' />:<div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {dashboardValues?.name}!</h2>
            <p className="text-gray-500">Here's what's happening with your projects today.</p>
          </div>
          <Button onClick={()=>setAddProject(true)} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>New Project</span>
          </Button>
        </div>
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center space-x-4 border-l-4 border-blue-500">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold">{dashboardValues?.stats.active_projects}</p>
            </div>
          </Card>
          <Card className="flex items-center space-x-4 border-l-4 border-yellow-500">
            <div className="rounded-full bg-yellow-50 p-3 text-yellow-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
              <p className="text-2xl font-bold">{dashboardValues?.stats.pending_tasks}</p>
            </div>
          </Card>
          <Card className="flex items-center space-x-4 border-l-4 border-green-500">
            <div className="rounded-full bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{dashboardValues?.stats.completed_tasks}</p>
            </div>
          </Card>
        </div>

        {/* Projects Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">My Projects</h3>
            <div className="flex w-64 items-center space-x-2">
              <Input
                placeholder="Filter projects..."
                className="h-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading?<Loader />:dashboardValues?.projects?.map((project) => (
              <Card key={project.id} className="group relative flex flex-col justify-between hover:shadow-md transition-shadow">
                <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
                <CardHeader
                  title={project.title}
                  subtitle={project.description}
                />
                <div className="mt-4 space-y-3 h-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">
                      {project.tasks_count !== 0?Math.round((project.tasks_completed / project.tasks_count) * 100):0}%
                    </span>
                  </div>
                  <div className='mt-auto'>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${project.tasks_count !== 0?Math.round((project.tasks_completed / project.tasks_count) * 100):0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.members_count} members</span>
                    <span>{project.tasks_completed }/{project.tasks_count} tasks</span>
                  </div>
                </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tasks Section */}
        <section className="space-y-4">
          {dashboardValues?.tasks.length == 0?            
          <h3 className="text-xl font-semibold text-gray-900">No Tasks</h3>
          :<div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Assigned Tasks</h3>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                className="rounded-md border-gray-300 py-1 text-sm focus:ring-blue-500"
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Task</th>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardValues?.tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-gray-600">{}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{task.due_date}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          
          </div>}
        </section>
      </div>}
    </Layout>
    </>
  );
};
