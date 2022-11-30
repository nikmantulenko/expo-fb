import { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useUser from '../lib/useUser'
import useMessages from '../lib/useMessages'
import { RootStackParamList } from '../routes'

function EndScreen(props: NativeStackScreenProps<RootStackParamList>) {
  const { user } = useUser()
  const messages = useMessages()

  const logOut = useCallback(() => {
    auth().signOut()
    props.navigation.replace('logIn')
  }, [])

  return (
    <View style={styles.container}>
      {messages.length === 0 && (
        <Text>No messages yet.</Text>
      )}

      {messages.map(message => (
        <View key={message.sentTime} style={styles.message}>
          <Text style={styles.bigText}>{message.notification?.title}</Text>
          <Text style={styles.text}>{message.notification?.body}</Text>
        </View>
      ))}

      {user && (
        <>
          <Text>your email: {user.email}</Text>
          <TouchableOpacity onPress={logOut}>
            <Text style={styles.buttonText}>LOG OUT</Text>
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
  buttonText: {
    color: '#0000EE',
    fontSize: 28,
    margin: 10,
  },
  message: {
    margin: 10,
    marginBottom: 50,
  },
  bigText: {
    fontSize: 36,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
})

export default EndScreen
