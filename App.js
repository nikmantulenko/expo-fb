import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => auth().onAuthStateChanged(updatedUser => {
    setInitializing(false);
    setUser(updatedUser);
  }), []);

  useEffect(() => {
    messaging().getToken()
      .then(token => { console.log(token) })
      .catch(error => { console.error(error) });
    void requestUserPermission();
    messaging().onMessage(message => {
      console.log('message is received', message)
    });
  }, [])

  useEffect(() => {
    void messaging().subscribeToTopic('test');
    return () => { void messaging().unsubscribeFromTopic('test') }
  }, [])

  const logout = useCallback(() => {
    void auth().signOut();
  }, [])

  const signInAnonymously = useCallback(() => {
    auth().signInAnonymously()
      .then(() => { console.log('User signed in anonymously') })
      .catch(error => { console.error(error) });
  }, [])

  const signInWithEmail = useCallback(() => {
    auth().signInWithEmailAndPassword('test@gmail.com', 'testpassword')
      .then(() => { console.log('User signed in with email') })
      .catch(error => { console.error(error) });
  }, [])

  return (
    <View style={styles.container}>
      {initializing ? (
        <Text>Wait...</Text>
      ) : user ? (
        <View>
          <Text>Welcome {user.isAnonymous ? 'Anonymous' : user.email}</Text>
          <Text onPress={logout}>Logout</Text>
        </View>
      ) : (
        <View>
          <Text onPress={signInAnonymously}>Login Anonymously</Text>
          <Text onPress={signInWithEmail}>Login With Email</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
