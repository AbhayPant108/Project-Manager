import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema ,type LoginFormValues} from '../schemas/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader } from '../components/Card';
import { login as LoginSubmit } from '../api/auth.api';
export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // const onSubmit = async (data: LoginFormValues) => {
  //   // API call logic would go here
  //   console.log('Login attempt:', data);
  //   const res = await api.post('/login/')
  // };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader 
          title="Login to Project Manager" 
          subtitle="Enter your credentials to access your projects" 
        />
        <form onSubmit={handleSubmit(LoginSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="xyz@gmail.com  "
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
};
