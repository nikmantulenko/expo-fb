import { useEffect, useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

function useUser(): { user: FirebaseAuthTypes.User | null, isReady: boolean } {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  // for better performance
  // in case of multiple uses of useUser move it outside
  useEffect(() => auth().onAuthStateChanged(updatedUser => {
    setUser(updatedUser)
    setIsReady(true)
  }), [])

  return { user, isReady }
}

export default useUser
