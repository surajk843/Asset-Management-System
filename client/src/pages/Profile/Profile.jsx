import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/axios";

function Profile() {

    const { user, login, token } = useAuth();

    // ==========================================
    // PASSWORD FORM VISIBILITY
    // ==========================================

    const [showPasswordForm, setShowPasswordForm] = useState(false);


    // ==========================================
    // PROFILE STATE
    // ==========================================

    const [profile, setProfile] = useState(null);

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
    });


    // ==========================================
    // PASSWORD STATE
    // ==========================================

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
    });


    // ==========================================
    // LOADING STATE
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);


    // ==========================================
    // GET PROFILE
    // ==========================================

    const fetchProfile = async () => {

        try {

            const response = await api.get("/profile");

            setProfile(response.data);

            setFormData({
                full_name: response.data.full_name || "",
                email: response.data.email || "",
            });

        } catch (error) {

            console.error("Profile Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // ==========================================
    // PROFILE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };


    // ==========================================
    // PASSWORD INPUT CHANGE
    // ==========================================

    const handlePasswordChange = (e) => {

        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await api.put("/profile", formData);

            toast.success("Profile updated successfully");

            await fetchProfile();


            // Keep AuthContext / localStorage user data updated

            if (user && token) {

                login(
                    {
                        ...user,
                        full_name: formData.full_name,
                        email: formData.email,
                    },
                    token
                );

            }

            setEditing(false);

        } catch (error) {

            console.error("Update Profile Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();


        // Validate fields

        if (
            passwordData.current_password.trim() === "" ||
            passwordData.new_password.trim() === ""
        ) {

            toast.error("Please fill both password fields");

            return;

        }


        try {

            setChangingPassword(true);


            await api.put(
                "/profile/password",
                passwordData
            );


            toast.success("Password changed successfully");


            // Clear password fields

            setPasswordData({
                current_password: "",
                new_password: "",
            });


            // Hide password form after successful change

            setShowPasswordForm(false);


        } catch (error) {

            console.error("Password Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setChangingPassword(false);

        }

    };


    // ==========================================
    // ROLE
    // ==========================================

    const roleName =
        Number(profile?.role_id) === 1
            ? "Administrator"
            : "Employee";


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="flex min-h-[300px] items-center justify-center">

                    <p className="font-medium text-slate-500">
                        Loading profile...
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <DashboardLayout>

            <div className="max-w-3xl space-y-6">


                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        My Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage your account information.
                    </p>

                </div>


                {/* ==========================================
                    PROFILE CARD
                ========================================== */}

                <div className="rounded-xl bg-white p-6 shadow-sm">


                    {/* PROFILE HEADER */}

                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">

                        <div className="flex items-center gap-4">


                            {/* PROFILE INITIAL */}

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">

                                {profile?.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}

                            </div>


                            {/* NAME + ROLE */}

                            <div>

                                <h2 className="text-lg font-semibold text-slate-800">

                                    {profile?.full_name || "User"}

                                </h2>

                                <p className="text-sm text-slate-500">
                                    {roleName}
                                </p>

                            </div>

                        </div>


                        {/* EDIT PROFILE BUTTON */}

                        {!editing && (

                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>

                        )}

                    </div>


                    {/* ==========================================
                        EDIT PROFILE
                    ========================================== */}

                    {editing ? (

                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-5"
                        >


                            {/* FULL NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>


                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    disabled={saving}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    ) : (

                        /* ==========================================
                           VIEW PROFILE
                        ========================================== */

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                            {/* USER ID */}

                            <div>

                                <p className="text-xs font-medium uppercase text-slate-400">
                                    User ID
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {profile?.user_id || "-"}
                                </p>

                            </div>


                            {/* ROLE */}

                            <div>

                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Role
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {roleName}
                                </p>

                            </div>


                            {/* FULL NAME */}

                            <div className="md:col-span-2">

                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Full Name
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {profile?.full_name || "-"}
                                </p>

                            </div>


                            {/* EMAIL */}

                            <div className="md:col-span-2">

                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {profile?.email || "-"}
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* ==========================================
                    CHANGE PASSWORD CARD
                ========================================== */}

                <div className="rounded-xl bg-white p-6 shadow-sm">


                    {/* PASSWORD HEADER */}

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <h2 className="text-lg font-semibold text-slate-800">
                                Change Password
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Update your account password.
                            </p>

                        </div>


                        {/* SHOW / HIDE PASSWORD FORM */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordForm(
                                    (previous) => !previous
                                )
                            }
                            className="shrink-0 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >

                            {showPasswordForm
                                ? "Cancel"
                                : "Change Password"}

                        </button>

                    </div>


                    {/* ==========================================
                        PASSWORD FORM
                    ========================================== */}

                    {showPasswordForm && (

                        <form
                            onSubmit={handleChangePassword}
                            className="mt-6 space-y-5 border-t border-slate-100 pt-6"
                        >


                            {/* CURRENT PASSWORD */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            {/* NEW PASSWORD */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            {/* PASSWORD SUBMIT */}

                            <div className="flex justify-end">

                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {changingPassword
                                        ? "Changing Password..."
                                        : "Change Password"}

                                </button>

                            </div>

                        </form>

                    )}

                </div>


            </div>

        </DashboardLayout>

    );

}

export default Profile;