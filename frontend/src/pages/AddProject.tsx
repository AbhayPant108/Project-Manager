import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, TextArea } from '../components/Input';
import { XIcon } from 'lucide-react';
import { handleCreateProject, projectSchema ,type ProjectFormValues } from '../features/projects/project';





export default function AddProjectForm({onclick}:{onclick:(args:boolean)=>void}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        access:'PRIVATE',
        status:'INCOMPLETE'
    }
  });

  const onSubmit = (data: ProjectFormValues) => {
    Promise.resolve(handleCreateProject<ProjectFormValues>(data))
  };

  return (
    <div className=" flex items-center justify-center">
      {/* Glassmorphic Container */}
      
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full relative bg-white max-w-lg  border border-white/20 p-8 rounded-3xl shadow-2xl space-y-6"
      >
        <XIcon 
        onClick={()=>onclick(false)}
        className='absolute top-8 right-8 cursor-pointer hover:bg-white/50 ' />
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold  tracking-tight">New Project</h2>
          <p className=" text-sm">Fill in the details to showcase your work.</p>
        </div>

        <div className="space-y-4">
          {/* Title Field */}
          <div className="flex flex-col gap-1.5">
            <Input
                label='Project Title' 
              {...register("title")}
              placeholder="E.g. Portfolio Website"
              className="  rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-600"
            />
            {errors.title && <span className="text-xs text-red-400 ml-1">{errors.title.message}</span>}
          </div>

          

          {/* Status Select */}
          <div className="flex w-full gap-1.5  ">
            <div className='flex flex-col w-full ' >
            <label className="text-sm font-medium text-gray ml-1">Status</label>
            <select 
              {...register("status")}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all appearance-none"
            >
              <option value="INCOMPLETE">Active 🚀</option>
              <option value="COMPLETED">Completed ✅</option>
              <option value="IN_PROGRESS">On Hold ⏸️</option>
            </select>
            </div>
             <div className='flex w-full flex-col'>
            <label className="text-sm font-medium text-gray ml-1">Access</label>
            <select 
              {...register("access")}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all appearance-none"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="FRIENDS_ONLY">Only Friends</option>
            </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <TextArea
                label='Description' 
              {...register("description")}
              rows={4}
              placeholder="Tell us about the tech stack and features..."
              className=" h-25 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-600 resize-none"
            />
            {errors.description && <span className="text-xs text-red-400 ml-1">{errors.description.message}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? "Creating Project..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}