const fetch = require("isomorphic-fetch");

// base url
const baseUrl = "http://localhost:3033";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(baseUrl + path, { method, body, headers });
  const resBody = await res.json();
  if (res.status < 200 || res.status > 299) {
    throw new Error(
      `[UNSUCCESSFUL_REQUEST] : Server returned with status ${res.status}.\n${resBody?.message}`
    );
  }

  return resBody;
};

describe("/auth endpoint tests", () => {
  test("POST /auth/signup/inhouse", async () => {
    const email = "passport@gmail.com";
    const body = {
      email,
      name: "Passport Passport",
      subscribed: true,
      password: "passport",
    };
    const { user, workspaces } = await _fetch(
      "post",
      "/auth/signup/inhouse",
      body
    );
    // console.log(user, "\n", workspaces);
    expect(user.email).toBe(email);
  });

  test("POST /auth/login/inhouse", async () => {
    const email = "passport@gmail.com";
    const password = "passport";
    const body = { email, password };
    const { user, workspaces } = await _fetch(
      "post",
      "/auth/login/inhouse",
      body
    );
    // console.log(user, "\n", workspace);
    expect(user.loggedin).toBe(true);
  });

  test("PUT /account/user/logout/:userid", async () => {
    const email = "passport@gmail.com";
    let user = await _fetch("get", `/account/user/${email}`);
    user = await _fetch("put", `/account/user/logout/${user._id}`);
    expect(user.loggedin).toBe(false);
  });
});
