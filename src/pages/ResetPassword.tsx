import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import {
    LockClosedIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

export const ResetPassword = () => {
    const navigate = useNavigate();

    const getParamFromURL = (param: string) => {
        const url = window.location.href;
        const regex = new RegExp(`[?&]${param}=([^&#]*)`, 'i');
        const match = regex.exec(url);
        return match ? match[1] : null;
    };

    const userId = getParamFromURL('userId');
    const token = getParamFromURL('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) return alert("Şifreler uyuşmuyor!");

        // Gönderirken tekrar kontrol et
        if (!userId || !token) {
            console.error("HATA: Bilgiler eksik!", { userId, token });
            return alert("URL'de userId veya token bulunamadı!");
        }

        setIsLoading(true);
        try {
            await api.post('/api/auth/confirm-password-reset', {
                userId: userId,
                newPassword: password,
                token: token,
            });
            alert("Şifre başarıyla güncellendi!");
            navigate('/login');
        } catch (err: any) {
            console.error("API Hatası:", err.response?.data);
            alert("Sıfırlama başarısız! Link geçersiz olabilir.");
        } finally {
            setIsLoading(false);
        }
    };

    // UI Tasarım Değişkenlerin
    const eyeButtonStyle = "flex items-center justify-center p-2 !bg-transparent border-none outline-none focus:outline-none focus:ring-0 shadow-none appearance-none hover:!bg-transparent transition-all active:scale-90 ml-1";
    const fieldContainer = "relative flex items-center bg-[#f9fafb] border border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-300 rounded-2xl px-4 py-1";
    const inputStyle = "block w-full py-4 bg-transparent text-gray-900 outline-none placeholder-gray-400 text-sm font-medium border-none focus:ring-0";
    const labelStyle = "block text-[13px] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h1 className="text-5xl font-black text-[#7c3aed] italic mb-4 font-serif">Unseal</h1>
                <h2 className="text-2xl font-extrabold text-gray-800">Şifreni Sıfırla</h2>
                <p className="text-sm text-gray-500 font-medium">Lütfen yeni şifreni belirle.</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-10 shadow-[0_20px_50px_rgba(124,58,237,0.1)] rounded-[3rem] border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className={labelStyle}>Yeni Şifre</label>
                            <div className={fieldContainer}>
                                <LockClosedIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={inputStyle}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonStyle}>
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5 text-[#7c3aed]" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Şifre Tekrar</label>
                            <div className={fieldContainer}>
                                <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={inputStyle}
                                    placeholder="••••••••"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 bg-[#7c3aed] text-white rounded-2xl font-extrabold shadow-xl hover:bg-[#6d28d9] transition-all transform active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <ArrowPathIcon className="h-6 w-6 animate-spin" />
                            ) : (
                                "Şifreyi Güncelle"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};