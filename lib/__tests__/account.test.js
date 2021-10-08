const fetch = require("isomorphic-fetch");

// base url
const baseUrl = "http://localhost:3000";

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

describe("/account endpoint tests", () => {
  test("GET /account/user/:email", async () => {
    const email = "ahad@yahoo.com";
    const user = await _fetch("get", `/account/user/${email}`);
    expect(user.email).toBe(email);
  });

  // test("POST /account/signup", async () => {
  //   const email = "maaahad@gmail.com";
  //   const body = {
  //     email,
  //     name: "Muhammed Abdullah Al Ahad",
  //     password: "password",
  //   };
  //   await _fetch("post", "/account/user/signup", body);

  //   // now we try to get a user with same email
  //   const user = await _fetch("get", `/account/user/${email}`);
  //   // assertions
  //   expect(user.email).toBe(email);
  // });

  test("PUT /account/user/login", async () => {
    const email1 = "ahad@yahoo.com";
    const password1 = "test";
    const body1 = { email: email1, password: password1 };
    const [user1, workspaces1] = await _fetch(
      "put",
      "/account/user/login",
      body1
    );
    expect(workspaces1.length).not.toBe(0);

    const email2 = "maaahad@gmail.com";
    const password2 = "password";
    const body2 = { email: email2, password: password2 };
    const [user2, workspaces2] = await _fetch(
      "put",
      "/account/user/login",
      body2
    );
    expect(workspaces2.length).toBe(0);
  });

  test("PUT /account/user/logout", async () => {
    const email = "maaahad@gmail.com";
    const password = "password";
    const body = { email, password };
    let [user, ,] = await _fetch("put", "/account/user/login", body);
    user = await _fetch("get", `/account/user/${user.email}`);
    expect(user.signedin).toBe(true);
    // now we log out the user
    await _fetch("put", "/account/user/logout", { id: user._id });
    user = await _fetch("get", `/account/user/${user.email}`);
    expect(user.signedin).toBe(false);
  });
});
