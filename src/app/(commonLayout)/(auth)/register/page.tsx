import RegisterForm from "@/components/modules/auth/RegisterForm";
import PageBanner from "@/components/shared/PageBanner";

// RegisterPage Component
const RegisterPage = () => {
  return (
    <div>
      <PageBanner
        heading="Join us now"
        subHeading="Join Lorvic to check out faster, track every order and save the pieces you love."
      />

      <div className="px-4 py-28 max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-4xl font-semibold">Register</h2>
          <p className="text-muted-foreground">
            Fill in your details to set up your Lorvic account
          </p>
        </div>

        {/* Register form */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
