'use client';

import { userTypes } from './EditUserProfile';

export default function UserProfileDisplay({ userProfile, onEdit }) {
  console.log('userProfile:', userProfile);
  return (
    <div className='mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h1 className='mb-4 text-2xl font-bold'>User Profile</h1>
      <div className='mb-4'>
        <label className='block text-gray-700'>Email:</label>
        <p className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm sm:text-sm'>
          {userProfile.email}
        </p>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700'>User Type:</label>
        <p className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm sm:text-sm'>
          {userTypes[userProfile.user_type]}
        </p>
      </div>
      <button
        onClick={onEdit}
        className='w-full rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
      >
        Edit
      </button>
    </div>
  );
}
