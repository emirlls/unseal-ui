import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit } = useForm<any>();

    const onSubmit = async (data: any) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', data);

            const loginData = response.data.data;

            if (loginData && loginData.accessToken && loginData.userId) {
                login(loginData.accessToken, loginData.userId);
                alert('Giriş başarılı!');
                navigate('/home');
            } else {
                console.error("Beklenen data yapısı gelmedi:", response.data);
            }
        } catch (error: any) {
            console.error("Login Hatası:", error.response?.data || error.message);
            alert('Hatalı giriş! Bilgilerini kontrol et.');
        }
    };

    // Tasarım Değişkenleri
    const fieldContainer = "relative flex items-center bg-[#f9fafb] border border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-300 rounded-2xl px-4 py-1";
    const iconStyle = "h-5 w-5 text-gray-400 mr-3";
    const inputStyle = "block w-full py-4 bg-transparent text-gray-900 outline-none placeholder-gray-400 text-sm font-medium border-none focus:ring-0";
    const labelStyle = "block text-[13px] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider";
    const eyeButtonStyle = "flex items-center justify-center p-2 !bg-transparent border-none outline-none focus:outline-none focus:ring-0 shadow-none appearance-none hover:!bg-transparent active:!bg-transparent transition-all active:scale-90";

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 font-sans text-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h1 className="text-5xl font-black text-[#7c3aed] tracking-tighter mb-4 font-serif italic">Unseal</h1>
                <h2 className="text-2xl font-extrabold text-gray-800">Tekrar Hoş Geldin</h2>
                <p className="mt-2 text-sm text-gray-500 font-medium tracking-tight">Kaldığın yerden devam etmeye hazır mısın?</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-10 shadow-[0_20px_50px_rgba(124,58,237,0.1)] rounded-[3rem] border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* E-mail Alanı */}
                        <div>
                            <label className={labelStyle}>E-mail</label>
                            <div className={fieldContainer}>
                                <EnvelopeIcon className={iconStyle} />
                                <input
                                    {...register("email", { required: true })}
                                    type="email"
                                    autoComplete="email"
                                    className={inputStyle}
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        {/* Şifre Alanı */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <label className={labelStyle.replace('mb-1.5', '')}>Şifre</label>
                                <Link to="/forgot-password" className="text-[12px] font-bold text-[#7c3aed] hover:underline">
                                    Şifremi Unuttum?
                                </Link>
                            </div>
                            <div className={fieldContainer}>
                                <LockClosedIcon className={iconStyle} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    autoComplete="current-password"
                                    className={inputStyle}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={eyeButtonStyle}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-[#7c3aed]" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Giriş Butonu */}
                        <div className="pt-2">
                            <button type="submit" className="group relative w-full flex justify-center py-4 bg-[#7c3aed] text-white rounded-2xl font-extrabold shadow-xl shadow-purple-200 hover:bg-[#6d28d9] hover:shadow-purple-300 transition-all transform active:scale-[0.98]">
                                <span className="flex items-center">
                                    Giriş Yap
                                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-400 font-bold tracking-tight">
                                Hesabın yok mu?
                                <Link to="/register" className="text-[#7c3aed] hover:text-[#5b21b6] ml-1.5 underline-offset-4 hover:underline transition-all font-black">ŞİMDİ KAYDOL</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};