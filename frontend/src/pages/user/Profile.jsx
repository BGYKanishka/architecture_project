import { useState, useEffect } from "react";
import UserService from "../../services/user.service";
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
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <div className="bg-rose-950/70 text-rose-300 p-4 rounded-xl shadow border border-rose-800/60">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0f1422] rounded-xl overflow-hidden border border-slate-800">

          {/* Header Section */}
          <div className="bg-[#0b0f19] border-b border-slate-800 px-8 py-8 text-center">
            <div>
              <div className="w-16 h-16 bg-indigo-600 rounded-lg mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 border border-indigo-500/30">
                {profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h1 className="text-2xl font-bold text-white mb-1.5">{profile?.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-indigo-400" />
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Personal & Business Information
              </h2>
              {saveMessage && (
                <span className={`text-xs font-medium ${saveMessage.includes("Failed") ? "text-rose-400" : "text-emerald-400"}`}>
                  {saveMessage}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email is typically read-only */}
              <ProfileItem
                icon={<EnvelopeIcon className="w-5 h-5 text-indigo-400" />}
                label="Email Address"
                value={profile?.email}
                readOnly={true}
              />

              {/* Editable Fields */}
              <EditableProfileItem
                icon={<UserCircleIcon className="w-5 h-5 text-indigo-400" />}
                label="Full Name"
                name="name"
                value={isEditing ? editForm.name : profile?.name}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableProfileItem
                icon={<PhoneIcon className="w-5 h-5 text-indigo-400" />}
                label="Contact Number"
                name="contactNumber"
                value={isEditing ? editForm.contactNumber : (profile?.contactNumber || "Not provided")}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableProfileItem
                icon={<BriefcaseIcon className="w-5 h-5 text-indigo-400" />}
                label="Business / Imprint Name"
                name="businessName"
                value={isEditing ? editForm.businessName : (profile?.businessName || "N/A")}
                isEditing={isEditing}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-800">
              {/* Change Password Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="mr-auto flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition"
                >
                  <KeyIcon className="w-4 h-4 text-indigo-400" /> Change Password
                </button>
              )}

              {isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-xs font-medium transition border border-slate-800"
                    disabled={saveLoading}
                  >
                    <XMarkIcon className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium text-xs transition"
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Saving..." : <><CheckIcon className="w-4 h-4" /> Save Changes</>}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
                >
                  <PencilSquareIcon className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 text-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="w-full bg-[#0b0f19] border border-slate-800 text-white rounded-lg px-3.5 py-2 pr-10 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    required
                    minLength={6}
                    className="w-full bg-[#0b0f19] border border-slate-800 text-white rounded-lg px-3.5 py-2 pr-10 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="w-full bg-[#0b0f19] border border-slate-800 text-white rounded-lg px-3.5 py-2 pr-10 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {passwordMessage.text && (
                <div className={`text-xs p-3 rounded-lg font-medium ${passwordMessage.type === "error" ? "bg-rose-500/10 border border-rose-500/20 text-rose-300" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"}`}>
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-slate-400 font-medium hover:text-white rounded-lg transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition text-xs"
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
  <div className={`p-4 rounded-lg bg-[#0b0f19] border border-slate-800 ${readOnly ? "opacity-90" : ""} ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      {icon}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
    <div className="text-white font-medium pl-7 text-xs">
      {value}
    </div>
  </div>
);

// Helper for editable items
const EditableProfileItem = ({ icon, label, name, value, isEditing, onChange, fullWidth }) => (
  <div className={`p-4 rounded-lg bg-[#0b0f19] border ${isEditing ? "border-indigo-500" : "border-slate-800 hover:border-slate-700"} transition ${fullWidth ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-2 text-slate-400 mb-1">
      {icon}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
    <div className="pl-7">
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-[#0f1422] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs transition"
        />
      ) : (
        <div className="text-white font-medium text-xs">{value}</div>
      )}
    </div>
  </div>
);

export default Profile;
