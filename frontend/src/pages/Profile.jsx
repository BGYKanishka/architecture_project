import { useState, useEffect } from "react";
import UserService from "../services/user.service";
import { UserCircleIcon, BriefcaseIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, PencilSquareIcon, CheckIcon, XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    contactNumber: "",
    businessName: ""
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    UserService.getProfile()
      .then((response) => {
        setProfile(response.data);
        setEditForm({
          name: response.data.name,
          contactNumber: response.data.contactNumber || "",
          businessName: response.data.businessName || ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset form
      setEditForm({
        name: profile.name,
        contactNumber: profile.contactNumber || "",
        businessName: profile.businessName || ""
      });
      setIsEditing(false);
      setSaveMessage("");
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setSaveLoading(true);
    setSaveMessage("");

    UserService.updateProfile(editForm)
      .then((response) => {
        setProfile(response.data);

        // Update localStorage to sync header
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.name = response.data.name;
          localStorage.setItem("user", JSON.stringify(user));

          window.dispatchEvent(new Event("user-updated"));
        }

        setIsEditing(false);
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
        setSaveLoading(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setSaveMessage("Failed to update profile.");
        setSaveLoading(false);
      });
  };

  // Password Change Logic
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    UserService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
      .then(() => {
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswords({ current: false, new: false, confirm: false }); // Reset visibility
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordMessage({ type: "", text: "" });
        }, 2000);
      })
      .catch((err) => {
        console.error("Change Password Error:", err);
        let msg = "Failed to change password.";

        if (err.response && err.response.data) {
          const data = err.response.data;
          if (typeof data === 'string') {
            msg = data;
          } else if (typeof data === 'object') {
            // Check if it's a validation error map (field: message)
            const keys = Object.keys(data);
            if (keys.length > 0) {
              // If there's an "error" key, use it
              if (data.error) {
                msg = data.error;
              } else if (data.message) {
                msg = data.message;
              } else {
                // Otherwise it's likely validation errors, just take the first one
                msg = `${keys[0]}: ${data[keys[0]]}`;
              }
            }
          }
        }

        setPasswordMessage({ type: "error", text: msg });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative">

          {/* Header Section */}
          <div className="bg-blue-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-black"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center text-blue-900 text-4xl font-black shadow-lg mb-4 ring-4 ring-blue-800/50">
                {profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{profile?.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/50 text-blue-100 text-sm font-medium border border-blue-700 backdrop-blur-sm">
                <ShieldCheckIcon className="w-4 h-4" />
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-10">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
              <h2 className="text-xl font-bold text-slate-800">
                Personal Information
              </h2>
              {saveMessage && (
                <span className={`text - sm font - bold ${saveMessage.includes("Failed") ? "text-red-500" : "text-green-600"} `}>
                  {saveMessage}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email is typically read-only */}
              <ProfileItem
                icon={<EnvelopeIcon className="w-5 h-5" />}
                label="Email Address"
                value={profile?.email}
                readOnly={true}
              />

              {/* Editable Fields */}
              <EditableProfileItem
                icon={<UserCircleIcon className="w-5 h-5" />}
                label="Full Name"
                name="name"
                value={isEditing ? editForm.name : profile?.name}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableProfileItem
                icon={<PhoneIcon className="w-5 h-5" />}
                label="Contact Number"
                name="contactNumber"
                value={isEditing ? editForm.contactNumber : (profile?.contactNumber || "Not provided")}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableProfileItem
                icon={<BriefcaseIcon className="w-5 h-5" />}
                label="Business Name"
                name="businessName"
                value={isEditing ? editForm.businessName : (profile?.businessName || "N/A")}
                isEditing={isEditing}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <div className="mt-10 flex flex-wrap justify-end gap-3">
              {/* Change Password Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="mr-auto flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition"
                >
                  <KeyIcon className="w-5 h-5" /> Change Password
                </button>
              )}

              {isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition"
                    disabled={saveLoading}
                  >
                    <XMarkIcon className="w-5 h-5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition shadow-md shadow-blue-200"
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Saving..." : <><CheckIcon className="w-5 h-5" /> Save Changes</>}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition"
                >
                  <PencilSquareIcon className="w-5 h-5" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                <XMarkIcon className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={submitPasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    required
                    minLength={6}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {passwordMessage.text && (
                <div className={`text-sm p-3 rounded-lg font-medium ${passwordMessage.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper for read-only items
const ProfileItem = ({ icon, label, value, readOnly, fullWidth }) => (
  <div className={`p-4 rounded-xl bg-slate-50 border border-slate-100 ${readOnly ? "opacity-75" : ""} ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-3 text-slate-400 mb-2">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-slate-800 font-semibold pl-8">
      {value}
    </div>
  </div>
);

// Helper for editable items
const EditableProfileItem = ({ icon, label, name, value, isEditing, onChange, fullWidth }) => (
  <div className={`p-4 rounded-xl bg-slate-50 border ${isEditing ? "border-blue-200 bg-blue-50/30" : "border-slate-100 hover:border-slate-200"} transition ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-3 text-slate-400 mb-2">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="pl-8">
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      ) : (
        <div className="text-slate-800 font-semibold">{value}</div>
      )}
    </div>
  </div>
);

export default Profile;
