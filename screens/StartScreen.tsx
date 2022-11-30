import { useCallback } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../routes'

function StartScreen(props: NativeStackScreenProps<RootStackParamList>) {
  const handlePress = useCallback(() => {
    props.navigation.replace('logIn')
  }, [])

  return (
    <View style={styles.container}>
      <Button
        title={'start'}
        onPress={handlePress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default StartScreen