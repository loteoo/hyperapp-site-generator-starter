import utils from '/styles/utils.css'
import Link from '/utils/routing/Link'
import loadStatic from '/utils/routing/loadStatic'

import styles from './character-list.css'

const HandleCharacters = (state, data) => ({
  ...state,
  characterlist: state.characterlist.concat(data.results)
})

// Fetch characters
export const init = (state: State, location: LocationState) => [
  {
    ...state,
    characterlist: []
  },
  loadStatic({
    key: location.path,
    loader: async () => {
      const response = await fetch(`/characters.json`)
      const data = await response.json()
      return data
    },
    action: HandleCharacters,
    error: (state) => state
  })
]

// View
const CharacterList = (state) => (
  <div class={utils.container}>
    <h2>Data fetching example</h2>
    <h4>Rick and Morty characters</h4>
    <div class={utils.grid}>
      {state.characterlist.map((character) => (
        <Link class={styles.card} href={`/characters/${character.id}`}>
          <h4 class={styles.cardTitle}>{character.name}</h4>
          <small>{/* {character.species} - {character.status} */}</small>
        </Link>
      ))}
    </div>
  </div>
)

export default CharacterList
