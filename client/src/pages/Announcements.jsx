import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Bell, 
  Calendar, 
  Tag, 
  FileText, 
  Download, 
  ExternalLink,
  Search
} from 'lucide-react';
import ThreeDCampusBadge from '../components/ThreeDCampusBadge';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAnnouncements();
        if (res.success) setAnnouncements(res.announcements);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = announcements.filter(a =>
    !search.trim() ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <ThreeDCampusBadge size={52} className="hidden sm:inline-block drop-shadow-md shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center space-x-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <span>Official Campus Circulars & Public Gazettes</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified academic notifications, semester schedules, and institutional executive orders.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded border border-blue-200">
                {item.category}
              </span>
              <span className="text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {item.summary}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[10px]">Doc Ref: CIR-2026-{item.id.replace('ann-', '')}</span>
              <button className="text-blue-600 hover:underline font-bold flex items-center space-x-1">
                <Download className="w-3.5 h-3.5" />
                <span>PDF Gazette</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
