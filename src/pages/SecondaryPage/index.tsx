import { Link } from 'hyperstatic'

import utils from '/src/styles/utils.module.css'

const SecondaryPage = () => (
  <div class={utils.container}>
    <h1>Hello from secondary page</h1>
    <Link href="/">Go back to home page</Link>
  </div>
)

export default SecondaryPage
