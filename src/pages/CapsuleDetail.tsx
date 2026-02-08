import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
    ChatBubbleOvalLeftIcon,
    ArrowLeftIcon,
    PaperAirplaneIcon,
    LockClosedIcon,
    XMarkIcon,
    PlayIcon
} from '@heroicons/react/24/outline';

export const CapsuleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [capsule, setCapsule] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");

    // Modal Stateleri
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axiosInstance.get(`/api/capsule/${id}`);
                setCapsule(res.data.data);
            } catch (err) {
                console.error("Detay yüklenemedi", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // Medya tipine göre component dönen fonksiyon
    const renderMediaContent = (url: string, isFullSize: boolean = false) => {
        const ext = url.split('.').pop()?.toLowerCase();
        const className = isFullSize
            ? "max-w-full max-h-[85vh] rounded-xl shadow-2xl"
            : "w-full h-auto object-cover max-h-[600px] rounded-[2.5rem]";

        if (['mp4', 'webm'].includes(ext || '')) {
            return <video src={url} controls={isFullSize} autoPlay={isFullSize} className={className} />;
        } else if (['mp3', 'wav', 'm4a'].includes(ext || '')) {
            return (
                <div className={`${className} bg-slate-100 flex flex-col items-center justify-center p-10 gap-4`}>
                    <div className="w-20 h-20 bg-[#7c3aed] rounded-full flex items-center justify-center shadow-lg">
                        <PlayIcon className="w-10 h-10 text-white" />
                    </div>
                    <audio src={url} controls className="w-full max-w-md" />
                </div>
            );
        }
        return <img src={url} className={className} alt="kapsül içeriği" />;
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;
        try {
            await axiosInstance.post(`/api/capsule/${id}/comment?comment=${encodeURIComponent(commentText)}`);
            setCommentText("");
            const res = await axiosInstance.get(`/api/capsule/${id}`);
            setCapsule(res.data.data);
        } catch (err) {
            console.error("Yorum gönderilemedi", err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
            <div className="w-10 h-10 border-4 border-t-[#7c3aed] border-purple-100 rounded-full animate-spin"></div>
        </div>
    );

    if (!capsule) return <div className="text-center py-20 font-bold">Kapsül bulunamadı gardaş.</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] relative">

            {/* 1. MEDYA MODAL (Resim/Video/Ses Tam Ekran) */}
            {isMediaModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <button onClick={() => setIsMediaModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                    <div className="w-full max-w-5xl flex justify-center">
                        {renderMediaContent(capsule.fileUrl, true)}
                    </div>
                </div>
            )}

            {/* 2. BEĞENENLER MODAL */}
            {isLikesModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Beğenenler</h3>
                            <button
                                onClick={() => setIsLikesModalOpen(false)}
                                className="p-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl transition-all shadow-md shadow-purple-100 group"
                            >
                                <XMarkIcon className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {capsule.likeDtos?.map((like: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                                    <img
                                        src={like.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${like.userName}&background=7c3aed&color=fff`}
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                        alt={like.userName}
                                    />
                                    <span className="font-bold text-gray-800">{like.userName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ÜST BAR */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-2xl transition-all group shadow-lg shadow-purple-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Kapsül Detayı</h2>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">

                {/* HERO SECTION */}
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img
                                    src={capsule.creatorProfilePictureUrl || `https://ui-avatars.com/api/?name=${capsule.creatorUserName}&background=7c3aed&color=fff`}
                                    className="w-20 h-20 rounded-[2rem] object-cover ring-4 ring-purple-50"
                                    alt="creator"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-50">
                                    <div className="bg-[#7c3aed] text-white text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-tighter">
                                        {capsule.type}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-thin text-gray-900 tracking-tight mb-1">{capsule.name}</h1>
                                <p className="text-gray-500 font-medium">@{capsule.creatorUserName?.split('@')[0]}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                            <div className="bg-white p-2.5 rounded-2xl shadow-sm">
                                <LockClosedIcon className="w-5 h-5 text-[#7c3aed]" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Açılış Tarihi</p>
                                <p className="text-sm font-black text-gray-800">
                                    {new Date(capsule.revealDate).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GÖRSEL/MEDYA KARTI (Tıklanabilir) */}
                <div
                    onClick={() => setIsMediaModalOpen(true)}
                    className="relative rounded-[3.5rem] overflow-hidden shadow-2xl bg-white border-[12px] border-white group cursor-zoom-in"
                >
                    {renderMediaContent(capsule.fileUrl)}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Büyütmek için tıkla
                        </div>
                    </div>
                </div>

                {/* ETKİLEŞİM VE YORUMLAR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Beğenenler (4 Column) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div
                            onClick={() => setIsLikesModalOpen(true)}
                            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 cursor-pointer hover:border-purple-200 transition-all group"
                        >
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                                Beğenenler ({capsule.likeDtos?.length || 0})
                            </h4>
                            <div className="flex -space-x-3 items-center flex-wrap">
                                {capsule.likeDtos?.slice(0, 5).map((like: any, index: number) => (
                                    <img
                                        key={index}
                                        className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white object-cover bg-gray-100 mb-2"
                                        src={like.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${like.userName}&background=f3f4f6&color=6b7280`}
                                        alt={like.userName}
                                    />
                                ))}
                                {capsule.likeDtos?.length > 5 && (
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 border-4 border-white flex items-center justify-center text-xs font-black text-gray-500 mb-2">
                                        +{capsule.likeDtos.length - 5}
                                    </div>
                                )}
                                {(!capsule.likeDtos || capsule.likeDtos.length === 0) && (
                                    <p className="text-gray-400 text-sm italic py-2">Henüz beğeni yok.</p>
                                )}
                            </div>
                            <p className="text-[10px] text-[#7c3aed] font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Tümünü gör →</p>
                        </div>
                    </div>

                    {/* Yorumlar (8 Column) */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
                        <h4 className="font-black text-gray-900 mb-6 px-2 flex items-center gap-2 text-lg">
                            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-[#7c3aed]" />
                            Yorumlar ({capsule.commentDtos?.length || 0})
                        </h4>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[400px] custom-scrollbar">
                            {capsule.commentDtos?.map((comment: any) => (
                                <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <img
                                        src={comment.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${comment.userName}&background=f3f4f6&color=6b7280`}
                                        className="w-12 h-12 rounded-2xl object-cover"
                                        alt="user"
                                    />
                                    <div className="flex-1 bg-gray-50 p-4 rounded-3xl rounded-tl-none group-hover:bg-gray-100 transition-colors">
                                        <p className="text-sm font-black text-gray-900">{comment.userName}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{comment.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Yorum Input */}
                        <div className="mt-6 flex items-center gap-3">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                placeholder="Düşüncelerini paylaş..."
                                className="flex-1 bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:border-[#7c3aed] focus:bg-white transition-all outline-none font-medium"
                            />
                            <button
                                onClick={handleSendComment}
                                className="bg-gray-900 p-4 rounded-2xl text-white hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};