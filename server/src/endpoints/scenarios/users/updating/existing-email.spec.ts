import { registerUser } from "@/endpoints/registerUser";
import { updateUser } from "@/endpoints/updateUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import {
  authHeaders,
  CLIENT_ANNA,
  createTestUsers,
  findUser,
} from "@/testing/users";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("account cannot be updated to an existing email address", async () => {
  const registerAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Realtor",
      role: "realtor",
    },
  );
  expect(registerAccountResponse).toMatchObject({
    status: "success",
    message: "User successfully registered.",
  });
  const user = await findUser("hello@gmail.com");
  const updateAccountResponse = await updateUser(
    await authHeaders("hello@gmail.com", GOOD_PASSWORD_1),
    user.userId,
    {
      // Update to an email address that's already in use.
      email: CLIENT_ANNA,
      currentPassword: GOOD_PASSWORD_1,
    },
  );
  expect(updateAccountResponse).toMatchObject({
    status: "error",
    message: "Email already registered.",
  });
});
