import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const FloatingLabelInput = ({ id, type, label, value, onChange, icon: Icon, rightElement }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <div className={`absolute left-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none transition-colors duration-300 ${isFocused || value ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400'}`}>
        {Icon && <Icon size={20} />}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-white/50 dark:bg-gray-800/50 border-2 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-300 ${isFocused
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          } ${rightElement ? 'pr-12' : ''} text-gray-900 dark:text-white placeholder-transparent`}
        placeholder={label}
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFocused || value
          ? 'top-[-10px] text-xs bg-white dark:bg-gray-800 px-2 text-indigo-500 font-medium rounded-full'
          : 'top-3.5 text-gray-500 dark:text-gray-400'
          }`}
      >
        {label}
      </label>
      {rightElement && (
        <div className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">
          {rightElement}
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      // Min wait time for animation smoothness
      await new Promise(resolve => setTimeout(resolve, 800));

      const role = res.data.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'organization') navigate('/organization/dashboard');
      else if (role === 'worker') navigate('/worker/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">



      <div className="container max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

        {/* Left Side: Brand/Welcome (Hidden on mobile for cleaner look or shown above) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block w-full md:w-1/2 text-left"
        >
          <div className="inline-block p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl mb-8 border border-white/50 dark:border-gray-700">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
            Track your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
              complaints
            </span>{" "}
            with ease.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
            Streamline your organization's feedback workflow. Real-time tracking, powerful analytics, and seamless resolution management all in one place.
          </p>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[450px]"
        >
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="group flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                  <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 mr-2 transition-colors">
                    <ArrowLeft size={16} />
                  </span>
                  Back home
                </Link>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="System Online" />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back!</h2>
                <p className="text-gray-500 dark:text-gray-400">Please enter your details to sign in.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center mb-6"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2.5" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                />

                <FloatingLabelInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <div className="flex justify-end mb-6">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  Create one now
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} Trackify. Protected by reCAPTCHA.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

