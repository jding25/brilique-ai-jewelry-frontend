let mode = "login";

const modal = document.getElementById("auth-modal");
const closeModal = document.getElementById("close-auth-modal");
const toggleBtn = document.getElementById("toggle-mode");
const formTitle = document.getElementById("modal-title");
const submitBtn = document.querySelector("#auth-form button");

// Open modal from sidebar login button
document.getElementById("loginBtn")?.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("show");
});

// Close modal
closeModal?.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.classList.add("hidden");
});

// Toggle between login/signup
toggleBtn?.addEventListener("click", () => {
  mode = mode === "login" ? "signup" : "login";
  formTitle.textContent = mode === "login" ? "Log In" : "Sign Up";
  submitBtn.textContent = mode === "login" ? "Log In" : "Sign Up";
  toggleBtn.textContent = mode === "login"
    ? "Don't have an account? Sign up"
    : "Already have an account? Log in";
});

// Submit auth form
document.getElementById("auth-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const endpoint = `http://localhost:8080/api/auth/${mode}`;
  const payload = { "email": email, "password": password };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());

    const result = await res.text();
    localStorage.setItem("user", JSON.stringify({ email: result.email, token: result.token }));

    modal.classList.remove("show");
    modal.classList.add("hidden");
    location.reload(); // Update UI immediately
  } catch (err) {
    alert("Authentication failed: " + err.message);
  }
});
