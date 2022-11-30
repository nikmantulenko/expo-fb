import { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import auth from '@react-native-firebase/auth'
import useUser from '../lib/useUser'
import { RootStackParamList } from '../routes'

function LogInScreen(props: NativeStackScreenProps<RootStackParamList>) {
  const { user } = useUser()

  const [email, setEmail] = useState('test@gmail.com')
  const [password, setPassword] = useState('testpassword')

  const valuesRef = useRef<{ email: string, password: string }>({ email, password })
  Object.assign(valuesRef.current, { email, password })

  const signUp = useCallback(() => {
    auth().createUserWithEmailAndPassword(valuesRef.current.email, valuesRef.current.password)
      .then(() => { console.log('User signed in with email') })
      .catch(error => { Alert.alert(error.code, error.message) })
  }, [])

  const logOut = useCallback(() => {
    auth().signOut()
  }, [])

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text>You are logged in with {user.email}!</Text>
          <Text>Wait for notification.</Text>
          <TouchableOpacity onPress={logOut}>
            <Text style={styles.buttonText}>LOG OUT</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            textContentType={'emailAddress'}
            keyboardType={'email-address'}
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            textContentType={'newPassword'}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={signUp}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    minWidth: 200,
    maxWidth: 300,
    width: '70%',
    fontSize: 24,
    color: '#555',
    paddingHorizontal: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'steelblue',
    borderRadius: 5,
  },
  buttonText: {
    color: '#0000EE',
    fontSize: 28,
    margin: 10,
  },
})

export default LogInScreen