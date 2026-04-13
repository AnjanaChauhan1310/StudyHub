import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { IoIosArrowDown } from "react-icons/io"
import { VscSignOut } from "react-icons/vsc"

import logo from "../../assets/Logo/Logo-Full-Light.svg"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { logout } from '../../services/operations/authAPI'
import ConfirmationModal from '../common/ConfirmationModal'

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null)

    const fetchSublinks = async () => {
        try {
            setLoading(true);
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(result.data.data);
            setLoading(false);
        } catch (error) {
            console.log("Could not fetch the category list");
        }
    }

    useEffect(() => {
        fetchSublinks();
    }, [])

    const matchRoute = (route) => {
        if (!route) return false;
        return matchPath({ path: route }, location.pathname);
    }

    return (
        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800 transition-all duration-300 z-[1000]`}>
            <div className='flex w-11/12 max-w-[1160px] items-center justify-between'>
                {/* Logo */}
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <img src={logo} alt="Logo" width={160} height={32} loading='lazy' />
                </Link>

                {/* Navigation Links - Desktop */}
                <nav className='hidden md:block'>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:id") ? "text-yellow-25" : "text-richblack-25"}`}>
                                        <p>{link.title}</p> {/* fix: stable dropdown positioning    q*/}
                                        <IoIosArrowDown />
                                        <div className='invisible absolute left-[50%] top-full z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[1em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-[0px] group-hover:opacity-100 lg:w-[300px]'>
                                            <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
                                            {loading ? (
                                                <p className="text-center">Loading...</p>
                                            ) : subLinks?.length > 0 ? (
                                                subLinks.map((subLink, i) => (
                                                    <Link 
                                                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} 
                                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" 
                                                        key={i}
                                                    >
                                                        <p>{subLink.name}</p>
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-center font-semibold py-2">No Categories Found</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login / Signup / Dashboard - Desktop */}
                <div className='hidden items-center gap-x-4 md:flex'>
                    {user && user?.accountType === "Student" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className='text-2xl text-richblack-100' />
                            {totalItems > 0 && (
                                <span className='absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Log in
                            </button>
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )}
                    {token !== null && <ProfileDropDown />}
                </div>

                {/* Hamburger Menu Icon - Mobile */}
                <button 
                    className='md:hidden text-[#AFB2BF] text-2xl transition-all duration-200'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div 
                className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-richblack-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                
                {/* Content */}
                <div className={`absolute top-14 right-0 bottom-0 w-[70%] bg-richblack-800 border-l border-richblack-700 p-6 flex flex-col gap-y-6 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <nav>
                        <ul className='flex flex-col gap-y-4'>
                            {NavbarLinks.map((link, index) => (
                                <li key={index} className="border-b border-richblack-700 pb-2">
                                    {link.title === "Catalog" ? (
                                        <div className='flex flex-col gap-y-2'>
                                            <p className='text-richblack-300 text-sm font-semibold'>CATALOG</p>
                                            <div className='flex flex-col gap-y-2 pl-4'>
                                                {subLinks.map((sub, i) => (
                                                    <Link 
                                                        key={i} 
                                                        to={`/catalog/${sub.name.split(" ").join("-").toLowerCase()}`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className='text-richblack-300'
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link 
                                            to={link?.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-5"} font-medium text-lg`}
                                        >
                                            {link.title}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className='mt-auto flex flex-col gap-y-4 pt-6 border-t border-richblack-700'>
                        {token === null && (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full border border-richblack-700 bg-richblack-700 py-3 text-richblack-5 rounded-md'>
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full bg-yellow-50 py-3 text-richblack-900 font-bold rounded-md'>
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                        {token !== null && (
                            <div className="flex flex-col gap-y-4">
                                <Link 
                                    to="/dashboard/my-profile" 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className="flex items-center gap-x-2 text-richblack-5 font-medium border-b border-richblack-700 pb-2"
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setConfirmationModal({
                                            text1: "Are you sure?",
                                            text2: "You will be logged out of your account.",
                                            btn1Text: "Logout",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => {
                                                dispatch(logout(navigate))
                                                setConfirmationModal(null)
                                            },
                                            btn2Handler: () => setConfirmationModal(null),
                                        })
                                    }}
                                    className="flex items-center gap-x-2 text-pink-200 font-medium"
                                >
                                    <VscSignOut />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default Navbar