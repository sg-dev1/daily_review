'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserLoginDtoType } from '@repo/shared';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const loginFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

const postLogin = async (data: UserLoginDtoType) => {
  const response = await axios.post('', data);
};

const LoginForm = () => {
  // Access the client
  //const queryClient = useQueryClient();

  // Mutations
  /*
  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      console.log('success - you are logged in');
      // Invalidate and refetch
      //queryClient.invalidateQueries({ queryKey: ['login'] })
    },
    onError: () => {
      console.error('error - login failed');
    },
  });
  */

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
    console.log(values);

    //mutation.mutate(values);
  }

  return (
    <Form {...form}>
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
