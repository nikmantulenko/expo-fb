import { useEffect, useState, Dispatch } from 'react'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage

class MessageManager {
  private setters: Dispatch<RemoteMessage[]>[] = []
  private messages: RemoteMessage[] = []
  readonly topic: string

  constructor(topic: string) {
    this.topic = topic
    messaging().subscribeToTopic(this.topic)
    messaging().onMessage(message => {
      this.messages.push(message)
      this.setters.forEach(setter => setter([...this.messages]))
    })
  }

  subscribe(setter: Dispatch<RemoteMessage[]>) {
    this.setters.push(setter)
    return () => { this.setters = this.setters.filter(s => s !== setter)}
  }

  getInitial = () => {
    return [...this.messages]
  }
}

const messageManager = new MessageManager('welcome')

function useMessages() {
  const [messages, setMessage] = useState<RemoteMessage[]>(messageManager.getInitial)
  useEffect(messageManager.subscribe(setMessage), [])
  return messages
}

export default useMessages
