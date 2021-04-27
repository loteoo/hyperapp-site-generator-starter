import utils from '/src/styles/utils.module.css'
import styles from './footer.module.css'

const Footer = () => (
  <footer class={styles.footer}>
    <div class={utils.container}>
      <div class={styles.links}>
        <a
          href="https://github.com/loteoo/hyperstatic-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          [source code]
        </a>
        <a
          href="https://github.com/jorgebucaran/hyperapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          hyperapp
        </a>
      </div>
    </div>
  </footer>
)

export default Footer
