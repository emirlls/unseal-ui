import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext'; // AuthContext'i içeri alıyoruz
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserCircleIcon,
    PlusCircleIcon,
    HeartIcon,
    ChatBubbleOvalLeftIcon,
    ShareIcon
} from '@heroicons/react/24/outline';

export const Home = () => {
    const { token } = useAuth(); // Token'ı context'ten çekiyoruz
    const [capsules, setCapsules] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);

    // 1. Feed Çekme (Axios zaten interceptor ile token'ı Header'a ekliyor)
    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // Burada axiosInstance kullandığın için 403 almaman lazım
                const res = await axiosInstance.get('/api/capsule/feed');
                // Backend veriyi yine 'data' içinde gönderiyorsa res.data.data yapmalısın
                const feedData = res.data.data || res.data;
                setCapsules(feedData);
            } catch (err) {
                console.error("Feed çekilemedi", err);
            }
        };
        if (token) fetchFeed();
    }, [token]);

    // 2. SSE Bağlantıları (Token'ı URL parametresi olarak ekliyoruz)
    useEffect(() => {
        if (!token) return;

        // Kendi ngrok URL'ini buraya yazmalısın
        const baseUrl = 'https://ventral-vivan-brinkless.ngrok-free.dev';

        // Yeni Kapsül Akışı
        const capsuleEventSource = new EventSource(`${baseUrl}/api/server-sent-events/capsule-feed-stream?token=${token}`);

        capsuleEventSource.onmessage = (event) => {
            try {
                const newCapsule = JSON.parse(event.data);
                setCapsules((prev) => [newCapsule, ...prev]);
            } catch (e) {
                console.error("Kapsül parse hatası", e);
            }
        };

        // Takip İsteği Akışı
        const followEventSource = new EventSource(`${baseUrl}/api/server-sent-events/accept-follow-request-stream?token=${token}`);

        followEventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setNotifications((prev) => [`${data.username} isteğini kabul etti!`, ...prev]);
            } catch (e) {
                console.error("Bildirim parse hatası", e);
            }
        };

        // Bağlantı hatalarını izle
        capsuleEventSource.onerror = (err) => console.error("SSE Capsule Hatası:", err);
        followEventSource.onerror = (err) => console.error("SSE Follow Hatası:", err);

        return () => {
            capsuleEventSource.close();
            followEventSource.close();
        };
    }, [token]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* ... Geri kalan Sidebar ve Feed Tasarımı aynı ... */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 p-6 sticky top-0 h-screen">
                <h1 className="text-3xl font-black text-[#7c3aed] italic mb-10">Unseal</h1>
                <nav className="space-y-2 flex-1">
                    <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Ana Sayfa" active />
                    <NavItem icon={<MagnifyingGlassIcon className="w-6 h-6" />} label="Keşfet" />
                    <NavItem icon={<BellIcon className="w-6 h-6" />} label="Bildirimler" badge={notifications.length} />
                    <NavItem icon={<UserCircleIcon className="w-6 h-6" />} label="Profil" />
                </nav>
            </aside>

            <main className="flex-1 max-w-2xl mx-auto py-8 px-4">
                <div className="space-y-6">
                    {capsules.length > 0 ? capsules.map((capsule, index) => (
                        <div key={index} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100" />
                                <p className="font-bold text-gray-900">@{capsule.username || 'user'}</p>
                            </div>
                            <p className="text-gray-700 font-medium">{capsule.content || "İçerik yükleniyor..."}</p>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-400 font-bold italic">Kapsüller yükleniyor veya henüz kapsül yok...</div>
                    )}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, badge = 0 }: any) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-purple-50 text-[#7c3aed]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-bold">{label}</span>
        </div>
        {badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black">{badge}</span>}
    </div>
);