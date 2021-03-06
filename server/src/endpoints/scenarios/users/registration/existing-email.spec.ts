import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

useTestingDatabase();

test("email cannot be reused", async () => {
  const registerFirstAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Realtor",
      role: "realtor",
    },
  );
  expect(registerFirstAccountResponse).toMatchObject({
    kind: "success",
    data: "Great! Please check your email inbox now.",
  });
  const registerSecondAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Client",
      role: "client",
    },
  );
  expect(registerSecondAccountResponse).toMatchObject({
    kind: "failure",
    data: "This email address is already registered.",
  });
});
