// 'use client'
// import { useState, useRef, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import { FileText, User, LogOut, Settings, CreditCard, ChevronRight, DollarSign, HeadphonesIcon } from 'lucide-react'
// import { useAuth } from '@/components/auth/AuthContext'

// export default function TopNav() {
//   const pathname = usePathname()
//   const { user, logout } = useAuth()
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const menuRef = useRef(null)
//   const buttonRef = useRef(null)

//   // TODO: Replace with actual API call
//   const subscriptionStatus = {
//     isPaid: true,
//     credits: 100,
//     plan: 'Pro'
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current && 
//         !menuRef.current.contains(event.target) &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setShowProfileMenu(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleProfileClick = () => {
//     setShowProfileMenu(!showProfileMenu)
//   }

//   return (
//     <div className="w-full bg-[#2A2B3D] text-white h-16">
//       <div className="container mx-auto px-4 h-full">
//         <div className="flex items-center justify-between h-full">
//           <Link href="/" className="text-xl font-semibold">
//             WorkWise
//           </Link>

//           <div className="flex items-center space-x-4">
//             {/* Always visible navigation items */}
//             <Link
//               href="/pricing"
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                 pathname === '/pricing' ? 'bg-indigo-600' : 'hover:bg-gray-700'
//               }`}
//             >
//               <DollarSign size={18} />
//               <span>Pricing Plans</span>
//             </Link>

//             {user && (
//               <Link
//                 href="/career-coach"
//                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                   pathname === '/career-coach' ? 'bg-indigo-600' : 'hover:bg-gray-700'
//                 }`}
//               >
//                 <HeadphonesIcon size={18} />
//                 <span>Career Coach</span>
//               </Link>
//             )}

//             {user ? (
//               <>
//                 <Link
//                   href="/dashboard"
//                   className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                     pathname === '/dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
//                   }`}
//                 >
//                   <FileText size={18} />
//                   <span>My Applications</span>
//                 </Link>
                
//                 <div className="relative">
//                   <button
//                     ref={buttonRef}
//                     onClick={handleProfileClick}
//                     onMouseEnter={() => setShowProfileMenu(true)}
//                     className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                       pathname === '/profile' || showProfileMenu ? 'bg-indigo-600' : 'hover:bg-gray-700'
//                     }`}
//                   >
//                     <User size={18} />
//                     <span>{user.email}</span>
//                   </button>

//                   {showProfileMenu && (
//                     <div
//                       ref={menuRef}
//                       onMouseLeave={() => !buttonRef.current.contains(document.activeElement) && setShowProfileMenu(false)}
//                       className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
//                     >
//                       {/* User Info Section */}
//                       <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-600 text-white rounded-t-lg">
//                         <div className="flex items-center space-x-3">
//                           <div className="bg-white/20 p-2 rounded-full">
//                             <User size={24} />
//                           </div>
//                           <div>
//                             <div className="font-medium">{user.email}</div>
//                             <div className="text-sm text-white/80">Manage your account</div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Subscription Status */}
//                       <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-sm font-medium text-gray-900">
//                             {subscriptionStatus.isPaid ? 'Pro Plan' : 'Free Plan'}
//                           </span>
//                           <span className={`text-xs px-2 py-1 rounded-full font-medium ${
//                             subscriptionStatus.isPaid 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-gray-200 text-gray-800'
//                           }`}>
//                             {subscriptionStatus.isPaid ? 'Active' : 'Free'}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="text-sm text-gray-600">Available Credits</div>
//                           <div className="text-sm font-medium text-indigo-600">
//                             {subscriptionStatus.credits} credits
//                           </div>
//                         </div>
//                       </div>

//                       {/* Menu Items */}
//                       <div className="py-1">
//                         <Link
//                           href="/account"
//                           className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 group"
//                         >
//                           <div className="flex items-center">
//                             <Settings size={16} className="mr-3 group-hover:text-indigo-600" />
//                             Account Settings
//                           </div>
//                           <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-600" />
//                         </Link>
//                         <Link
//                           href="/subscription"
//                           className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 group"
//                         >
//                           <div className="flex items-center">
//                             <CreditCard size={16} className="mr-3 group-hover:text-indigo-600" />
//                             Manage Subscription
//                           </div>
//                           <ChevronRight size={14} className="text-gray-400 group-hover:text-indigo-600" />
//                         </Link>
//                       </div>

//                       {/* Logout Section */}
//                       <div className="border-t border-gray-100 mt-1">
//                         <button
//                           onClick={logout}
//                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 group"
//                         >
//                           <LogOut size={16} className="mr-3" />
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   href="/auth"
//                   className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                     pathname === '/auth' ? 'bg-indigo-600' : 'hover:bg-gray-700'
//                   }`}
//                 >
//                   <User size={18} />
//                   <span>Login</span>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
