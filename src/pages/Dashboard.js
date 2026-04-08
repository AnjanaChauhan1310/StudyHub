import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import { logout } from '../services/operations/authAPI'
import ConfirmationModal from '../components/common/ConfirmationModal'

const Dashboard = () => {
    const {loading:authLoading} = useSelector((state)=>state.auth)
    const {loading:profileLoading, user} = useSelector((state)=>state.profile)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [confirmationModal, setConfirmationModal] = useState(null)

    if (profileLoading || authLoading) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-richblack-900 scroll-smooth">
        
        {/* Mobile Dashboard Navigation Tabs - ROLE BASED */}
        <div className="md:hidden flex bg-richblack-800/80 backdrop-blur-md border-b border-richblack-700 py-3 px-4 overflow-x-auto gap-6 sticky top-0 z-[50] custom-scrollbar">
            <button 
                onClick={() => navigate("/dashboard/my-profile")}
                className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/my-profile" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
            >
                Profile
            </button>

            {user?.accountType === "Student" && (
                <>
                <button 
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/enrolled-courses" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
                >
                    Enrolled
                </button>
                <button 
                    onClick={() => navigate("/dashboard/cart")}
                    className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/cart" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
                >
                    Cart
                </button>
                </>
            )}

            {user?.accountType === "Instructor" && (
                <>
                <button 
                    onClick={() => navigate("/dashboard/instructor")}
                    className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/instructor" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
                >
                    Stats
                </button>
                <button 
                    onClick={() => navigate("/dashboard/my-courses")}
                    className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/my-courses" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
                >
                    Courses
                </button>
                </>
            )}

            {user?.accountType === "Admin" && (
                <button 
                    onClick={() => navigate("/dashboard/admin-panel")}
                    className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname === "/dashboard/admin-panel" ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
                >
                    Admin Panel
                </button>
            )}

            <button 
                onClick={() => navigate("/dashboard/settings")}
                className={`text-sm whitespace-nowrap transition-all duration-200 ${location.pathname.includes("settings") ? "text-yellow-50 font-bold border-b-2 border-yellow-50 pb-1" : "text-richblack-300"}`}
            >
                Settings
            </button>
            
            <button 
                onClick={() => setConfirmationModal({
                    text1: "Are you sure?",
                    text2: "You will be logged out of your account.",
                    btn1Text: "Logout",
                    btn2Text: "Cancel",
                    btn1Handler: () => {
                        dispatch(logout(navigate))
                        setConfirmationModal(null)
                    },
                    btn2Handler: () => setConfirmationModal(null),
                })}
                className="text-sm border border-pink-700/50 px-2 py-0.5 rounded text-pink-200 whitespace-nowrap"
            >
                Logout
            </button>
        </div>

        <div className="mx-auto w-11/12 max-w-[1000px] py-10 px-4 md:px-0">
          <Outlet />
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Dashboard