import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { useForm } from 'react-hook-form';
import { type UserProfileFormValues, userProfileSchema } from '../schemas/profile';
import {
  User,
  Mail,
  Shield,
  LogOut,
  Camera,
  Briefcase,
  Loader2
} from 'lucide-react';
import { type Response } from '../types/response';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { AxiosError } from '../api/axios';

type UserProfileDetails = UserProfileFormValues & {
  avatar:string|null,
  created_at:string,
  updated_at:string,
  full_name:string,
  username:string,
  total_projects:string,
  total_tasks:number,
  friends_count:number,
  date_joined:string
} 

export const ProfilePage: React.FC = () => {
  const [userData, setuserData] = useState<UserProfileDetails | null>(null)
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const [profileExists, setProfileExists] = useState(false)
  const { handleSubmit, register, formState: { errors } } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
  })


  useEffect(() => {
    setIsLoading(true)
    let active = true
    const getProfile = async () => {
      try {
        const response = await api.get<Response<UserProfileDetails>>('users/me/')
        if (response.status < 400 && active) {
          setuserData(response.data.data)
          setIsLoading(false)
          setProfileExists(true)
        }
      } catch (error) {
        const axiosError = error as AxiosError<Response<undefined>>
        console.log(axiosError.response?.data.message);
        setProfileExists(false)
      }
    }
    getProfile()
    return () => { active = false }
  }, [])
  const handleProfile = async (data: UserProfileFormValues) => {
    try {
      const sentdata = {
     
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
          phone_number: data.phone_number

      }
      console.log('Sent');

      const response = profileExists ? await api.patch('users/me/', sentdata) : await api.post('users/me/', sentdata)
      if (response.status < 400) {
        setuserData(response.data.data)
        setIsLoading(false)
      }
    } catch (error) {
      const axiosError = error as AxiosError<Response<undefined>>
      console.log(axiosError.response?.data?.message);
    }
  }


  return (

    <Layout >
      {isLoading?<Loader2 className='relative top-1/2 left-1/2 ' />:<div className={`space-y-8 h-full ${profileExists ? 'block' : 'flex'}`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <p className="text-gray-500">Manage your account settings and preferences.</p>
        </div>
        {
          !profileExists ?
            <div className=' self-center '>
              <Button className='self-center' onClick={() => setProfileExists(true)}>Create Profile</Button>
            </div> :
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Avatar and Basic Info */}
              <div className="space-y-6">
                <Card className="text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <div className="flex h-32 w-full items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
                      {
                      userData?.avatar ?<img src={userData.avatar}  
                      alt="Error" />:userData?.first_name[0]?.toUpperCase()
                      }
                    </div>
                    <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900">{userData?.full_name}</h3>
                    <p className="text-sm text-gray-500">{userData?.username}</p>
                  </div>
                  <div className="mt-6 flex justify-around border-t border-gray-100 pt-6">
                    <div>
                      <p className="text-lg font-bold">{userData?.total_projects || 0}</p>
                      <p className="text-xs text-gray-500 uppercase">Projects</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{userData?.total_tasks||0}</p>
                      <p className="text-xs text-gray-500 uppercase">Tasks</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{userData?.friends_count}</p>
                      <p className="text-xs text-gray-500 uppercase">Friends</p>
                    </div>
                  </div>
                </Card>

                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>

              {/* Account Settings Form */}

              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit(handleProfile)}>
                  <Card>
                    <CardHeader title="General Information" />
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Remove 'value'. Hook Form handles it via 'register' */}
                        <Input
                          label="First Name"
                          defaultValue={userData?.first_name}
                          {...register('first_name')}
                        />
                        <Input
                          label="Last Name"
                          placeholder="Pant"
                          defaultValue={userData?.last_name}
                          {...register('last_name')}
                        />
                      </div>

                      <Input
                        label="Phone Number"
                        type='text'
                        defaultValue={userData?.phone_number}
                        disabled={userData?.phone_number?true:false}
                        {...register('phone_number')}
                      />

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <TextArea
                          defaultValue={userData?.bio}
                          className="flex min-h-25 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          placeholder="Tell us about yourself..."
                          {...register('bio')}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button className=' cursor-pointer '>Save Changes</Button>
                      </div>
                    </div>
                  </Card>
                </form>
                <Card>
                  <CardHeader title="Security" subtitle="Manage your password and security settings" />
                  <div className="space-y-4">
                    <Button variant="outline">Change Password</Button>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Shield className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button className="h-6 w-11 rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300">
                        <div className="h-4 w-4 rounded-full bg-white" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
        }
      </div>}
    </Layout>
  );
};
