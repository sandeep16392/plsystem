import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { register, error } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, email, password, displayName);
    } catch {
      // error handled in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-primary-600 mb-6" data-testid="register-title">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
          <input data-testid="register-displayname" type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <input data-testid="register-username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <input data-testid="register-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <input data-testid="register-password" type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required minLength={6} />
          {error && <p data-testid="register-error" className="text-red-500 text-sm">{error}</p>}
          <button data-testid="register-submit" type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium min-h-touch">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button data-testid="switch-to-login" onClick={onSwitch} className="text-primary-600 font-medium">Sign In</button>
        </p>
      </div>
    </div>
  );
}
