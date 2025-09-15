'use client';
// import { useState, useEffect } from 'react';
// import UserProfile from '@/components/account/UserProfile';

// export default function AccountPage() {
//   const [userProfile, setUserProfile] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     // Fetch user profile from API or local storage
//     const fetchUserProfile = async () => {
//       // Replace with actual API call
//       const profile = await fakeApiCall();
//       setUserProfile(profile);
//     };

//     fetchUserProfile();
//   }, []);

//   const handleSaveProfile = (profile) => {
//     setUserProfile(profile);
//     setIsEditing(false);
//   };

//   if (!userProfile || isEditing) {
//     return (
//       <UserProfile userProfile={userProfile} userTypes={userTypes} onSave={handleSaveProfile} />
//     );
//   }

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>Name: {userProfile.name}</p>
//       <p>Email: {userProfile.email}</p>
//       <p>User Type: {userProfile.userType}</p>
//       <button onClick={() => setIsEditing(true)}>Edit Profile</button>
//     </div>
//   );
// }

import UserProfileDisplay from '@/components/account/EditUserProfile';

export default function AccountPage() {
  return <UserProfileDisplay />;
}
