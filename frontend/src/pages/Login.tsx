import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";
import Newsletter from "@/components/majori/Newsletter";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

type Errors = Partial<Record<"email" | "password", string>>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from || "/account";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: email ? undefined : "Email is required",
        password: password ? undefined : "Password is required",
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    authService.login({ email, password }).then((res) => {
      setSubmitting(false);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.first_name}`);
      navigate(redirectTo, { replace: true });
    }).catch((error: unknown) => {
      setSubmitting(false);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed";
      toast.error(message);
    });
  };

  return (
    <PageLayout>
      <PageHeader
        title="Login"
        crumbs={[{ label: "Home", to: "/" }, { label: "Account" }, { label: "Login" }]}
      />

      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 md:p-10 rounded-md">
            <h2 className="font-display text-2xl font-semibold mb-2">Login</h2>
            <p className="text-mute text-sm mb-6">Welcome back. Please enter your details.</p>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="login-email" className="text-sm font-medium block mb-1">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                />
                {errors.email && <p className="text-xs text-accent mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="login-password" className="text-sm font-medium block mb-1">
                  Password <span className="text-accent">*</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                />
                {errors.password && <p className="text-xs text-accent mt-1">{errors.password}</p>}
              </div>
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/auth/forgot-password" className="hover:text-brand">Forgot password?</Link>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-brand transition rounded disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs text-mute">
              <div className="flex-1 h-px bg-ink/10" />
              OR
              <div className="flex-1 h-px bg-ink/10" />
            </div>
            <div className="space-y-3">
              <button type="button" className="w-full border border-ink/15 py-3 rounded text-sm hover:bg-cream flex items-center justify-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22 12c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4C20.9 17.8 22 15.1 22 12z" />
                  <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.7 8 22 12 22z" />
                  <path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.3-.3-1.9s.1-1.3.3-1.9V7.1H2.7C2 8.6 1.6 10.2 1.6 12s.4 3.4 1.1 4.9l3.5-2.7z" />
                  <path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3C17.2 2.2 14.8 1.2 12 1.2 8 1.2 4.4 3.5 2.7 7.1l3.5 2.7C7 7.3 9.3 5.4 12 5.4z" />
                </svg>
                Continue with Google
              </button>
              <button type="button" className="w-full border border-ink/15 py-3 rounded text-sm hover:bg-cream flex items-center justify-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 13c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.4-2.8-.1 0-2.7-1-2.8-4.1zm-2.5-7.5c.7-.8 1.2-2 1-3.2-1 .1-2.3.7-3 1.5-.7.7-1.3 1.9-1.1 3.1 1.2.1 2.4-.6 3.1-1.4z" />
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-md">
            <h2 className="font-display text-2xl font-semibold mb-2">New Customer</h2>
            <p className="text-mute text-sm mb-6">
              Create an account to enjoy faster checkout, order tracking and exclusive offers.
            </p>
            <ul className="space-y-3 text-sm text-ink/80 mb-8">
              <li className="flex gap-3"><span className="text-brand">✓</span> Track your orders in real time</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Save your favourites to wishlist</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Get early access to new collections</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Member-only sales and rewards</li>
            </ul>
            <Link
              to="/signup"
              className="inline-block border border-ink px-7 py-3 uppercase tracking-wider text-sm hover:bg-ink hover:text-white transition rounded"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </PageLayout>
  );
};

export default Login;
