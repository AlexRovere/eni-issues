import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor () { }
  private readonly http: HttpClient = inject(HttpClient);
  private readonly serverUrl: string = "http://localhost:3000"

  closeTicket (id: string): void {
    console.log("Fermeture du ticket ", id);
  }

  openTicket (id: string): void {
    console.log("Réouverture du ticket ", id);
  }

  deleteTicket (id: string): void {
    console.log("Suppression du ticket ", id);
  }

  getTicket (id: string): void {
    console.log("Récupération du ticket " + id);
  }
}
