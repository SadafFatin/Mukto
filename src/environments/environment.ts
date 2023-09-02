// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};
export const NOTIFICATION_SOCKET_PORT = 'http://localhost:3100';
export const ns = '/company';
export const localDomain = 'http://localhost:8100';
//export const domainRaw = 'https://crmapi.qzonetech.com';
export const domainRaw = 'http://localhost:3031';
export const domain = `${domainRaw}${ns}`;
export const mediaFolder = `/Users/qzt01/Desktop/profilepic`;
