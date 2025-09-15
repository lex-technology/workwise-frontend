'use client';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '@/lib/supabase';
import UserProfileDisplay from './UserProfileDisplay';

export const userTypes = {
  student: 'Student',
  careerTransitionProfessional: 'Career Transition Professional',
  jobSeeker: 'Job Seeker',
  industrySwitchProfessional: 'Industry Switch Professional',
  careerGrowthProfessional: 'Career Growth Professional',
};

export default function UserProfile({}) {
  const { user, userProfile, setUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: userProfile ? userProfile.email : user.email,
    userType: userProfile ? userProfile.user_type : Object.keys(userTypes)[0],
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.keys(userTypes).includes(formData.userType)) {
      console.error('Invalid user type:', formData.userType);
      return;
    }

    try {
      const userProfileData = {
        user_id: user.id,
        email: formData.email,
        user_type: formData.userType,
      };
      console.log('User profile data to be upserted:', userProfileData);

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(userProfileData, { onConflict: 'user_id' })
        .select();

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        console.log('Profile updated successfully');
        setUserProfile(data[0]);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (userProfile && !isEditing) {
    return <UserProfileDisplay userProfile={userProfile} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <div className='mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h1 className='mb-4 text-2xl font-bold'>{userProfile ? 'Edit Profile' : 'Create Profile'}</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4' style={{ display: 'none' }}>
          <label className='block text-gray-700'>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            required
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>User Type:</label>
          <select
            name='userType'
            value={formData.userType}
            onChange={handleInputChange}
            required
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm'
          >
            {Object.entries(userTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='w-full rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
        >
          Save
        </button>
      </form>
    </div>
  );
}
