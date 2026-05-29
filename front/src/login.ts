const API_URL = "https://localhost/api"
const LOGIN_URL = "https://localhost/accounts/oidc/dotnetid/login/"
const LOGOUT_URL = "https://localhost/accounts/logout/"

export async function initAuthUI(
  button: HTMLButtonElement,
  status: HTMLParagraphElement
) {
  await initCsrf();
  checkAuth(button, status);
}

async function initCsrf() {
  await fetch(`${API_URL}/csrf/`, {
    credentials: "include",
  })
}

function checkAuth(button: HTMLButtonElement, status: HTMLParagraphElement) {
  fetch(`${API_URL}/user/`, { credentials: "include" })
    .then(res => {
      if (res.status === 401) {
        renderLoggedOut(button, status)
        return null
      }
      if (!res.ok) {
        throw new Error("API error")
      }
      return res.json()
    })
    .then(user => {
      if (user) {
        renderLoggedIn(button, status, user.username)
      }
    })
    .catch(console.error)
}

function renderLoggedOut(
  button: HTMLButtonElement,
  status: HTMLParagraphElement
) {
  status.textContent = "Hello guest!"
  button.textContent = "Log in"

  button.onclick = () => {
    submitPost(LOGIN_URL)
  }
}

function renderLoggedIn(
  button: HTMLButtonElement,
  status: HTMLParagraphElement,
  username: string
) {
  status.textContent = `Hello ${username}!`
  button.textContent = "Log out"

  button.onclick = () => {
    submitPost(LOGOUT_URL)
  }
}

function submitPost(url: string) {
  const form = document.createElement("form")
  form.method = "POST"
  form.action = url

  const csrf = getCookie("csrftoken")
  if (csrf) {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = "csrfmiddlewaretoken"
    input.value = csrf
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift()!
  }
  return null
}
