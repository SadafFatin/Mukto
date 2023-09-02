import { Injectable } from '@angular/core';
import { domainRaw, localDomain } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalProvider {
  downloadUrlRaw = `${domainRaw}/company/public/download/file`;
  localDomain = localDomain;
  platform;
  loadingJwt = true;
  profile;
  accessRole;
  role;
  mediaUrl;
  jws: string;
  notifications = [];
  auditLogAllow = false;
  docShareAllow = false;
  async setMedia(mediaUrl) {
    this.mediaUrl = mediaUrl;
  }
  loadNotifications = (list) => {
    const added = [`123`];
    this.notifications = this.notifications
      .concat(list)
      .filter((n) => {
        if (!added.includes(n.id)) {
          added.push(n.id);
          return true;
        }
        return false;
      })
      .sort((a, b) => a.id - b.id)
      .reverse();
  };
}
