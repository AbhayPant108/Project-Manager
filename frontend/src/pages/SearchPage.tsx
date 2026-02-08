import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { type UserList } from '../features/users/user'; 
import Api,{AxiosError} from '../api/axios'
import { useDebounceValue } from 'usehooks-ts';
import { Input } from '../components/Input';
import { type Response } from '../types/response';
import {
  Search as SearchIcon,
  Loader,
  UserPlus,
  UserCheck,
  Mail,
  User,

} from 'lucide-react';



const mockUsers = [
  { id: '1', name: 'John Doe', username: 'johnd', email: 'john@example.com', isFriend: false },
  { id: '2', name: 'Jane Smith', username: 'janes', email: 'jane@example.com', isFriend: true },
  { id: '3', name: 'Mike Ross', username: 'mross', email: 'mike@example.com', isFriend: false },
  { id: '4', name: 'Harvey Specter', username: 'harvey', email: 'harvey@example.com', isFriend: false },
];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(Boolean)
  const [users, setUsers] = useState<UserList[]>([])
  const [debounceQuery,setDebounceQuery] = useDebounceValue('',1000)

  async function getUsers(query?:string,active?:Boolean) {
      try {
 
        const res = query ? await Api.get<Response<UserList[]>>(`users/?search-name=${query}`) : await Api.get<Response<UserList[]>>(`users/`)
        const usersData = res.data
        console.log(usersData);

        if (usersData && active) {
          setUsers(usersData.data)
        }
      } catch (error) {
        const axiosError = error as AxiosError<Response<undefined>>
        console.log('Error:', axiosError?.response?.data);
      } finally {
        setIsLoading(false)
      }
    }
  useEffect(() => {
    let active = true
    setIsLoading(true)
    getUsers(debounceQuery,active)
    return () => {
      active = false
    }
  }, [debounceQuery])
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Search Users</h2>
          <p className="text-gray-500">Find and connect with other project managers.</p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by name or username..."
            className="pl-10"
            value={query}
            onChange={(e) => {setQuery(e.target.value)
                            setDebounceQuery(e.target.value)}
            }
          />
        </div>

        {isLoading?<Loader />:<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {users.length > 0 ? (
            users.map((user) => (
              <Card key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                   {
                   !user.avatar?<User />:<img src={user.avatar} alt="no avatar" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700" />
                   }
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.full_name || user.username}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" title="Send Email">
                    <Mail size={18} />
                  </Button>
                  {false ? (
                    <Button variant="outline" size="sm" disabled>
                      <UserCheck size={18} className="mr-2" />
                      Friends
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm">
                      <UserPlus size={18} className="mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-gray-500">
              No users found matching "{query}"
            </div>
          )}
        </div>
        }
      </div>
    </Layout>
  );
};
