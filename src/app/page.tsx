import { redirect } from 'next/navigation';

const RootLayout = () => {
  redirect('/chat');
  return null;
}

export default RootLayout;