"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Page: React.FC = () => {
    const router = useRouter()
    const [title, setTitle] = useState('');
    const [imagefile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string; image?: string }>({});

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (e.target.value) {
            setErrors((prevErrors) => ({ ...prevErrors, title: undefined }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrors((prevErrors) => ({ ...prevErrors, image: undefined }));
        } else {
            setImagePreview(null);
        }
    };

    const validateForm = () => {
        const newErrors: { title?: string; image?: string } = {};
        if (!title) {
            newErrors.title = 'Title is required';
        }
        if (!imagefile) {
            newErrors.image = 'Image is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('title', title);
            if (imagefile) {
                formData.append("file", imagefile);
            }

            // const res: any = axios.post("http://localhost:3000/api/create-slide", formData);
            const resp: any = await fetch('/api/slides', {
                'method': "POST",
                body: formData
            });
            const res = await resp.json()
            if (res?.status == 200) {
                toast.success(res?.message);
                router.push('/slide-list')
            }
            else {
                toast.error(res?.message)
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Slide</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
                        placeholder="Enter slide title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.image ? 'border-red-500' : ''}`}
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </div>
                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-md" />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Slide
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
