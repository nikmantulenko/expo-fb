import { useEffect, useRef, useState } from 'react'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import StartScreen from './screens/StartScreen'
import LogInScreen from './screens/LogInScreen'
import EndScreen from './screens/EndScreen'
import { NotificationProvider } from './components/Notification'
import { RootStackParamList } from './routes'
import useUser from './lib/useUser'

const Stack = createNativeStackNavigator<RootStackParamList>()

async function requestUserPermission() {
  const status = await messaging().hasPermission()
  const enabled = (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  )
  if (!enabled) await messaging().requestPermission()
}

export default function App() {
  const { user, isReady: isUserReady } = useUser()
  const [isReady, setIsReady] = useState(false)
  const externalRouteName = useRef<keyof RootStackParamList | null>(null)
  const navigationRef = useNavigationContainerRef<RootStackParamList>()

  useEffect(() => {
    // [data.type] property suppose to be a route name. Validate value before extraction
    const extractType = (rm: FirebaseMessagingTypes.RemoteMessage | null): keyof RootStackParamList | null =>
      (rm && rm.data && rm.data.type && ['home', 'logIn', 'end'].includes(rm.data.type))
        ? rm.data.type as keyof RootStackParamList
        : null

    messaging().getInitialNotification()
      .then(remoteMessage => {
        externalRouteName.current = extractType(remoteMessage)
        setIsReady(true)
      })

    messaging().onNotificationOpenedApp(remoteMessage => {
      const type = extractType(remoteMessage)
      if (type) navigationRef.current?.navigate(type)
    })

    requestUserPermission()
  }, [])

  if (!isReady || !isUserReady) return null

  return (
    <NotificationProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={externalRouteName.current || (user ? 'end' : 'home')}>
          <Stack.Screen name={'home'} component={StartScreen} />
          <Stack.Screen name={'logIn'} component={LogInScreen} />
          <Stack.Screen name={'end'} component={EndScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotificationProvider>
  )
}
