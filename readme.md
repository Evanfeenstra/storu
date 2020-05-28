# storu

### usage
```jsx
import {StoruProvider} from 'storu'
import * as actions from './actions'

function App(){
    return <StoruProvider actions={actions}>
        <Auth />
    </StoruProvider>
}

function Auth(){
    const storu = useStoru()
    const {user,actions,setState} = storu

    const isSignedIn = user&&user.name
    return <div>
        <span>{user.name}</span>
        {!isSignedIn ?
            <button onClick={actions.login('fognet','*****')}> 
                sign in!
            </button> :
            <button onClick={()=>setState({user:null})}>
                click to logout
            </button>
        }
    </div>
}
```

### create your actions
`storu` is injected as the last argument in each "action", with two methods:
- `storu.setState`: set state into the context
- `storu.setStore`: set state that is also persisted to localStorage
```js
export function login(username, password, storu) {
    const user = await axios.post('/loginroute', {username,password})
    storu.setState({user})
}
