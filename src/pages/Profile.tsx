import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { 
    ChevronLeftIcon, 
    MapPinIcon, 
    CalendarIcon, 
    PencilSquareIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';

export const Profile = () => {
    const { id } = useParams(); // URL'deki userId
    const { userId: currentUserId } = useAuth(); // Login olan kullanıcının ID'si
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = id === currentUserId;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // API senin verdiğin endpoint: /api/user/{id}/profile
                const res = await axiosInstance.get(`/api/user/${id}/profile`);
                // Backend'den dönen data yapısı: { data: { userDto, followerCount, followCount, capsuleUrls } }
                setProfile(res.data.data || res.data); 
            } catch (err) {
                console.error("Profil yüklenemedi", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-[#7c3aed] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Üst Bar */}
            <div className="max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Profil</h1>
                <div className="w-12"></div> {/* Denge için */}
            </div>

            <main className="max-w-4xl mx-auto p-6">
                {/* Profil Header Kartı */}
                <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
                    {/* Arka Plan Süslemesi */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        {/* Avatar */}
                        <div className="relative group">
                            <img 
                                src={profile?.userDto?.profilePictureUrl || `https://ui-avatars.com/api/?name=${profile?.userDto?.username}&background=7c3aed&color=fff&size=128`} 
                                className="w-40 h-40 rounded-[3rem] object-cover shadow-2xl ring-8 ring-purple-50 group-hover:scale-105 transition-transform duration-500"
                                alt="profile"
                            />
                        </div>

                        {/* Bilgiler */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                                    {profile?.userDto?.username?.split('@')[0]}
                                </h2>
                                
                                {isOwnProfile ? (
                                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all">
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Düzenle
                                    </button>
                                ) : (
                                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7c3aed] text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-200 hover:bg-[#6d28d9] transition-all">
                                        <UserPlusIcon className="w-4 h-4" />
                                        Takip Et
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                <div className="flex items-center gap-1 text-gray-400 text-sm font-bold">
                                    <MapPinIcon className="w-4 h-4" />
                                    {profile?.userDto?.location || "Dünya"}
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 text-sm font-bold">
                                    <CalendarIcon className="w-4 h-4" />
                                    Katıldı: {new Date().getFullYear()}
                                </div>
                            </div>

                            {/* İstatistikler */}
                            <div className="flex gap-8 border-t border-gray-50 pt-6 justify-center md:justify-start">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#7c3aed]">{profile?.followerCount || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Takipçi</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#7c3aed]">{profile?.followCount || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Takip</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{profile?.capsuleUrls?.length || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kapsül</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kapsül Koleksiyonu Başlığı */}
                <div className="mt-12 mb-8 flex items-center justify-between px-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Kapsül Arşivi</h3>
                    <div className="h-1 flex-1 mx-6 bg-gray-100 rounded-full"></div>
                </div>

                {/* Kapsüller (Grid) */}
                {profile?.capsuleUrls && profile.capsuleUrls.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {profile.capsuleUrls.map((url: string, index: number) => (
                            <div 
                                key={index} 
                                className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-sm border-4 border-white group relative cursor-pointer hover:shadow-2xl transition-all duration-500"
                            >
                                <img 
                                    src={url} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={`capsule-${index}`}
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#7c3aed]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white font-black text-sm uppercase tracking-widest">Görüntüle</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold">Henüz hiç kapsül açılmamış...</p>
                    </div>
                )}
            </main>
        </div>
    );
};