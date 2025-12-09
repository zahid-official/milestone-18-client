import ManagementTableHeader from "@/components/modules/dashboard/table/ManagementTableHeader";

// ChangePasswordPage Component
const ChangePasswordPage = () => {
  return (
    <div>
      <h1>Welcome to the ChangePasswordPage Component</h1>
      <ManagementTableHeader
        title="Hello"
        description="Bellow"
        action={{ label: "Add Vendor" }}
      />
    </div>
  );
};

export default ChangePasswordPage;
