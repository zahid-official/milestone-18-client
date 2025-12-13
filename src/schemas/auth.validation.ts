import z from "zod";

// Zod schema for login validation
const loginZodSchema = z.object({
  // Email
  email: z
    .email({ error: "Invalid email format." })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .trim(),

  // Password
  password: z
    .string({ error: "Password is required." })
    .min(8, { error: "Password must be at least 8 characters long." })
    .trim(),
});

// Zod schema for register validation
const registerZodSchema = z
  .object({
    // Name
    name: z
      .string({ error: "Name must be a string" })
      .min(2, { error: "Name must be at least 2 characters long." })
      .max(50, { error: "Name cannot exceed 50 characters." })
      .trim(),

    // Email
    email: z
      .email({ error: "Invalid email format" })
      .min(5, { error: "Email must be at least 5 characters long." })
      .max(100, { error: "Email cannot exceed 100 characters." })
      .trim(),

    // Password
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be string",
      })
      .min(8, { error: "Password must be includes 8 characters long." })

      // Password complexity requirements
      .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
      })
      .trim(),

    // Confirm Password
    confirmPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be string",
      })
      .min(8, { error: "Password must be includes 8 characters long." })

      // Password complexity requirements
      .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number.",
      })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Zod schema for change password
const changePasswordZodSchema = z
  .object({
    // Old password
    oldPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Old password is required"
            : "Old password must be string",
      })
      .trim(),

    // New password
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "New password is required"
            : "New password must be string",
      })
      .min(8, { error: "New password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        error: "New password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        error: "New password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        error: "New password must contain at least 1 number.",
      })
      .trim(),

    // Confirm password
    confirmPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required"
            : "Confirm password must be string",
      })
      .min(8, { error: "Confirm password must be at least 8 characters long." })
      .trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "New password and confirm password do not match.",
    path: ["confirmPassword"],
  });

// Export schemas
export { loginZodSchema, registerZodSchema, changePasswordZodSchema };
