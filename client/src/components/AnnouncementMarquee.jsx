import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Megaphone,
  AlertTriangle,
  Calendar,
  Link as LinkIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = useState([]);
  const [urgentAnnouncements, setUrgentAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
    fetchUrgentAnnouncements();

    const interval = setInterval(() => {
      fetchAnnouncements();
      fetchUrgentAnnouncements();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const Api  = 'https://umuahia-blog-2.onrender.com/api/announcements'; // Update with your actual API URL

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${Api}`);
      setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUrgentAnnouncements = async () => {
    try {
      const res = await axios.get(`${Api}/urgent`);
      setUrgentAnnouncements(res.data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent":
        return <AlertTriangle className="w-3.5 h-3.5 text-red-300" />;
      case "High":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Megaphone className="w-3.5 h-3.5 text-blue-300" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-600/30";
      case "High":
        return "bg-gradient-to-r from-amber-500 to-amber-400 shadow-lg shadow-amber-500/30";
      case "Medium":
        return "bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400 shadow-lg shadow-gray-500/30";
    }
  };

  const getBackgroundColor = () => {
    if (urgentAnnouncements.length > 0) {
      return "bg-gradient-to-r from-red-600 via-red-500 to-rose-600";
    }
    return "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600";
  };

  const allAnnouncements = [
    ...urgentAnnouncements,
    ...announcements.filter(
      (a) => !urgentAnnouncements.some((ua) => ua._id === a._id)
    ),
  ];

  if (allAnnouncements.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white py-3 overflow-hidden border-b border-gray-600/50">
        <div className="flex items-center gap-3 animate-marquee whitespace-nowrap px-4">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-600/50">
            <Megaphone className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span className="text-sm font-medium text-gray-200">No current announcements. Check back later.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden py-2.5 ${getBackgroundColor()} text-white shadow-lg border-b border-white/10`}
    >
      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused] items-center">
        {/* Live indicator */}
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-black/20 to-transparent w-20 z-10 pointer-events-none"></div>
        
        {allAnnouncements.map((ann, index) => (
          <div key={ann._id} className="flex items-center gap-4 mx-6 group">
            {/* Priority Badge */}
            <span
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                ann.priority
              )} backdrop-blur-sm border border-white/20`}
            >
              {getPriorityIcon(ann.priority)}
              {ann.priority}
              <Sparkles className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </span>

            {/* Title */}
            <span className="font-semibold text-sm tracking-wide">{ann.title}:</span>

            {/* Content */}
            <span className="opacity-90 text-sm font-light">
              {ann.content.substring(0, 80)}...
            </span>

            {/* Event Icon */}
            {ann.type === "Event" && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Event</span>
              </div>
            )}

            {/* Link */}
            {ann.link && (
              <a
                href={ann.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  axios.post(`/api/announcements/${ann._id}/view`)
                }
                className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all duration-300 group/link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Learn More</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </a>
            )}

            {/* Separator */}
            {index < allAnnouncements.length - 1 && (
              <span className="opacity-30 text-lg font-light mx-2">|</span>
            )}
          </div>
        ))}

        {/* Duplicate for smooth infinite scroll */}
        {allAnnouncements.map((ann) => (
          <div key={`dup-${ann._id}`} className="flex items-center gap-4 mx-6">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                ann.priority
              )} border border-white/20`}
            >
              {getPriorityIcon(ann.priority)}
              {ann.priority}
            </span>

            <span className="font-semibold text-sm">{ann.title}:</span>

            <span className="opacity-90 text-sm">
              {ann.content.substring(0, 80)}...
            </span>

            {ann.type === "Event" && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gradient edges for better visibility */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
    </div>
  );
}

export default AnnouncementMarquee;