'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserPlus, Mail, Lock, Calendar, Phone, Shield } from 'lucide-react';

const baseUrl = 'https://final-pro-api-j1v7.onrender.com';


const addUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  birthDay: z.string().min(1, 'Birthday is required'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  role: z.enum(['user', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AddUser({ onClose, onUserAdded }) {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: 'user' }
  });

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      console.log(token);
      
      const res = await fetch(`${baseUrl}/api/v1/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          ...data,
          age: Number(data.age), 
        }),
      });

      const result = await res.json();
console.log(result);

      if (!res.ok || result.status !== true) {
        throw new Error(result.message || 'Failed to create user');
      }

      // ✅ النجاح
      setSuccessMsg('User created successfully!');
      if (onUserAdded) onUserAdded(result.user);
      
      // إغلاق المودال بعد ثانية واحدة
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);

    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* 🔴 رسائل الخطأ والنجاح */}
        {apiError && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold uppercase">{apiError}</div>}
        {successMsg && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-bold uppercase">{successMsg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              {...register('name')}
              placeholder="Ahmed Hossam"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              {...register('email')}
              placeholder="ah1691977@gmail.com"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirmPassword.message}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
            <input
              {...register('age')}
              placeholder="23"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.age && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.age.message}</p>}
          </div>

          {/* Birthday */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Birthday</label>
            <input
              type="date"
              {...register('birthDay')}
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.birthDay && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.birthDay.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              {...register('phoneNumber')}
              placeholder="+201203241993"
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            {errors.phoneNumber && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phoneNumber.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
            <select
              {...register('role')}
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}