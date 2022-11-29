module.exports = {
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.barcompany.fooname"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.barcompany.fooname"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ]
  }
}
