import { authenticate } from "@/auth/token";
import { sendUserRegistrationVerification } from "@/emails/user-registration";
import emailValidator from "email-validator";
import owasp from "owasp-password-strength-test";
import {
  AuthOptional,
  RegisterUserRequest,
  RegisterUserResponse,
} from "../api";
import { connection } from "../db/connections";
import { User } from "../db/entities/user";

export async function registerUser(
  headers: AuthOptional,
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  let isAdmin = false;
  if (headers.Authorization) {
    const currentUser = await authenticate(headers.Authorization);
    isAdmin = currentUser.role === "admin";
  }
  if (request.role === "admin" && !isAdmin) {
    return {
      status: "error",
      message: "Only an admin can register another admin.",
    };
  }
  if (!emailValidator.validate(request.email)) {
    return {
      status: "error",
      message: "Invalid email address format.",
    };
  }
  const passwordTest = owasp.test(request.password);
  if (!passwordTest.strong) {
    return {
      status: "error",
      message: "Password too weak: " + passwordTest.errors[0],
    };
  }
  const user = User.create({
    email: request.email,
    password: request.password,
    name: request.name,
    role: request.role,
  });
  if (isAdmin) {
    // Users created by admins don't need verification.
    user.pendingEmail = null;
    user.pendingEmailToken = null;
  }
  try {
    await connection.manager.save(user);
    await sendUserRegistrationVerification(user);
    return {
      status: "success",
      message: isAdmin
        ? "User successfully registered."
        : "Great! Please check your email inbox now.",
    };
  } catch (e) {
    if (e.message.indexOf("duplicate key value") !== -1) {
      return {
        status: "error",
        message: "This email address is already registered.",
      };
    }
    throw e;
  }
}
