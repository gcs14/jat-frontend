import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditApplication() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        jobTitle: "",
        companyName: "",
        employmentType: "",
        workModel: "",
        jobLocation: "",
        status: "Pending",
        interviewDate: "",
        salaryRange: "",
        dateApplied: "",
        postingDate: "",
        closingDate: "",
        followupDate: "",
        interviewScheduled: false,
        description: ""
    });

    const [resumeFileName, setResumeFileName] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                // const response = await axios.get(`http://localhost:5169/api/applications/${id}`, {
                const response = await axios.get(`https://jat.azurewebsites.net/api/applications/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setForm({
                    jobTitle: data.jobTitle || "",
                    companyName: data.companyName || "",
                    employmentType: data.employmentType || "",
                    workModel: data.workModel || "",
                    jobLocation: data.jobLocation || "",
                    status: data.status || "pending",
                    interviewDate: data.interviewDate ? new Date(data.interviewDate).toISOString().split("T")[0] : "",
                    salaryRange: data.salaryRange || "",
                    dateApplied: data.dateApplied || "",
                    postingDate: data.postingDate ? new Date(data.postingDate).toISOString().split("T")[0] : "",
                    closingDate: data.closingDate ? new Date(data.closingDate).toISOString().split("T")[0] : "",
                    followupDate: data.followupDate ? new Date(data.followupDate).toISOString().split("T")[0] : "",
                    interviewScheduled: data.interviewScheduled || false,
                    description: data.description || ""
                });
                setResumeFileName(data.resume?.fileName || "");
            } catch (err) {
                console.error("Failed to fetch application:", err);
                alert("Could not load application.");
            }
        };
        fetchApplication();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "followupDays") {
            const days = parseInt(value);
            const baseDate = form.dateApplied ? new Date(form.dateApplied) : new Date();
            baseDate.setDate(baseDate.getDate() + days);
            setForm({ ...form, followupDate: baseDate.toISOString().split("T")[0] });
        } else {
            setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
        if (!form.companyName.trim()) newErrors.companyName = "Company name is required.";
        if (!form.employmentType.trim()) newErrors.employmentType = "Employment type is required.";
        if (!form.workModel.trim()) newErrors.workModel = "Work model is required.";
        if (!form.jobLocation.trim()) newErrors.jobLocation = "Job location is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...form,
            interviewDate: form.interviewDate || null,
            postingDate: form.postingDate || null,
            closingDate: form.closingDate || null,
            followupDate: form.followupDate || null
        };

        try {
            await axios.patch(`https://jat.azurewebsites.net/api/applications/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            navigate(`/applications/${id}`);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update application.");
        }
    };

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Job Application Tracker</h1>
                <nav>
                    <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
                    <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
                    <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
                    <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
                    <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
                </nav>
            </header>
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Edit Application</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {[
                        ["Job Title", "jobTitle"],
                        ["Company Name", "companyName"],
                        ["Employment Type", "employmentType"],
                        ["Job Location", "jobLocation"]
                    ].map(([label, name]) => (
                        <div key={name}>
                            <label className="block font-medium">{label}</label>
                            <input
                                type="text"
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                            />
                            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                        </div>
                    ))}

                    <div>
                        <label className="block font-medium">Work Model</label>
                        <select
                            name="workModel"
                            value={form.workModel}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            {["On-site", "Hybrid", "Remote"].map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Application Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            {["Pending", "Interviewing", "Rejected", "Offered"].map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Salary Range</label>
                        <input
                            type="text"
                            name="salaryRange"
                            value={form.salaryRange}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., $60k - $80k"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Posting Date</label>
                        <input
                            type="date"
                            name="postingDate"
                            value={form.postingDate}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Closing Date</label>
                        <input
                            type="date"
                            name="closingDate"
                            value={form.closingDate}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Follow Up?</label>
                        <select
                            name="followupDays"
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select...</option>
                            <option value="3">3 days</option>
                            <option value="5">5 days</option>
                            <option value="7">7 days</option>
                        </select>
                        {form.followupDate && (
                            <p className="text-sm mt-1">Send follow-up email by: {form.followupDate}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            id="interviewScheduled"
                            name="interviewScheduled"
                            checked={form.interviewScheduled}
                            onChange={handleChange}
                        />
                        <label htmlFor="interviewScheduled" className="font-medium">Interview Scheduled</label>

                        {form.interviewScheduled && (
                            <input
                                type="date"
                                name="interviewDate"
                                value={form.interviewDate}
                                onChange={handleChange}
                                className="border rounded p-2"
                            />
                        )}
                    </div>


                    <div className="col-span-2">
                        <label className="block font-medium">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            rows={4}
                        />
                    </div>

                    {resumeFileName && (
                        <div className="col-span-2">
                            <label className="block font-medium">Resume</label>
                            <a
                                href={`https://jat.azurewebsites.net/api/resumes/${resumeFileName}`}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >
                                {resumeFileName}
                            </a>
                        </div>
                    )}

                    <div className="col-span-2 text-right mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mx-2"
                        >
                            Update Application
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/applications')}
                            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition mx-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditApplication;
