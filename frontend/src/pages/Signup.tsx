import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";
import Newsletter from "@/components/majori/Newsletter";
import { authService } from "@/services/authService";

type Errors = Partial<
  Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword" | "acceptTerms", string>
>;

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || password !== confirmPassword || !acceptTerms) {
      setErrors({
        firstName: firstName ? undefined : "First name is required",
        lastName: lastName ? undefined : "Last name is required",
        email: email ? undefined : "Email is required",
        password: password ? undefined : "Password is required",
        confirmPassword: password === confirmPassword ? undefined : "Passwords do not match",
        acceptTerms: acceptTerms ? undefined : "Please accept terms",
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    authService.register({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }).then((res) => {
      setSubmitting(false);
      toast.success(res.message || "Account created. Please verify your email.");
      navigate("/login");
    }).catch((error: unknown) => {
      setSubmitting(false);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Registration failed";
      toast.error(message);
    });
  };

  return (
    <PageLayout>
      <PageHeader
        title="Create Account"
        crumbs={[{ label: "Home", to: "/" }, { label: "Account" }, { label: "Sign Up" }]}
      />

      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 md:p-10 rounded-md">
            <h2 className="font-display text-2xl font-semibold mb-2">Sign Up</h2>
            <p className="text-mute text-sm mb-6">
              Create your Harshis Collections account in less than a minute.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="su-first" className="text-sm font-medium block mb-1">
                    First name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="su-first"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                    aria-invalid={!!errors.firstName}
                    className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                  />
                  {errors.firstName && <p className="text-xs text-accent mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="su-last" className="text-sm font-medium block mb-1">
                    Last name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="su-last"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={50}
                    aria-invalid={!!errors.lastName}
                    className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                  />
                  {errors.lastName && <p className="text-xs text-accent mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="su-email" className="text-sm font-medium block mb-1">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  aria-invalid={!!errors.email}
                  className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                />
                {errors.email && <p className="text-xs text-accent mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="su-password" className="text-sm font-medium block mb-1">
                  Password <span className="text-accent">*</span>
                </label>
                <input
                  id="su-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                  aria-invalid={!!errors.password}
                  aria-describedby="pw-hint"
                  className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                />
                {errors.password ? (
                  <p className="text-xs text-accent mt-1">{errors.password}</p>
                ) : (
                  <p id="pw-hint" className="text-xs text-mute mt-1">
                    At least 8 characters, one uppercase letter and one number.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="su-confirm" className="text-sm font-medium block mb-1">
                  Confirm password <span className="text-accent">*</span>
                </label>
                <input
                  id="su-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={72}
                  aria-invalid={!!errors.confirmPassword}
                  className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-accent mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded mt-1"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  aria-invalid={!!errors.acceptTerms}
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="underline hover:text-brand">
                    Terms &amp; Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-accent -mt-2">{errors.acceptTerms}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-brand transition rounded disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create Account"}
              </button>
            </form>
            <p className="text-sm text-mute mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-ink font-medium hover:text-brand">
                Sign in
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-md">
            <h2 className="font-display text-2xl font-semibold mb-2">Why Harshis Collections</h2>
            <p className="text-mute text-sm mb-6">
              Join a community of style-led, intentional shoppers.
            </p>
            <ul className="space-y-3 text-sm text-ink/80 mb-8">
              <li className="flex gap-3"><span className="text-brand">✓</span> Free shipping on orders over $100</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Easy 30-day returns</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Members-only early access drops</li>
              <li className="flex gap-3"><span className="text-brand">✓</span> Personalised style recommendations</li>
            </ul>
            <div className="bg-cream rounded p-5 text-sm">
              <p className="font-medium mb-1">A note on accounts</p>
              <p className="text-mute">
                Your account is created in the live Harshis backend and can be used for
                cart, checkout and order history.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </PageLayout>
  );
};

export default Signup;
