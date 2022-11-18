// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  fcmServerKey:
    // eslint-disable-next-line max-len
    'AAAAGmnS99s:APA91bGCenGWvKxEiS39t5QnPn0X8hlnFJNAjc2HB-h3xFUYHX_oUCP79kuUl-KP44SbQCmRJ_toaCxUjB17-QEhsQoWX3Y2W6NlZWh3pFesU0pRVd4uJRU4XE54ktRrCFCCtzyIb6Ey',
  firebaseConfig: {
      /*  apiKey: "AIzaSyD9yXDDKCy18B3Utj4NNnzkfX2yPk_MYj4",
        authDomain: "closer-app-255c5.firebaseapp.com",
        projectId: "closer-app-255c5",
        storageBucket: "closer-app-255c5.appspot.com",
        messagingSenderId: "172843069119",
        appId: "1:172843069119:web:a175223e3b8b2999c4200a"*/
    apiKey: "AIzaSyAeODQL45NzZLmhxfwQir4CD1h2B0jcn4Y",
    authDomain: "closer-pps.firebaseapp.com",
    projectId: "closer-pps",
    storageBucket: "closer-pps.appspot.com",
    messagingSenderId: "113444583387",
    appId: "1:113444583387:web:8dcf74f05f2d381dc759fe"

  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
