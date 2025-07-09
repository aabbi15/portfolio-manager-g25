
// Define the main App component
// Check if the user is authenticated, if so, redirect to profile
// Render the login card with an image and a login button

'use client'

import React from 'react';
import { Button, Card, Flex, Typography } from 'antd';

import { useUser } from '@auth0/nextjs-auth0/client';

import { redirect } from 'next/navigation';


const cardStyle = {
  width: 620,
};
const imgStyle = {
  display: 'block',
  width: 273,
};
function App()  {

    const tempy = useUser();

    // console.log(tempy);

    if(tempy.user){
      redirect('/profile');
    }

return(
    <div className='flex justify-center items-center h-screen'>
  <Card
    hoverable
    style={cardStyle}
    styles={{
      body: {
        padding: 0,
        overflow: 'hidden',
      },
    }}
  >
    <Flex justify="space-between">
      <img
        alt="avatar"
        src="login.png"
        style={imgStyle}
      />
      <Flex
        vertical
        align="flex-end"
        justify="space-between"
        style={{
          padding: 32,
        }}
      >
        <Typography.Title level={3}>
          Login now to start using Investalyse <span className='text-xs text-green-600 '>by Lief</span>
        </Typography.Title>
        <Button type="primary" href="/api/auth/login" target="_blank">
          <span className='text-xl font-bold'> Join </span>
        </Button>
      </Flex>
    </Flex>
  </Card>

    </div>
)
};
export default App;