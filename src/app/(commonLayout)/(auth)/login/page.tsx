import LoginForm from "@/components/modules/auth/LoginForm";
import PageBanner from "@/components/shared/PageBanner";

// LoginPage Component
const LoginPage = () => {
  return (
    <div>
      <PageBanner
        heading="Welcome back"
        subHeading="Sign in to access your Lorvic account, track orders and manage your wishlist."
      />

      <div className="px-4 py-28 max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-4xl font-medium">Login</h2>
          <p className="text-muted-foreground">
            Please fill your email and password to login
          </p>
        </div>

        {/* Login form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
