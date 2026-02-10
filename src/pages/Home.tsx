import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { CreateCapsuleModal } from '../components/CreateCapsuleModal';
import {
    HomeIcon, MagnifyingGlassIcon, BellIcon,
    UserCircleIcon, HeartIcon as HeartOutlineIcon, ChatBubbleOvalLeftIcon,
    XMarkIcon, PlusIcon, MapPinIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export const Home = () => {
    const { token, userId } = useAuth();
    const navigate = useNavigate();

    const [capsules, setCapsules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBadge, setShowBadge] = useState(false);
    const [activeToast, setActiveToast] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // --- ARAMA (SEARCH) STATE'LERİ ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const BASE_URL = "https://ventral-vivan-brinkless.ngrok-free.dev";

    // --- FONKSİYONLAR ---
    const handleLikeToggle = async (capsuleId: string, isCurrentlyLiked: boolean) => {
        setCapsules(prev => prev.map(c =>
            c.id === capsuleId
                ? { ...c, isLiked: !isCurrentlyLiked, likeCount: (c.likeCount || 0) + (isCurrentlyLiked ? -1 : 1) }
                : c
        ));
        try {
            const endpoint = isCurrentlyLiked ? 'unlike' : 'like';
            await axiosInstance.post(`/api/capsule/${capsuleId}/${endpoint}`);
        } catch (err) {
            setCapsules(prev => prev.map(c =>
                c.id === capsuleId ? { ...c, isLiked: isCurrentlyLiked, likeCount: (c.likeCount || 0) } : c
            ));
        }
    };

    const handleComment = (capsuleId: string) => {
        navigate(`/capsule/${capsuleId}`);
    };

    const fetchFeed = async () => {
        try {
            const res = await axiosInstance.get('/api/capsule/feed');
            const formattedData = res.data.data.items.map((item: any) => ({
                ...item,
                isLiked: item.isLiked || false,
                likeCount: item.likeCount || 0
            }));
            setCapsules(formattedData);
        } catch (err) {
            console.error("Feed çekilemedi", err);
        } finally {
            setLoading(false);
        }
    };

    // --- EFFECT'LER ---
    useEffect(() => {
        if (token) fetchFeed();
    }, [token]);

    // ARAMA LOGIC (Debounce)

useEffect(() => {
    const searchUsers = async () => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await axiosInstance.get(`/api/user/search?userName=${searchQuery}`);

            if (res.data && res.data.data && res.data.data.items) {
                setSearchResults(res.data.data.items);
            } else {
                setSearchResults([]);
            }
            
        } catch (err) {
            console.error("Arama hatası:", err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
}, [searchQuery]);

    useEffect(() => {
        if (!token) return;
        const capsuleStream = new EventSource(`${BASE_URL}/api/server-sent-events/capsule-feed-stream?token=${token}`);
        capsuleStream.onmessage = (event) => {
            const newCapsule = JSON.parse(event.data);
            setCapsules(prev => [{ ...newCapsule, isLiked: false, likeCount: 0 }, ...prev]);
            setShowBadge(true);
        };
        return () => capsuleStream.close();
    }, [token, BASE_URL]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
            <CreateCapsuleModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    fetchFeed();
                }}
                userId={userId || ""}
            />

            {/* ARAMA PANELİ (OVERLAY) */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-white md:left-72 animate-in slide-in-from-left duration-300">
                    <div className="max-w-2xl mx-auto py-8 px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Keşfet</h2>
                            <button 
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <XMarkIcon className="w-8 h-8 text-gray-400" />
                            </button>
                        </div>

                        <div className="relative mb-10">
                            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#7c3aed]" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Kullanıcı adı ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-[#7c3aed] focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-lg shadow-inner"
                            />
                            {isSearching && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-purple-200 border-t-[#7c3aed] rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                            {searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <div 
                                        key={user.id}
                                        onClick={() => {
                                            navigate(`/profile/${user.id}`);
                                            setIsSearchOpen(false);
                                        }}
                                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-[2rem] cursor-pointer hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all group"
                                    >
                                        <img 
                                            src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.username}&background=7c3aed&color=fff`}
                                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-purple-200 transition-all"
                                            alt={user.username}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 group-hover:text-[#7c3aed] transition-colors uppercase tracking-tight">
                                                {user.username}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profili Görüntüle</p>
                                        </div>
                                        <PlusIcon className="w-6 h-6 text-gray-300 group-hover:text-[#7c3aed]" />
                                    </div>
                                ))
                            ) : searchQuery.length >= 2 && !isSearching ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-400 font-bold">Sonuç bulunamadı.</p>
                                </div>
                            ) : (
                                <p className="text-center py-20 text-gray-400 font-bold italic">Yeni insanlar keşfet...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 p-6 sticky top-0 h-screen">
                <h1 className="text-3xl font-black text-[#7c3aed] italic mb-10 tracking-tighter px-4 cursor-pointer" onClick={() => navigate('/')}>Unseal</h1>
                <nav className="space-y-2 flex-1">
                    <div onClick={() => { setIsSearchOpen(false); navigate('/home'); }}>
                        <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Ana Sayfa" active={!isSearchOpen} />
                    </div>
                    
                    {/* KEŞFET TETİKLEYİCİ */}
                    <div onClick={() => setIsSearchOpen(true)}>
                        <NavItem icon={<MagnifyingGlassIcon className="w-6 h-6" />} label="Keşfet" active={isSearchOpen} />
                    </div>

                    <div className="relative cursor-pointer" onClick={() => setShowBadge(false)}>
                        <NavItem icon={<BellIcon className="w-6 h-6" />} label="Bildirimler" />
                        {showBadge && <span className="absolute top-4 left-8 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                    </div>

                    <div onClick={() => {
                        const targetId = userId || localStorage.getItem('userId');
                        targetId ? navigate(`/profile/${targetId}`) : navigate('/login');
                    }}>
                        <NavItem icon={<UserCircleIcon className="w-6 h-6" />} label="Profil" />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto py-8 px-4 pb-24">
                {/* OLUŞTURMA BUTONU */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="fixed bottom-8 right-8 md:right-8 w-16 h-16 bg-[#7c3aed] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
                >
                    <PlusIcon className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-10 h-10 border-4 border-purple-200 border-t-[#7c3aed] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {capsules.map((capsule) => (
                            <article key={capsule.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md group/card">
                                {/* ... Capsule Card İçeriği (Aynen Kalıyor) ... */}
                                <div className="p-6 flex items-center justify-between">
                                    <div 
                                        className="flex items-center gap-4 cursor-pointer group/user"
                                        onClick={() => navigate(`/profile/${capsule.userId || capsule.creatorId}`)}
                                    >
                                        <img
                                            src={capsule.profilePictureUrl || `https://ui-avatars.com/api/?name=${capsule.username}&background=7c3aed&color=fff`}
                                            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-purple-50 group-hover/user:ring-purple-200 transition-all"
                                            alt="profile"
                                        />
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-none mb-1 group-hover/user:text-[#7c3aed] transition-colors uppercase">
                                                {capsule.username?.split('@')[0]}
                                            </h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <MapPinIcon className="w-3 h-3" />
                                                {capsule.locationName || 'Dünya'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="bg-purple-50 text-[#7c3aed] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                                        {capsule.type || 'Zaman Kapsülü'}
                                    </span>
                                </div>

                                <div className="px-6 cursor-pointer" onClick={() => navigate(`/capsule/${capsule.id}`)}>
                                    <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100 group">
                                        <img
                                            src={capsule.fileUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop'}
                                            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            alt={capsule.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/20 text-white shadow-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-purple-200">Kapsül Başlığı</p>
                                            <h4 className="text-xl font-black truncate">{capsule.name}</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-7">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLikeToggle(capsule.id, capsule.isLiked)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 ${capsule.isLiked ? 'bg-red-50 text-red-500 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
                                        >
                                            {capsule.isLiked ? <HeartSolidIcon className="w-6 h-6 animate-bounce" /> : <HeartOutlineIcon className="w-6 h-6" />}
                                            <span className="text-sm font-black">{capsule.likeCount || 0}</span>
                                        </button>

                                        <button
                                            onClick={() => handleComment(capsule.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-[#7c3aed] transition-all"
                                        >
                                            <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                                            <span className="text-sm font-black">Yorumlar</span>
                                        </button>
                                    </div>
                                    <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <p className="text-[11px] font-black text-[#7c3aed] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-lg">
                                            {new Date(capsule.revealDate).toLocaleDateString('tr-TR') + " tarihinde açıldı"}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }: any) => (
    <div className={`flex items-center gap-4 p-4 rounded-[1.25rem] cursor-pointer transition-all duration-500 ${active ? 'bg-[#7c3aed] text-white shadow-xl shadow-purple-100' : 'text-gray-400 hover:bg-purple-50 hover:text-[#7c3aed]'}`}>
        <div className={active ? "scale-110" : ""}>{icon}</div>
        <span className={`text-sm font-black tracking-tight ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
    </div>
);