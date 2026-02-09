import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LeafletMouseEvent, LatLng } from 'leaflet';

import {
    XMarkIcon, CloudArrowUpIcon, PaperAirplaneIcon,
    MapPinIcon, CalendarIcon, PencilIcon
} from '@heroicons/react/24/outline';

const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const LocationMarker = ({ setGeoJson }: { setGeoJson: (json: string) => void }) => {
    const [position, setPosition] = useState<LatLng | null>(null);

    useMapEvents({
        click(e: LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);

            // Backend'in beklediği tam FeatureCollection formatı
            const geoJsonStructure = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Point",
                            coordinates: [lng, lat] // Boylam, Enlem sırası önemli
                        }
                    }
                ]
            };

            setGeoJson(JSON.stringify(geoJsonStructure));
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
};

export const CreateCapsuleModal = ({ isOpen, onClose, userId }: { isOpen: boolean, onClose: () => void, userId: string }) => {
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState<'self' | 'public'>('self');
    const [formData, setFormData] = useState({
        name: '',
        textContext: '',
        revealDate: '',
        geoJson: '',
        file: null as File | null
    });

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!formData.name || !formData.revealDate) return alert("Başlık ve tarih zorunludur!");
        setLoading(true);
        const data = new FormData();
        if (target === 'self') data.append('ReceiverId', userId);
        data.append('Name', formData.name);
        data.append('TextContext', formData.textContext);
        data.append('RevealDate', new Date(formData.revealDate).toISOString());
        data.append('GeoJson', formData.geoJson || "{}");
        if (formData.file) data.append('StreamContent', formData.file);

        try {
            await axiosInstance.post('/api/capsule', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Hata oluştu!");
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-200">
                            <PaperAirplaneIcon className="w-5 h-5 text-white -rotate-45" />
                        </div>
                        <div>
                            <p className="text-s text-slate-800 font-medium">Geleceğe bir iz bırak...</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <XMarkIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    {/* Hedef Seçimi (Toggle Switch gibi) */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                        <button onClick={() => setTarget('self')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${target === 'self' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            Gelecekteki Kendime
                        </button>
                        <button onClick={() => setTarget('public')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${target === 'public' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            Herkese Açık
                        </button>
                    </div>

                    {/* Form Alanları */}
                    <div className="space-y-4">
                        {/* Kapsül Başlığı */}
                        <div className="relative">
                            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Kapsül Başlığı</label>
                            <div className="relative">
                                <PencilIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Örn: 2030'daki Kendime"
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl pl-12 pr-6 py-4 text-slate-800 font-bold outline-none transition-all placeholder:text-slate-300"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Mesaj */}
                        <div className="relative">
                            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Mesajın</label>
                            <textarea
                                placeholder="Buraya duygularını mühürle..."
                                rows={3}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl px-6 py-4 text-slate-800 font-bold outline-none transition-all resize-none placeholder:text-slate-300"
                                onChange={(e) => setFormData({ ...formData, textContext: e.target.value })}
                            />
                        </div>

                        {/* Tarih ve Harita Yan Yana (Desktop'ta) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block">Açılış Tarihi</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-bold outline-none transition-all"
                                        onChange={(e) => setFormData({ ...formData, revealDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <label className="text-[11px] font-bold text-slate-500 uppercase mr-1 block text-left">Konum (Haritada İşaretle)</label>
                                <div className="h-[84px] w-full rounded-2xl overflow-hidden border-2 border-slate-100 relative shadow-inner">
                                    <MapContainer center={[39.9, 32.8]} zoom={4} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker setGeoJson={(json) => setFormData({ ...formData, geoJson: json })} />
                                    </MapContainer>
                                    <div className="absolute top-2 right-2 z-[400] bg-white/80 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                                        <MapPinIcon className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dosya Yükleme */}
                        <label className={`flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${formData.file ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                            <div className="flex flex-center gap-3">
                                <CloudArrowUpIcon className={`w-6 h-6 ${formData.file ? 'text-purple-600' : 'text-slate-400'}`} />
                                <span className={`text-sm font-black ${formData.file ? 'text-purple-700' : 'text-slate-500'}`}>
                                    {formData.file ? formData.file.name : "Görsel, Video veya Ses"}
                                </span>
                            </div>
                            <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} />
                        </label>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-purple-200 active:scale-[0.98] transition-all"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>KAPSÜLLE <PaperAirplaneIcon className="w-5 h-5 -rotate-45" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};