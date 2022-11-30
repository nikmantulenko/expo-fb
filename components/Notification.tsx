import {ReactNode, useEffect, useRef, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

type NotificationData = {
  title?: string
  text?: string
  onPress?: () => void
}

const notificationManager = new class {
  private idCount = 0
  private dataMap = new Map<number, NotificationData>()
  private subscription: (dataList: NotificationData & {id: number}[]) => void = () => {}

  add(data: NotificationData): number {
    this.idCount++
    this.dataMap.set(this.idCount, data)
    this.notify()
    return this.idCount
  }

  update(id: number, data: NotificationData) {
    if (this.dataMap.has(id)) this.dataMap.set(id, data)
  }

  remove(id: number) {
    this.dataMap.delete(id)
    this.notify()
  }

  subscribe(subscription: (dataList: NotificationData & {id: number}[]) => void) {
    this.subscription = subscription
    return () => { this.subscription = () => {} }
  }

  private notify() {
    this.subscription(this.getList())
  }

  private getList() {
    return [...this.dataMap.entries()].map(([id, data]) => ({ id, ...data }))
  }
}

export function NotificationProvider(props: { children: ReactNode }) {
  const [list, setList] = useState<Array<NotificationData & {id: number}>>([])
  useEffect(notificationManager.subscribe(setList), [])

  return (
    <View style={styles.wrapper}>
      {props.children}
      {list.length > 0 && (
        <View style={styles.container}>
          {list.map(item => (
            <TouchableOpacity key={item.id} onPress={item.onPress} disabled={item.onPress == null}>
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

function Notification(props: NotificationData) {
  const idRef = useRef<number>(NaN)

  useEffect(() => {
    idRef.current = notificationManager.add(props)
    return () => { notificationManager.remove(idRef.current) }
  }, [])

  useEffect(() => {
    notificationManager.update(idRef.current, props)
  }, [props])

  return null
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: 50,
    marginHorizontal: 30,
  },
  item: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
  },
  text: {

  },
})

export default Notification