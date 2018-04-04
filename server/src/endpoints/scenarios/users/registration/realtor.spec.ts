import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

test("realtor registration", async () => {
  const registerResponse = await registerUser(
    {},
    {
      email: "realtor@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Realtor",
      role: "realtor",
    },
  );
  expect(registerResponse).toMatchObject({
    status: "success",
    message: "User successfully registered.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    status: "error",
    message: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: GOOD_PASSWORD_1,
  });
  expect(correctLoginResponse).toMatchObject({
    status: "success",
    role: "realtor",
  });
  if (correctLoginResponse.status !== "success") {
    throw new Error();
  }
  expect(correctLoginResponse.jwtToken.length).toBeGreaterThan(5);
});