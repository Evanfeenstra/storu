import React, {useState, useContext, useEffect} from 'react'

const storu = React.createContext({})

const localStorageKey = '_storu'

function useStoru(){
  var ctx = useContext(storu)
  return ctx||{}
}

function createActions(actions, theStoru){
  if(typeof actions!=='object') return {}
  var r = {}
  for (const key in actions) {
    let value = actions[key]
    if(typeof value!=='function') continue
    if (actions.hasOwnProperty(key)) {
      r[key] = function() {
        const args = arguments||[]
        return value(...args,theStoru)
      } 
    }
  }
  return r
}

function StoruProvider(props){

  const [store,setStore] = useState({})
  const [state,setState] = useState({})

  function setTheState(a){
    if(typeof a!=='object') return
    setState(current=>{
      return {...current,...a}
    })
  }
  function setTheStore(a){
    if(typeof a!=='object') return
    setStore(current=>{
      let newStore = {...current,...a}
      localStorage.setItem(localStorageKey, JSON.stringify(newStore))
      return newStore
    })
  }
  async function hyrdateStore(){
    const theStore = await getStore()
    if(theStore) setStore(theStore)
  }

  useEffect(()=>{
    hyrdateStore()
  }, [])

  const theStoru = {
    ...store,
    ...state,
    setState:setTheState,
    setStore:setTheStore,
  }
  return <storu.Provider value={{
    ...theStoru,
    actions: createActions(props.actions, theStoru)
  }}>
    {props.children}
  </storu.Provider>
}

export {useStoru, StoruProvider}

export async function getStore(){
  const theStore = await localStorage.getItem(localStorageKey)
  if (theStore) {
    try {
      const parsedStore = JSON.parse(theUI)
      if(parsedStore) return parsedStore
    } catch(e){}
  }
  return {}
}