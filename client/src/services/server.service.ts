import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor () { }

  private readonly http: HttpClient = inject(HttpClient);
  private readonly serverUrl: string = "http://localhost:3000"

  pingServer (): boolean {
    let res = this.http.get(`${this.serverUrl}/ping`)
    console.log(res);
    return !!res
  }
}
