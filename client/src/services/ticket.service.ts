import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TicketWithId } from 'interfaces/Ticket';

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

  getAllTickets (): TicketWithId[] {
    let tickets: TicketWithId[] = []
    console.log("Récupération des tickets")
    this.http.get<TicketWithId[]>(this.serverUrl + "/tickets")
      .subscribe(data => {
        console.log(data);
        tickets.push(...data)
      })
    return tickets
  }
}
