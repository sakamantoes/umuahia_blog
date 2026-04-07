import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  MessageCircle,
  Newspaper,
  Bell,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Filter,
  Download,
  Search,
  Home,
  Activity,
  BarChart2,
  PieChart,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Star,
  Crown,
  Check,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [posts, setPosts] = useState([]);
  const [youths, setYouths] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "News & Updates",
    content: "",
    summary: "",
    tags: "",
    isFeatured: false,
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "General",
    priority: "Medium",
    targetCommunities: ["All Communities"],
    link: "",
    expiresAt: "",
  });
  const [imageFile, setImageFile] = useState(null); // Changed to store File object
  const [imagePreview, setImagePreview] = useState(""); // For preview only
  const [announcementImageFile, setAnnouncementImageFile] = useState(null);
  const [announcementImagePreview, setAnnouncementImagePreview] = useState("");
  const [executiveForm, setExecutiveForm] = useState({
    name: "",
    title: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const [executiveImageFile, setExecutiveImageFile] = useState(null);
  const [executiveImagePreview, setExecutiveImagePreview] = useState("");
  const [editingExecutive, setEditingExecutive] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [communities] = useState([
    "Umuahia Urban",
    "Ibeku",
    "Olokoro",
    "Ubakala",
    "Ohuhu",
    "Amachara",
    "Afugiri",
    "Umuda",
    "Umuhu",
    "Nkata",
    "Ezeleke",
    "Umuagu",
    "Umuawa",
    "Umueze",
    "Umueleke",
    "All Communities",
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    verifyToken();
    fetchAllData();
  }, []);

  const verifyToken = async () => {
    try {
      await axios.get("/api/admin/verify", {
        headers: { "x-auth-token": localStorage.getItem("adminToken") },
      });
    } catch (error) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: { "x-auth-token": token },
    };

    try {
      const [
        statsRes,
        postsRes,
        youthsRes,
        complaintsRes,
        announcementsRes,
        executivesRes,
      ] = await Promise.all([
        axios.get("/api/admin/stats", config),
        axios.get("/api/posts"),
        axios.get("/api/admin/youths", config),
        axios.get("/api/admin/complaints", config),
        axios.get("/api/announcements/admin/all", config),
        axios.get("/api/executives/admin/all", config),
      ]);

      setStats(statsRes.data.stats || {});
      setExecutives(executivesRes.data.executives);
      setPosts(postsRes.data.posts || []);
      setYouths(youthsRes.data.youths || []);
      setComplaints(complaintsRes.data.complaints || []);
      setAnnouncements(announcementsRes.data.announcements || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  // Handle image for posts - store File object for upload
  const handlePostImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle image for executives
  const handleExecutiveImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExecutiveImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setExecutiveImagePreview(previewUrl);
    }
  };

  // Handle image for announcements
  const handleAnnouncementImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnnouncementImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAnnouncementImagePreview(previewUrl);
    }
  };

  // Executive Handlers
  const handleExecutiveChange = (e) => {
    setExecutiveForm({
      ...executiveForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitExecutive = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("name", executiveForm.name);
    formDataToSend.append("title", executiveForm.title);
    formDataToSend.append("description", executiveForm.description || "");
    formDataToSend.append("order", executiveForm.order.toString());
    formDataToSend.append("isActive", executiveForm.isActive.toString());
    
    if (executiveImageFile) {
      formDataToSend.append("image", executiveImageFile);
    }

    try {
      if (editingExecutive) {
        await axios.put(`/api/executives/${editingExecutive._id}`, formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Executive updated successfully");
      } else {
        await axios.post("/api/executives", formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Executive added successfully");
      }

      setExecutiveForm({
        name: "",
        title: "",
        description: "",
        order: 0,
        isActive: true,
      });
      setExecutiveImageFile(null);
      setExecutiveImagePreview("");
      setEditingExecutive(null);
      fetchAllData();
    } catch (error) {
      console.error("Executive save error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.msg || "Error saving executive");
    }
  };

  const handleEditExecutive = (exec) => {
    setEditingExecutive(exec);
    setExecutiveForm({
      name: exec.name,
      title: exec.title,
      description: exec.description || "",
      order: exec.order,
      isActive: exec.isActive,
    });
    setExecutiveImagePreview(exec.image || "");
    setExecutiveImageFile(null); // Clear file input
  };

  const handleDeleteExecutive = async (id) => {
    if (!window.confirm("Are you sure you want to delete this executive?"))
      return;

    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`/api/executives/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Executive deleted successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Error deleting executive");
    }
  };

  const handleToggleExecutive = async (id, currentStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `/api/executives/${id}`,
        { isActive: !currentStatus },
        { headers: { "x-auth-token": token } }
      );
      toast.success(`Executive ${!currentStatus ? "activated" : "deactivated"}`);
      fetchAllData();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  // Post Handlers
  const handlePostChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("summary", formData.summary || "");
    formDataToSend.append("tags", formData.tags || "");
    formDataToSend.append("isFeatured", formData.isFeatured.toString());
    
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      if (editingPost) {
        await axios.put(`/api/posts/${editingPost._id}`, formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Post updated successfully");
      } else {
        await axios.post("/api/posts", formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Post created successfully");
      }

      setFormData({
        title: "",
        category: "News & Updates",
        content: "",
        summary: "",
        tags: "",
        isFeatured: false,
      });
      setImageFile(null);
      setImagePreview("");
      setEditingPost(null);
      fetchAllData();
    } catch (error) {
      console.error("Post save error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.msg || "Error saving post");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      content: post.content,
      summary: post.summary || "",
      tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(", ") : post.tags) : "",
      isFeatured: post.isFeatured || false,
    });
    setImagePreview(post.image || "");
    setImageFile(null);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Post deleted successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  // Complaint Handlers
  const handleUpdateComplaint = async (id, updates) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(`/api/admin/complaints/${id}`, updates, {
        headers: { "x-auth-token": token },
      });
      toast.success("Complaint updated successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Error updating complaint");
    }
  };

  // Announcement Handlers
  const handleAnnouncementChange = (e) => {
    setAnnouncementForm({
      ...announcementForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommunitySelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setAnnouncementForm({
      ...announcementForm,
      targetCommunities: selected.length ? selected : ["All Communities"],
    });
  };

  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const announcementData = {
      title: announcementForm.title,
      content: announcementForm.content,
      type: announcementForm.type,
      priority: announcementForm.priority,
      targetCommunities: announcementForm.targetCommunities,
      link: announcementForm.link || "",
      expiresAt: announcementForm.expiresAt || "",
    };

    // For announcements, if you want to support image upload similarly:
    const formDataToSend = new FormData();
    formDataToSend.append("title", announcementForm.title);
    formDataToSend.append("content", announcementForm.content);
    formDataToSend.append("type", announcementForm.type);
    formDataToSend.append("priority", announcementForm.priority);
    formDataToSend.append("targetCommunities", JSON.stringify(announcementForm.targetCommunities));
    formDataToSend.append("link", announcementForm.link || "");
    formDataToSend.append("expiresAt", announcementForm.expiresAt || "");
    
    if (announcementImageFile) {
      formDataToSend.append("image", announcementImageFile);
    }

    try {
      if (editingAnnouncement) {
        await axios.put(`/api/announcements/${editingAnnouncement._id}`, formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Announcement updated successfully");
      } else {
        await axios.post("/api/announcements", formDataToSend, {
          headers: { 
            "x-auth-token": token,
            "Content-Type": "multipart/form-data"
          },
        });
        toast.success("Announcement created successfully");
      }

      setAnnouncementForm({
        title: "",
        content: "",
        type: "General",
        priority: "Medium",
        targetCommunities: ["All Communities"],
        link: "",
        expiresAt: "",
      });
      setAnnouncementImageFile(null);
      setAnnouncementImagePreview("");
      setEditingAnnouncement(null);
      fetchAllData();
    } catch (error) {
      console.error("Announcement save error:", error);
      toast.error(error.response?.data?.msg || "Error saving announcement");
    }
  };

  const handleToggleAnnouncement = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.patch(
        `/api/announcements/${id}/toggle`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.success("Announcement status toggled");
      fetchAllData();
    } catch (error) {
      toast.error("Error toggling announcement");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`/api/announcements/${id}`, {
        headers: { "x-auth-token": token },
      });
      toast.success("Announcement deleted successfully");
      fetchAllData();
    } catch (error) {
      toast.error("Error deleting announcement");
    }
  };

  // Chart data
  const communityChartData = {
    labels: youths.slice(0, 10).map((y) => y.community),
    datasets: [
      {
        label: "Youth by Community",
        data: youths.slice(0, 10).map(() => 1),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const complaintStatusData = {
    labels: ["Pending", "In Review", "Resolved", "Closed"],
    datasets: [
      {
        data: [
          complaints.filter((c) => c.status === "Pending").length,
          complaints.filter((c) => c.status === "In Review").length,
          complaints.filter((c) => c.status === "Resolved").length,
          complaints.filter((c) => c.status === "Closed").length,
        ],
        backgroundColor: [
          "rgba(245, 158, 11, 0.5)",
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(107, 114, 128, 0.5)",
        ],
        borderColor: [
          "rgba(245, 158, 11, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(107, 114, 128, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      if (executiveImagePreview && executiveImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(executiveImagePreview);
      }
      if (announcementImagePreview && announcementImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(announcementImagePreview);
      }
    };
  }, [imagePreview, executiveImagePreview, announcementImagePreview]);

  // Render functions (keep your existing render functions - just update image preview sources)
  const renderDashboard = () => (
    // ... keep your existing dashboard render code
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Welcome back, Admin
          </h3>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your platform today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Youth</p>
              <h4 className="text-3xl font-bold mt-1">
                {stats.totalYouth || 0}
              </h4>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Complaints</p>
              <h4 className="text-3xl font-bold mt-1">
                {stats.totalComplaints || 0}
              </h4>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {stats.pendingComplaints || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending</p>
              <h4 className="text-3xl font-bold mt-1">
                {stats.pendingComplaints || 0}
              </h4>
              <p className="text-orange-100 text-xs mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Requires attention
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Posts</p>
              <h4 className="text-3xl font-bold mt-1">
                {stats.totalPosts || 0}
              </h4>
              <p className="text-purple-100 text-xs mt-2 flex items-center gap-1">
                <Star className="w-3 h-3" />
                {posts.filter((p) => p.isFeatured).length} featured
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-green-500" />
              Youth Distribution
            </h5>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          {youths.length > 0 ? (
            <Bar
              data={communityChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                  },
                },
              }}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-500" />
              Complaint Status
            </h5>
            <span className="text-sm text-gray-500">
              Total: {complaints.length}
            </span>
          </div>
          {complaints.length > 0 ? (
            <Pie
              data={complaintStatusData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              Recent Youth Registrations
            </h5>
            <button className="text-sm text-green-600 hover:text-green-700">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentYouth?.map((youth) => (
              <div
                key={youth._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {youth.fullName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {youth.community}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(youth.dateJoined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Recent Complaints
            </h5>
            <button className="text-sm text-green-600 hover:text-green-700">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentComplaints?.map((complaint) => (
              <div
                key={complaint._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      complaint.status === "Resolved"
                        ? "bg-green-100"
                        : complaint.status === "Pending"
                          ? "bg-orange-100"
                          : "bg-green-100"
                    }`}
                  >
                    <MessageCircle
                      className={`w-5 h-5 ${
                        complaint.status === "Resolved"
                          ? "text-green-600"
                          : complaint.status === "Pending"
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {complaint.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {complaint.message.substring(0, 30)}...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : complaint.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      {/* Create/Edit Post Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingPost ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {editingPost ? "Edit Post" : "Create New Post"}
        </h4>
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handlePostChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              name="category"
              value={formData.category}
              onChange={handlePostChange}
              required
            >
              <option value="News & Updates">News & Updates</option>
              <option value="Opportunities">Opportunities</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Culture">Culture</option>
              <option value="Stories">Stories</option>
              <option value="Resources">Resources</option>
            </select>

            <input
              type="text"
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
              name="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handlePostChange}
            />
          </div>

          <input
            type="text"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
            name="summary"
            placeholder="Summary (optional)"
            value={formData.summary}
            onChange={handlePostChange}
          />

          <textarea
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
            name="content"
            rows="4"
            placeholder="Post Content"
            value={formData.content}
            onChange={handlePostChange}
            required
          ></textarea>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                accept="image/*"
                onChange={handlePostImage}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/10"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
              />
              <span>Feature this post</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              {editingPost ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingPost ? "Update Post" : "Create Post"}
            </button>
            
            {editingPost && (
              <button
                type="button"
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition-all"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({
                    title: "",
                    category: "News & Updates",
                    content: "",
                    summary: "",
                    tags: "",
                    isFeatured: false,
                  });
                  setImageFile(null);
                  setImagePreview("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Manage Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-800">
            Manage Posts ({posts.length})
          </h4>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Views
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="py-3 px-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {post.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{post.views || 0}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                        onClick={() => handleEditPost(post)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => handleDeletePost(post._id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderYouths = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Title Section */}
        <div>
          <h4 className="text-lg sm:text-xl font-bold text-gray-800">
            Registered Youth ({youths.length})
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and view all youth registrations
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search youth..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Community Filter */}
          <select className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option>All Communities</option>
            {communities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Youth</p>
          <p className="text-2xl font-bold text-gray-800">{youths.length}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Male</p>
          <p className="text-2xl font-bold text-gray-800">
            {youths.filter((y) => y.gender === "Male").length}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Female</p>
          <p className="text-2xl font-bold text-gray-800">
            {youths.filter((y) => y.gender === "Female").length}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-800">
            {
              youths.filter(
                (y) =>
                  new Date(y.dateJoined).getMonth() === new Date().getMonth(),
              ).length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                #
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Location
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Age/Gender
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Occupation
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {youths.map((youth, index) => (
              <tr
                key={youth._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {youth.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {youth.fullName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {youth.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {youth.phone}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-800">
                      {youth.community}
                    </div>
                    <div className="text-xs text-gray-500">{youth.village}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-800">
                      {youth.age} years
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {youth.gender}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {youth.occupation || "-"}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600">
                    {new Date(youth.dateJoined).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(youth.dateJoined).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-bold text-gray-800">
            Complaints & Remarks ({complaints.length})
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Manage and respond to user complaints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Review</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Message
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Priority
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4 font-medium text-gray-800">
                  {complaint.name}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {complaint.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {complaint.message.substring(0, 40)}...
                </td>
                <td className="py-3 px-4">
                  <select
                    className={`text-xs px-2 py-1 rounded-lg border-0 font-medium ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : complaint.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : complaint.status === "In Review"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                    value={complaint.status}
                    onChange={(e) =>
                      handleUpdateComplaint(complaint._id, {
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    className="text-xs px-2 py-1 bg-gray-100 rounded-lg border-0 font-medium"
                    value={complaint.priority}
                    onChange={(e) =>
                      handleUpdateComplaint(complaint._id, {
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, {
                        status: "Resolved",
                      })
                    }
                    title="Mark as Resolved"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      {/* Create Announcement Card */}
      <div className="bg-gradient-to-br from-purple-600 to-green-600 rounded-2xl p-6 text-white shadow-xl">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingAnnouncement ? <Edit className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
        </h4>
        <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            name="title"
            placeholder="Announcement Title"
            value={announcementForm.title}
            onChange={handleAnnouncementChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white"
              name="type"
              value={announcementForm.type}
              onChange={handleAnnouncementChange}
              required
            >
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Event">Event</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Alert">Alert</option>
            </select>

            <select
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white"
              name="priority"
              value={announcementForm.priority}
              onChange={handleAnnouncementChange}
              required
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent</option>
            </select>

            <input
              type="datetime-local"
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white"
              name="expiresAt"
              value={announcementForm.expiresAt}
              onChange={handleAnnouncementChange}
            />
          </div>

          <textarea
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            name="content"
            rows="3"
            placeholder="Announcement Content"
            value={announcementForm.content}
            onChange={handleAnnouncementChange}
            required
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Target Communities
              </label>
              <select
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white"
                multiple
                size="3"
                value={announcementForm.targetCommunities}
                onChange={handleCommunitySelection}
              >
                {communities.map((comm) => (
                  <option key={comm} value={comm}>
                    {comm}
                  </option>
                ))}
              </select>
              <p className="text-xs text-white/50 mt-1">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-2">
                Additional Info
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white mb-3"
                name="link"
                placeholder="Link (optional)"
                value={announcementForm.link}
                onChange={handleAnnouncementChange}
              />

              <input
                type="file"
                className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                accept="image/*"
                onChange={handleAnnouncementImage}
              />
              {announcementImagePreview && (
                <div className="mt-2">
                  <img
                    src={announcementImagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              {editingAnnouncement ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
            </button>
            
            {editingAnnouncement && (
              <button
                type="button"
                className="px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 rounded-xl font-semibold transition-all"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setAnnouncementForm({
                    title: "",
                    content: "",
                    type: "General",
                    priority: "Medium",
                    targetCommunities: ["All Communities"],
                    link: "",
                    expiresAt: "",
                  });
                  setAnnouncementImageFile(null);
                  setAnnouncementImagePreview("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Manage Announcements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-800">
            Manage Announcements ({announcements.length})
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Active: {announcements.filter((a) => a.isActive).length}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-sm text-gray-500">
              Expired: {announcements.filter((a) => !a.isActive).length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Target
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Expires
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann) => (
                <tr
                  key={ann._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="py-3 px-4">
                    {ann.image && (
                      <img
                        src={ann.image}
                        alt={ann.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {ann.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ann.type === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : ann.type === "Event"
                            ? "bg-green-100 text-green-700"
                            : ann.type === "Alert"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ann.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ann.priority === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : ann.priority === "High"
                            ? "bg-orange-100 text-orange-700"
                            : ann.priority === "Medium"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ann.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-[150px]">
                      <p className="text-sm text-gray-600 truncate">
                        {ann.targetCommunities?.join(", ")}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ann.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ann.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {ann.expiresAt
                      ? new Date(ann.expiresAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          ann.isActive
                            ? "text-orange-600 hover:bg-orange-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        onClick={() => handleToggleAnnouncement(ann._id)}
                        title={ann.isActive ? "Deactivate" : "Activate"}
                      >
                        {ann.isActive ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExecutives = () => (
    <div className="space-y-6">
      {/* Add/Edit Executive Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-green-600 to-indigo-700">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            {editingExecutive ? <Edit size={16} /> : <Plus size={16} />}
            {editingExecutive ? "Edit Executive" : "Add New Executive"}
          </h4>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmitExecutive} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  name="name"
                  placeholder="e.g., John Doe"
                  value={executiveForm.name}
                  onChange={handleExecutiveChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Position
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  name="title"
                  placeholder="e.g., President"
                  value={executiveForm.title}
                  onChange={handleExecutiveChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="description"
                rows="3"
                placeholder="Brief description about the executive..."
                value={executiveForm.description}
                onChange={handleExecutiveChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  name="order"
                  placeholder="0"
                  value={executiveForm.order}
                  onChange={handleExecutiveChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                  onChange={handleExecutiveImage}
                />
                {executiveImagePreview && (
                  <div className="mt-2">
                    <img
                      src={executiveImagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="isActive"
                  checked={executiveForm.isActive}
                  onChange={(e) =>
                    setExecutiveForm({
                      ...executiveForm,
                      isActive: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Active Status
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {editingExecutive ? "Update Executive" : "Add Executive"}
              </button>

              {editingExecutive && (
                <button
                  type="button"
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => {
                    setEditingExecutive(null);
                    setExecutiveForm({
                      name: "",
                      title: "",
                      description: "",
                      order: 0,
                      isActive: true,
                    });
                    setExecutiveImageFile(null);
                    setExecutiveImagePreview("");
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Executives List Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users size={20} /> Manage Executives{" "}
              <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-full">
                {executives.length} total
              </span>
            </h4>

            {/* Quick Stats */}
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {executives.filter((e) => e.isActive).length} Active
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {executives.filter((e) => !e.isActive).length} Inactive
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Profile
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executives.map((exec) => (
                  <tr
                    key={exec._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={exec.image}
                            alt={exec.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/50?text=Error";
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {exec.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{exec.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        #{exec.order}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exec.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {exec.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => handleEditExecutive(exec)}
                          title="Edit Executive"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            exec.isActive
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                          onClick={() =>
                            handleToggleExecutive(exec._id, exec.isActive)
                          }
                          title={exec.isActive ? "Deactivate" : "Activate"}
                        >
                          {exec.isActive ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteExecutive(exec._id)}
                          title="Delete Executive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {executives.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No executives yet
                </h3>
                <p className="text-sm text-gray-500">
                  Get started by adding your first executive above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">
                  Admin
                </span>{" "}
                Dashboard
              </h2>
              <p className="text-xs text-gray-500">
                Manage your platform efficiently
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-6">
              <div className="space-y-1">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-green-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "posts"
                      ? "bg-gradient-to-r from-green-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  <Newspaper className="w-5 h-5" />
                  <span className="font-medium">Posts</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {posts.length}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "youths"
                      ? "bg-gradient-to-r from-green-600 to-yellow-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("youths")}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Youth List</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {youths.length}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "complaints"
                      ? "bg-gradient-to-r from-green-600 to-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("complaints")}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Complaints</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {complaints.length}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "announcements"
                      ? "bg-gradient-to-r from-green-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("announcements")}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Announcements</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {announcements.length}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "executives"
                      ? "bg-gradient-to-r from-green-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("executives")}
                >
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">Executives</span>
                  <span className="ml-auto bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {executives.length}
                  </span>
                </button>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h6 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Stats
                </h6>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Youth:</span>
                    <span className="font-bold text-gray-800">
                      {stats.totalYouth || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Posts:</span>
                    <span className="font-bold text-gray-800">
                      {posts.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Pending Complaints:
                    </span>
                    <span className="font-bold text-orange-600">
                      {stats.pendingComplaints || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Active Announcements:
                    </span>
                    <span className="font-bold text-green-600">
                      {announcements.filter((a) => a.isActive).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "posts" && renderPosts()}
              {activeTab === "youths" && renderYouths()}
              {activeTab === "complaints" && renderComplaints()}
              {activeTab === "announcements" && renderAnnouncements()}
              {activeTab === "executives" && renderExecutives()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;