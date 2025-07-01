import './style.css'

import { doLogin } from './login.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>DotnetID Login Example</h1>
    <div class="card">
      <button id="login" type="button"></button>
    </div>
  </div>
`

doLogin(document.querySelector<HTMLButtonElement>('#login')!)
