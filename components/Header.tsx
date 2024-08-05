'use client'
import { addUser } from '@/lib/store/features/authuser/authuser';
import { useAppSelector } from '@/lib/store/hooks';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Header: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { name, email, phone }: any = useAppSelector(state => state.Auth.user);
    const dispatch = useDispatch();

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await axios.get('http://localhost:3000/api/auth/logout');
            if (res?.data?.status == 200) {
                dispatch(addUser({}))
                toast.success(res?.data?.message);
                router.push('/login')
            }
            setLoading(false)
        }
        catch (error) {
            console.log("error:", error)
            setLoading(false)
        }
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-gray-800 text-white px-2 py-4 sm:px-4  shadow-md ">
            <div className="flex justify-between">
                <h1 className=" text-md sm:text-xl font-bold">MyApp</h1>
                <div className='flex justify-center items-center gap-2 sm:gap-10'>

                    <nav className="flex space-x-4">
                        <Link href="/create-slide" className="hover:text-gray-400 text-xs sm:text-sm">
                            Create Slide
                        </Link>
                        <Link href="/slide-list" className="hover:text-gray-400 text-xs sm:text-sm">
                            Slide List
                        </Link>
                        <Link href="/slide-carousel" className="hover:text-gray-400 text-xs sm:text-sm">
                            Slide Carousel
                        </Link>
                    </nav>
                    <div className="relative min-w-[40px]">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2">
                            <img
                                src="https://media.istockphoto.com/id/1341046662/vector/picture-profile-icon-human-or-people-sign-and-symbol-for-template-design.jpg?s=612x612&w=0&k=20&c=A7z3OK0fElK3tFntKObma-3a7PyO8_2xxW0jtmjzT78="
                                alt="Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                                <div className="p-4">
                                    <p className="text-sm">{name}</p>
                                    <p className="text-sm text-wrap break-words">{email}</p>
                                    <p className="text-sm">{phone}</p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <button
                                        onClick={handleClick}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Header;
