import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
    EyeIcon,
    EyeSlashIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    PhoneIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    const onSubmit = async (data: any) => {
        try {
            await axiosInstance.post('/api/auth/register', data);
            alert('Kayıt başarılı! Mailini kontrol et.');
        } catch (error: any) {
            alert('Hata oluştu, backend loglarına bak.');
        }
    };

    const fieldContainer = "relative flex items-center bg-gray-50 border border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-50 transition-all duration-300 rounded-2xl px-4 py-1";
    const iconStyle = "h-5 w-5 text-gray-400 mr-3";
    const inputStyle = "block w-full py-3 bg-transparent text-gray-900 outline-none placeholder-gray-400 text-sm font-medium border-none focus:ring-0";
    const labelStyle = "block text-[13px] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider";

    // BURASI KRİTİK: Butonun her şeyini sıfırlıyoruz
    const eyeButtonStyle = "flex items-center justify-center p-2 !bg-transparent border-none outline-none focus:outline-none focus:ring-0 shadow-none appearance-none hover:!bg-transparent active:!bg-transparent";

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-10 px-4 font-sans text-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
                <h1 className="text-5xl font-black text-[#7c3aed] tracking-tighter mb-4 font-serif italic">Unseal</h1>
                <h2 className="text-2xl font-extrabold text-gray-800">Hesap Oluştur</h2>
                <p className="mt-2 text-sm text-gray-500 font-medium tracking-tight">Maceraya katılmak için formun canına oku.</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(124,58,237,0.1)] rounded-[3rem] border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>Ad <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <UserIcon className={iconStyle} />
                                    <input {...register("firstName", { required: true })} className={inputStyle} placeholder="Adınız" />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Soyad <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <UserIcon className={iconStyle} />
                                    <input {...register("lastName", { required: true })} className={inputStyle} placeholder="Soyadınız" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>E-mail <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <EnvelopeIcon className={iconStyle} />
                                    <input {...register("email", { required: true })} type="email" className={inputStyle} placeholder="ornek@mail.com" />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Kullanıcı Adı <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <span className="text-gray-400 font-bold mr-2 text-lg italic">@</span>
                                    <input {...register("username", { required: true })} className={inputStyle} placeholder="kullanici_adi" />
                                </div>
                            </div>
                        </div>

                        {/* ŞİFRELER - ŞEFFAF BUTONLU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>Şifre <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <LockClosedIcon className={iconStyle} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", { required: true })}
                                        className={inputStyle}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonStyle}>
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-[#7c3aed]" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Şifre Tekrar <span className="text-red-400">*</span></label>
                                <div className={fieldContainer}>
                                    <LockClosedIcon className={iconStyle} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("confirmPassword", { required: true })}
                                        className={inputStyle}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeButtonStyle}>
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-[#7c3aed]" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                            <div>
                                <label className={labelStyle}>Telefon</label>
                                <div className={fieldContainer}>
                                    <PhoneIcon className={iconStyle} />
                                    <input {...register("phoneNumber")} className={inputStyle} placeholder="05XX..." />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Adres</label>
                                <div className={fieldContainer}>
                                    <MapPinIcon className={iconStyle} />
                                    <input {...register("address")} className={inputStyle} placeholder="Şehir, İlçe..." />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="group relative w-full flex justify-center py-4 bg-[#7c3aed] text-white rounded-2xl font-extrabold shadow-xl shadow-purple-200 hover:bg-[#6d28d9] hover:shadow-purple-300 transition-all transform active:scale-[0.98]">
                                <span className="flex items-center">
                                    Hesabımı Oluştur
                                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </span>
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-400 font-bold tracking-tight">
                                Zaten bizden biri misin?
                                <Link to="/login" className="text-[#7c3aed] hover:text-[#5b21b6] ml-1.5 underline-offset-4 hover:underline transition-all">Giriş Yap</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};