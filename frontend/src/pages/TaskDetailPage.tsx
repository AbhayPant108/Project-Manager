import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Tag, 
  Calendar,
  MessageSquare
} from 'lucide-react';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="space-y-6">
        <Link to="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Finalize Mockups for Home Page</h2>
            <div className="flex space-x-2 text-sm">
              <span className="text-gray-500">in project</span>
              <Link to="/projects/1" className="font-medium text-blue-600 hover:underline">Website Redesign</Link>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Edit Task</Button>
            <Button variant="danger">Delete</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Description" />
              <p className="text-gray-700 leading-relaxed">
                We need to finalize the high-fidelity mockups for the home page, 
                ensuring all feedback from the initial stakeholder review has been incorporated. 
                Focus specifically on the mobile responsiveness of the hero section and the 
                accessibility of the navigation menu.
              </p>
            </Card>

            <section className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <MessageSquare size={20} className="mr-2" />
                Comments
              </h3>
              <div className="space-y-4">
                <Card className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Sarah</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-700">I've uploaded the latest drafts to the design folder.</p>
                </Card>
                <div className="flex space-x-3">
                  <Input placeholder="Write a comment..." className="flex-1" />
                  <Button>Send</Button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Task Details" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-2" />
                    Status
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-700">IN PROGRESS</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Tag size={16} className="mr-2" />
                    Priority
                  </div>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-700">HIGH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <User size={16} className="mr-2" />
                    Assigned to
                  </div>
                  <span className="font-medium">Sarah Miller</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    Due Date
                  </div>
                  <span className="font-medium">March 25, 2024</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button variant="primary" className="w-full">
                  Mark as Done
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
