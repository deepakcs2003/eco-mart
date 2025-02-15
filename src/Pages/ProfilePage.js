import React, { useState } from 'react';
import { 
    Bell, 
    Settings, 
    Camera, 
    Mail, 
    Phone,
    MapPin, 
    Globe, 
    Twitter,
    Linkedin,
    Github
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    googleId: "117727273824922",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "admin",
    bio: "Senior Full Stack Developer with 5+ years of experience in building scalable applications.",
    website: "www.johndoe.dev",
    social: {
      twitter: "@johndoe",
      linkedin: "john-doe",
      github: "johndoe"
    },
    createdAt: new Date("2024-01-15"),
    stats: {
      projects: 15,
      contributions: 234,
      followers: 1200
    }
  });

  const [editForm, setEditForm] = useState(userData);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUserData(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const TabButton = ({ label, tabName }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors
        ${activeTab === tabName 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-2xl font-bold text-blue-500">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );

  const SocialLink = ({ icon: Icon, label, link }) => (
    <a 
      href={`https://${link}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <div className="flex space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative transition-colors duration-200">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div className="relative">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={userData.profile_picture} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-1/3 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors duration-200">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2
                  ${userData.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>{userData.website}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <SocialLink icon={Twitter} label={userData.social.twitter} link="twitter.com" />
                <SocialLink icon={Linkedin} label={userData.social.linkedin} link="linkedin.com" />
                <SocialLink icon={Github} label={userData.social.github} link="github.com" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Projects" value={userData.stats.projects} />
              <StatCard label="Contributions" value={userData.stats.contributions} />
              <StatCard label="Followers" value={userData.stats.followers} />
            </div>

            {/* Tabs and Content */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex space-x-4">
                  <TabButton label="Overview" tabName="overview" />
                  <TabButton label="Edit Profile" tabName="edit" />
                  <TabButton label="Settings" tabName="settings" />
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                      <p className="mt-2 text-gray-600">{userData.bio}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'edit' && (
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                    <p className="text-gray-600">Settings options will be added here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;