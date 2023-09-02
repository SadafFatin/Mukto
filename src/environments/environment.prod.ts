// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


export const NOTIFICATION_SOCKET_PORT = 'https://inventoryapi.qzonetech.com:3100';
export const ns = '/company';
export const localDomain = 'https://crm.qzonetech.com';
export const domainRaw = 'https://crmapi.qzonetech.com';
export const domain = `${domainRaw}${ns}`;
export const mediaFolder = `/var/www/crmmedia`;





