const fetch = require("isomorphic-fetch");

// base url
const baseUrl = "http://localhost:3000";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(baseUrl + path, { method, body, headers });
  if (res.status < 200 || res.status > 299) {
    throw new Error(
      `[UNSUCCESSFUL_REQUEST] : Server returned with status ${res.status}.`
    );
  }

  return res.json();
};

describe("/account endpoint tests", () => {
  test("GET /account/user/:email", async () => {
    const email = "ahad@yahoo.com";
    const user = await _fetch("get", `/account/user/${email}`);
    expect(user.email).toBe(email);
  });

  test("POST /account/signup", async () => {
    const email = "maaahad@gmail.com";
    const body = {
      email,
      name: "Muhammed Abdullah Al Ahad",
      password: "password",
    };
    await _fetch("post", "/account/signup", body);

    // now we try to get a user with same email
    const user = await _fetch("get", `/account/user/${email}`);
    // assertions
    expect(user.email).toBe(email);
  });
});
