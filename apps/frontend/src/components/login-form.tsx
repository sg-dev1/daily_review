'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserLoginDtoType } from '@repo/shared';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ErrorAlert from './alerts/ErrorAlert';

const loginFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

// TODO move this into some "api-client" module
const postLogin = async (data: UserLoginDtoType) => {
  // TODO - need to make this configurable
  const response = await axios.post('http://localhost:7777/auth/login', data);
  console.log('postLogin response', response);
  return response;
};

const LoginForm = () => {
  const [errorText, setErrorText] = useState('');

  // Access the client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data, variables, context) => {
      console.log(
        'success - you are logged in',
        data /* AxiosResponse object */,
        variables /* login dto */,
        context /* undefined */
      );
      setErrorText('');
    },
    onError: () => {
      console.warn('error - login failed');
      setErrorText('Login failed.');
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //console.log(values);

    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <ErrorAlert message={errorText} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>Fill in your username.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>Fill in your password.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
