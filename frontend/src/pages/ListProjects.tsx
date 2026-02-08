import { useEffect, useState } from "react";
import { handleListProjects } from "../features/projects/api/listProjects";
import type { ProjectListValues } from "../features/projects/project";
import { Navigate } from "react-router-dom";
import AddProjectForm from "./AddProject";
import { Loader2 } from "lucide-react";
import { Layout } from "../components/Layout";


export const ProjectList = () => {
    const [listProjects, setListProjects] = useState<ProjectListValues[] | []>([])
    const [isLoading, setIsLoading] = useState(false)
    const [addProject, setAddProject] = useState(false)

    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            handleListProjects(setListProjects, setIsLoading)
        }
        return () => { isMounted = false }
    }, [])
    return (
        isLoading ? <Loader2 /> : <>
            {addProject &&
                <div className='w-screen flex items-center bg-white/30 backdrop-blur-xs h-screen absolute z-10'>
                    <div className='w-full'><AddProjectForm onclick={setAddProject} /></div>
                </div>}
            <Layout>
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                            <p className="text-gray-500 mt-1">Manage and track all your ongoing initiatives.</p>
                        </div>
                        <button
                            onClick={() => { setAddProject(true) }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
                            + New Project
                        </button>
                    </div>

                    {/* Project Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listProjects?.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => <Navigate to={`/projects/${project.id}`} />}
                                className="group bg-white border flex flex-col justify-between border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
                            >
                                {/* Subtle accent hover effect */}
                                <div className="absolute top-0 left-0 w-1 h-full  bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="">
                                
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'INCOMPLETE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                    <div className="flex flex-col justify-center items-center ">
                                        <span className="text-gray-400 text-xs">{project.created_at}</span>
                                        <span className="text-sm text-gray-700 mt-2">{project.members_count} members</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                                    {project.description}
                                </p>
                            </div>
                                <div className="flex items-center flex-col justify-between border-t border-gray-50">
                                    <div className="flex justify-between px-1 w-full  mb-3 text-sm"> 
                                        <div>Task Completed</div>
                                        <span>{project.tasks_completed} of {project.tasks_count}</span>
                                    </div>  
                                    <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                            {project.owner.full_name?.charAt(0) || project.owner.username.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{project.owner.full_name || project.owner.username}</span>
                                    </div>
                                    <button
                                        onClick={() => { <Navigate to={`/projects/${project.id}`} /> }}
                                        className="text-blue-600 text-sm font-medium hover:underline">
                                        View Details →
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
};

