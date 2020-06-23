// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAdQi1iRhr0HGrOVGJfoLSjlIQ35eHxcdM",
    authDomain: "web-frontend-1933.firebaseapp.com",
    databaseURL: "https://web-frontend-1933.firebaseio.com",
    projectId: "web-frontend-1933",
    storageBucket: "web-frontend-1933.appspot.com",
    messagingSenderId: "895663442193",
    appId: "1:895663442193:web:753ea54009b92d7298e4b0",
    measurementId: "G-34Y9BV64GJ"
  },
  get_all_book: "http://localhost:9000/api/book",
  create_book: 'http://localhost:9000/api/create-book',
  delete_book: "http://localhost:9000/api/delete-book/",
  update_book: "http://localhost:9000/api/update-book"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
