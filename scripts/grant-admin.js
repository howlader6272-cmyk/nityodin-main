const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TARGET_EMAIL;

if (!url || !key || !email) {
  console.error("Missing env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TARGET_EMAIL");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: "Bearer " + key,
  "Content-Type": "application/json",
};

(async () => {
  let userId;
  const pwd = "Auto" + Math.random().toString(36).slice(2, 10) + "!";
  let res = await fetch(url + "/auth/v1/admin/users", {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password: pwd, email_confirm: true }),
  });
  if (res.ok) {
    const data = await res.json();
    userId = data.id;
    console.log("created user", userId);
  } else {
    console.log("create failed status", res.status);
    res = await fetch(url + "/auth/v1/admin/users?email=" + encodeURIComponent(email), { headers });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      userId = data[0].id;
    } else if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      userId = data.users[0].id;
    } else {
      throw new Error("User not found");
    }
  }
  const body = { user_id: userId, role: "admin" };
  res = await fetch(url + "/rest/v1/user_roles", {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(body),
  });
  console.log("role upsert status", res.status);
  const text = await res.text();
  console.log(text);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
