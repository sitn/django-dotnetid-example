import './style.css'
import { initAuthUI } from './login.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>DotnetID Login Example</h1>

    <p id="status"></p>

    <div class="card">
      <button id="auth-btn" type="button"></button>
    </div>
  </div>
`

initAuthUI(
  document.querySelector<HTMLButtonElement>('#auth-btn')!,
  document.querySelector<HTMLParagraphElement>('#status')!
)
