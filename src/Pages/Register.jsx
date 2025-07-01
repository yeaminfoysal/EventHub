import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const user = {
            name,
            photoUrl,
            username,
            password
        }

        try {
            axios.post(`http://localhost:3000/api/users/register`, user).then(res => {

                if (res.data.success) {
                    localStorage.setItem("token", res.data.token);
                    navigate('/')
                    window.dispatchEvent(new Event("authChange"));
                    // Swal.fire({
                    //     icon: "success",
                    //     title: "Your Book Add Successfull!",
                    //     showConfirmButton: false,
                    //     timer: 1600
                    // });
                }
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600">Join EventHub today</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700 mt-6">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Photo URL
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="photo"
                                        name="photo"
                                        type="text"
                                        required
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                                        placeholder="Enter your photo url"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    username Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="username"
                                        name="username"
                                        type="username"
                                        required
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;