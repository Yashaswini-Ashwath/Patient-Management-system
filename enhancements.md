# Possible Enhancements

A list of improvements that can be made to the Patient Management System, ranging from security hardening to architectural upgrades.

---

## 1. Replace localStorage JWT with HTTP-Only Cookies

**Current:** The JWT token is stored in `localStorage` and manually attached to every request via an `Authorization: Bearer` header.

**Problem:** Tokens in `localStorage` are accessible to JavaScript, making them vulnerable to XSS attacks. If any injected script runs on the page, it can steal the token.

**Improvement:**
- Have the backend set the JWT in an **HTTP-only, Secure, SameSite=Strict cookie** on login.

---

## 2. Global Auth State with React Context

**Current:** Authentication state (the JWT token) is read directly from `localStorage` in each component and API call independently.

**Problem:** There is no single source of truth for auth state. If the token expires or is cleared, individual components may behave inconsistently. Adding a logout or session-expiry feature requires touching every component.

**Improvement:**
- Create an `AuthContext` using `React.createContext` that holds the current user/session state.
- Wrap the app in an `AuthProvider` that manages login, logout, and token refresh logic in one place.
- Components consume the context via `useContext(AuthContext)` instead of reading `localStorage` directly.

---

## 3. Protected Route Guard with Navigation Check

**Current:** There is no route-level protection on the frontend. A user who navigates directly to `/patients` without a token will hit the page and only fail when the API call returns a 401.

**Problem:** The UI does not proactively guard routes, leading to a flash of the protected page before redirection and a poor user experience.

**Improvement:**
- Create a `ProtectedRoute` wrapper component that checks for a valid auth state before rendering the child route.
- If unauthenticated, redirect immediately to `/login` using `useNavigate` or React Router's `<Navigate>` component.

```

---

## 4. Input Validation in the UI

**Current:** Forms in `PatientCreate` and `PatientEdit` submit data without client-side validation. Errors are only surfaced after the API call fails.

**Problem:** Invalid data (empty required fields, malformed values) reaches the server before the user gets any feedback, leading to a poor experience.

**Improvement:**
- Validate all form fields on the frontend before allowing submission:

---

## 5. Logout and Session Management

**Current:** There is no logout functionality. The only way to end a session is to manually clear `localStorage`. 

**Problem:** If a doctor closes the tab or walks away, the session persists indefinitely. There is no mechanism to force-expire a token if a device is lost or a password is changed. The app also does not redirect unauthenticated users away from protected pages proactively.

**Improvement:**
- Add a **Logout button** in the UI that clears the token (from `localStorage` or an HTTP-only cookie) and uses `useNavigate` to redirect the doctor immediately to `/login`.
- Use `useNavigate` from React Router instead of `window.location` so navigation stays within the SPA without a full page reload.


---

## 6. Refresh Token Support

**Current:** The JWT is issued once on login with a fixed expiry. When it expires, the user is silently logged out with a 401 and no feedback.

**Improvement:**
- Issue two tokens on login: a short-lived **access token** (e.g., 60 minutes) and a long-lived **refresh token** (e.g., 7 days) stored in an HTTP-only cookie.
- Add a `/auth/refresh` endpoint that validates the refresh token and issues a new access token.
- Use an Axios response interceptor on the frontend to automatically call `/auth/refresh` on 401 responses and retry the original request — transparent to the user.

---


## 7. Pagination and Search for Patient List

**Current:** `PatientList` fetches and renders all patient records in a single query with no limit.

**Problem:** As the number of patients grows, this will become slow on both the database query and the frontend render.

**Improvement:**
- Add `LIMIT` / `OFFSET` or cursor-based pagination to the `GET /patients` endpoint.
- Add a `search` query parameter to filter patients by name or ID on the server side.
- Update the frontend to render a paginated list with next/previous controls and a search input.

---

## 8. Rate Limiting on Auth Endpoints

**Current:** The `/auth/login` endpoint has no rate limiting, allowing unlimited login attempts.

**Problem:** The endpoint is vulnerable to brute-force attacks against doctor passwords.

**Improvement:**
- Add rate limiting middleware (e.g., `express-rate-limit`) to `/auth/login`, allowing a limited number of attempts per IP within a time window.
- Return a `429 Too Many Requests` response when the limit is exceeded.
