export function doLogin(element: HTMLButtonElement) {
  element.innerHTML = `Log in`
  const login = () => fetch("https://localhost/api/user/", {
    credentials: "include",
  }).then(res => {
    if (res.status === 401) {
      window.location.replace("https://localhost/accounts/login")
    }
    if (!res.ok) {
      console.error(res);
    }
    res.json().then(jsonData => {
      element.innerHTML = `Hello ${jsonData['username']}!`
    })
  });
  element.addEventListener('click', () => login())
  login();
}
