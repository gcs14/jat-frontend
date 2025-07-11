import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (!/^[A-Za-z\s]{3,50}$/.test(name)) {
      newErrors.name = 'Name must be 3–50 characters, letters only.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (email.length < 7 || email.length > 25 || !email.includes('@')) {
      newErrors.email = 'Email must be 7–25 characters and include "@"';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits and contain no letters.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters.';
    } else if (/(.)\1\1/.test(password)) {
      newErrors.password = 'No character can repeat 3 or more times in a row.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("https://jat.azurewebsites.net/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      });

      const result = await response.text();

      if (response.ok) {
        alert("User registered successfully!");
        navigate("/login");
      } else if (response.status === 400 && result === "User already exists.") {
        alert("This email is already in use.");
      } else {
        alert("Registration failed: " + result);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred while registering.");
    }
  };

  const inputClasses = "w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClasses} />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
