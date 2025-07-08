import React, { useState } from "react";

export default function SignUp() {
  const [password, setPassword] = useState("");

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthText = ["Too weak", "Weak", "Medium", "Strong"][strength];

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Form submitted");
    // 추가 처리 로직 작성 가능
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#1E2028] text-black dark:text-white">
      {/* Header */}
      <header className="w-full border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img
                src="https://cdn.startupful.io/img/app_logo/no_img.png"
                alt="Logo"
                className="w-10 h-10"
              />
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Products</a>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Solutions</a>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Resources</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {["Account", "Profile", "Complete"].map((label, idx) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    idx === 0 ? "bg-indigo-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs mt-2 ${
                    idx === 0 ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"
                  }`}>{label}</span>
                </div>
                {idx < 2 && (
                  <div className="flex-1 flex items-center px-4">
                    <div className={`h-0.5 w-full ${
                      idx === 0 ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <div className="bg-gray-50 dark:bg-[#252731] rounded-2xl p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your details to get started with your free account.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 이름 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E2028] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E2028] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Work email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E2028] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E2028] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded-full ${
                          i < strength
                            ? strength === 1
                              ? "bg-red-500"
                              : strength === 2
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Password strength: {strengthText}
                </p>
              </div>

              {/* 회사 */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">Company name</label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E2028] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* 약관 동의 */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 dark:border-gray-600 text-indigo-500 focus:ring-indigo-500" required />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    I agree to the <a href="#" className="text-indigo-500 hover:text-indigo-600">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-600">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 dark:border-gray-600 text-indigo-500 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Send me occasional product updates, announcements, and offers.
                  </span>
                </label>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-[#252731] transition-colors"
              >
                Continue to Profile
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Logo" className="w-8 h-8" />
              <span className="text-sm text-gray-500 dark:text-gray-400">© 2024 Company. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Terms</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Support</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
