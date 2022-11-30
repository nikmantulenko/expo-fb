import { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import auth from '@react-native-firebase/auth'
import useUser from '../lib/useUser'
import useMessages from '../lib/useMessages'
import Notification from '../components/Notification'
import { RootStackParamList } from '../routes'

function LogInScreen(props: NativeStackScreenProps<RootStackParamList>) {
  const { user } = useUser()
  const messages = useMessages()

  const [email, setEmail] = useState('test@gmail.com')
  const [password, setPassword] = useState('testpassword')

  const valuesRef = useRef<{ email: string, password: string }>({ email, password })
  Object.assign(valuesRef.current, { email, password })

  const signUp = useCallback(() => {
    auth().createUserWithEmailAndPassword(valuesRef.current.email, valuesRef.current.password)
      .then(() => { console.log('User signed in with email') })
      .catch(error => { Alert.alert(error.code, error.message) })
  }, [])

  const handleNotificationPress = useCallback(() => {
    props.navigation.replace('end')
  }, [])

  const logOut = useCallback(() => {
    auth().signOut()
  }, [])

  return (
    <View style={styles.container}>
      {props.navigation.isFocused() && messages.map(message => (
        <Notification
          key={message.messageId}
          title={message.notification?.title}
          text={message.notification?.body}
          onPress={handleNotificationPress}
        />
      ))}

      {user ? (
        <>
          <View style={styles.textBox}>
            <Text style={styles.text}>
              You are logged in with {user.email}!{'\n'}
              Wait for notification. Usually it takes few seconds.{'\n'}
              Keep the app open to see in-app notification{'\n'}
              (it's touchable){'\n'}
              Or minimize the app to receive native notification
            </Text>
          </View>
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
  textBox: {
    padding: 20,
  },
  text: {
    textAlign: 'center',
  }
})

export default LogInScreen