import { useState } from "react";

function Login({ onLogin }) {

    const [isRegister, setIsRegister] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        const endpoint = isRegister
            ? "/auth/register"
            : "/auth/login";

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        if (isRegister) {
            alert("Registration successful. Please login.");
            setIsRegister(false);
        } else {
            onLogin();
        }
    };


    return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">

        {/* Logo */}
        <nav className="w-full">
            <ul className="flex justify-center text-[#5738aa] font-extrabold text-xl italic mt-4">
                <li>
                    PASSWORD-STASH
                </li>
            </ul>
        </nav>

        {/* Login / Register Card */}
        <div className="w-full max-w-md mt-20 px-6">

            <div className="border border-[#5738aa] rounded-xl p-8">

                <h1 className="text-l  font-extrabold text-center text-[#5738aa] mb-8">
                    {isRegister ? "CREATE ACCOUNT" : "LOGIN"}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-gray-300 outline-none focus:border-[#5738aa]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-gray-300 outline-none focus:border-[#5738aa]"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-[#5738aa] text-white font-semibold py-3 rounded-lg hover:bg-[#6948bd] transition duration-200 mt-2"
                    >
                        {isRegister ? "Register" : "Login"}
                    </button>

                </form>

                {/* Toggle */}
                <div className="text-center mt-6">

                    <p className="text-sm text-gray-400">
                        {isRegister
                            ? "Already have an account?"
                            : "Don't have an account?"}
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-[#5738aa] font-semibold text-sm mt-1 hover:text-[#6948bd] transition duration-200"
                    >
                        {isRegister ? "Login" : "Register"}
                    </button>

                </div>

            </div>

        </div>

    </div>
);
}

export default Login;