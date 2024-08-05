"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from "@/components/Loader";

interface Slide {
    id: number;
    title: string;
    imageUrl: string;
}


const Page = () => {
    const [slides, setSlides] = useState([])
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getSlides = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/slides');
            if (res?.data?.status == 200) {
                setSlides(res?.data?.slides)
            }
            setLoading(false)
        }
        catch (error) {
            console.log("error:", error)
            setLoading(false)
        }
    }

    const handleEdit = (id: number) => {
        router.push(`/edit-slide/${id}`);
    };

    useEffect(() => {
        getSlides()
    }, [])

    const handleDelete = async (id: any) => {
        try {
            const res = await axios.delete(`/api/slides?id=${id}`, {});
            if (res?.data?.status == 200) {
                toast.success(res?.data?.message);
                getSlides()
            }
        }
        catch (error) {
            console.log("error:", error)
        }
    }

    return (
        <>
            {loading ? <Loader /> : <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Slides List</h2>
                {slides.length === 0 ? (
                    <p className="text-center text-gray-500">No slides available</p>
                ) : (
                    <ul className="space-y-4">
                        {slides.map((slide: any) => (
                            <li key={slide.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                                <div className="flex items-center space-x-4 w-full md:w-auto">
                                    <img
                                        src={slide.slide}
                                        alt={slide.title}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(slide.id)}
                                        className="bg-teal-300 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>}
        </>
    );
};

export default Page;
