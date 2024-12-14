import { Metadata } from 'next';
import LoginForm from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '80vh',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '20rem',
          textAlign: 'center',
        }}
      >
        {/* <h1>Login</h1> */}
        <LoginForm />
      </div>
    </>
  );
}
