import SelectTableData from "@/components/modules/dashboard/table/SelectTableData";
import { userRole } from "@/constants/userRole";

// ChangePasswordPage Component
const ChangePasswordPage = () => {
  const roleOptions = Object.values(userRole).map((role) => ({
    label: role.charAt(0) + role.slice(1).toLowerCase(),
    value: role,
  }));

  return (
    <div>
      <h1>Welcome to the ChangePasswordPage Component</h1>
      <SelectTableData
        paramName="role"
        placeholder="Select a role"
        options={roleOptions}
      />
    </div>
  );
};

export default ChangePasswordPage;
