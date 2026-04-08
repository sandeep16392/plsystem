import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      // error handled in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-primary-600 mb-6" data-testid="login-title">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <input
            data-testid="login-username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-base"
            required
          />
          <input
            data-testid="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-base"
            required
          />
          {error && <p data-testid="login-error" className="text-red-500 text-sm">{error}</p>}
          <button
            data-testid="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium min-h-touch"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button data-testid="switch-to-register" onClick={onSwitch} className="text-primary-600 font-medium">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
