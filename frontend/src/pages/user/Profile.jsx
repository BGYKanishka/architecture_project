import { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { UserCircleIcon, BriefcaseIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

  useEffect(() => {
    fetchProfile();
  }, []);

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

        // Update the non-sensitive display profile used by the header.
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
          user.name = response.data.name;
          sessionStorage.setItem("user", JSON.stringify(user));

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
              {!isEditing && (
                <p className="mr-auto self-center text-[11px] text-slate-500">
                  Password and recovery are managed by Cognito. Use “Forgot password” on the sign-in page to reset it.
                </p>
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
