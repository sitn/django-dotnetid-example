type Lane = "front" | "django" | "idp"

type Step =
  | { kind: "phase"; title: string }
  | { kind: "msg"; from: Lane; to: Lane; label: string; detail?: string; response?: boolean; backChannel?: boolean }
  | { kind: "note"; lane: Lane; text: string }

const LANES: Lane[] = ["front", "django", "idp"]

const LANE_NAMES: Record<Lane, string> = {
  front: "Browser",
  django: "Django (BFF)",
  idp: "DotnetID",
}

const STEPS: Step[] = [
  { kind: "phase", title: "1. You clicked “Log in”" },
  { kind: "msg", from: "front", to: "django", label: "POST /accounts/oidc/dotnetid/login/", detail: "form with the CSRF token" },
  { kind: "note", lane: "django", text: "Generates state, nonce and a PKCE code_verifier, keeps them in the session" },
  { kind: "msg", from: "django", to: "front", response: true, label: "302 → DotnetID /authorize", detail: "client_id, redirect_uri, scope, state, nonce, code_challenge" },

  { kind: "phase", title: "2. At the identity provider" },
  { kind: "msg", from: "front", to: "idp", label: "GET /authorize", detail: "the browser follows the redirect" },
  { kind: "note", lane: "idp", text: "You log in. Django never sees your password." },
  { kind: "msg", from: "idp", to: "front", response: true, label: "302 → /accounts/oidc/dotnetid/login/callback/", detail: "?code=…&state=… (single-use code)" },

  { kind: "phase", title: "3. Code exchange, server to server" },
  { kind: "msg", from: "front", to: "django", label: "GET …/callback/?code&state", detail: "Django checks that state matches the session" },
  { kind: "msg", from: "django", to: "idp", backChannel: true, label: "POST /token", detail: "code + client_secret + code_verifier" },
  { kind: "msg", from: "idp", to: "django", backChannel: true, response: true, label: "200 id_token, access_token", detail: "tokens stay on the server" },
  { kind: "note", lane: "django", text: "Validates the id_token (signature, iss, aud, nonce), creates or updates the user, opens a session" },

  { kind: "phase", title: "4. You are back on the app" },
  { kind: "msg", from: "django", to: "front", response: true, label: "302 → /", detail: "Set-Cookie: sessionid (HttpOnly, Secure, SameSite=Lax)" },
  { kind: "msg", from: "front", to: "django", label: "GET /api/user/", detail: "the cookie is sent automatically" },
  { kind: "msg", from: "django", to: "front", response: true, label: "200 { username }" },
]

export function renderWhatHappened(username: string): HTMLElement {
  const section = document.createElement("section")
  section.className = "what-happened"
  section.innerHTML = `
    <h2>What just happened?</h2>
    <p class="wh-intro">How <strong class="wh-user"></strong> got logged in, step by step.</p>

    <div class="wh-legend">
      <span><i class="wh-key"></i>request</span>
      <span><i class="wh-key wh-key-response"></i>response</span>
      <span><i class="wh-key wh-key-back"></i>server ↔ server (the browser never sees it)</span>
    </div>

    <div class="wh-diagram" role="list">
      ${LANES.map((lane, i) => `<div class="wh-lane wh-lane-${lane}" style="grid-column:${i + 1}">${LANE_NAMES[lane]}</div>`).join("")}
      ${STEPS.map((step, i) => renderStep(step, i + 2)).join("")}
    </div>

    <h3>Why this matters</h3>
    <ul class="wh-takeaways">
      <li><strong>No token in the browser.</strong> The id_token and access_token live in Django. An XSS attack has nothing to steal.</li>
      <li><strong>The session cookie is HttpOnly.</strong> JavaScript cannot read it. Here is everything this page can see in <code>document.cookie</code>: <code class="wh-cookies"></code></li>
      <li><strong>An intercepted code is useless.</strong> Exchanging it requires the client secret and the PKCE verifier, both held by Django.</li>
      <li><strong>Single origin.</strong> Apache serves the front end and proxies <code>/api</code> and <code>/accounts</code> to Django, so the cookie is first-party.</li>
    </ul>
  `

  section.querySelector(".wh-user")!.textContent = username
  section.querySelector(".wh-cookies")!.textContent = maskCookies(document.cookie) || "(nothing)"

  return section
}

// row 1 holds the lane headers
function renderStep(step: Step, row: number): string {
  if (step.kind === "phase") {
    return `<div class="wh-phase" style="grid-row:${row}" role="listitem">${step.title}</div>`
  }

  if (step.kind === "note") {
    return `<div class="wh-note wh-note-${step.lane}" style="grid-row:${row}" role="listitem">${step.text}</div>`
  }

  const a = LANES.indexOf(step.from)
  const b = LANES.indexOf(step.to)
  const start = Math.min(a, b) + 1
  const span = Math.abs(a - b) + 1
  const classes = [
    "wh-msg",
    b > a ? "wh-right" : "wh-left",
    step.response ? "wh-response" : "",
    step.backChannel ? "wh-back" : "",
  ].join(" ")

  return `
    <div class="${classes}" style="grid-row:${row};grid-column:${start} / span ${span};--span:${span}" role="listitem">
      <code class="wh-label">${step.label}</code>
      <div class="wh-arrow"></div>
      ${step.detail ? `<span class="wh-detail">${step.detail}</span>` : ""}
    </div>
  `
}

// Only show cookie names and a short prefix of each value
function maskCookies(cookies: string): string {
  return cookies
    .split(";")
    .map(c => c.trim())
    .filter(Boolean)
    .map(c => {
      const [name, value = ""] = c.split("=")
      return `${name}=${value.slice(0, 6)}…`
    })
    .join("; ")
}
