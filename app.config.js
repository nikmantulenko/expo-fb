module.exports = {
  "expo": {
    "android": {
      // googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
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
    ],
    "extra": {
      "eas": {
        "projectId": "7d248d01-41a2-43ef-aad4-022d4772ccdb"
      }
    }
  }
}
