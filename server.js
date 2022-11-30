const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

;(async function main() {
  // initialize app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://expo-fb-e466e-default-rtdb.firebaseio.com'
  })

  // we don't store device token so fallback to topics
  const sendWelcome = async () => {
    const data = {
      type: 'end', // route name
    }
    const notification = {
      title: 'welcome',
      body: 'Welcome to our App!',
    }
    await admin.messaging().sendToTopic('welcome', { data, notification })
    console.log('sending welcome message')
  }

  const getUserAmount = async () => {
    const listUserResults = await admin.auth().listUsers(1000)
    return listUserResults.users.length
  }

  // since we don't have up&running firebase functions, and we can't subscribe to onUserCreate
  // we need to find a workaround for this - endless look does a trick
  let usersAmount = await getUserAmount()
  while (await new Promise(r => setTimeout(r, 10000, true))) {
    const nextUserAmount = await getUserAmount()
    if (nextUserAmount > usersAmount /* we expect only additions */) {
      usersAmount = nextUserAmount
      console.log('addition of a user detected')
      // wait for few seconds
      await new Promise(r => setTimeout(r, 2000))
      await sendWelcome()
    }
  }
})();
