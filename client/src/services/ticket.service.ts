import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ticket, TicketWithId } from 'interfaces/Ticket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor () { }
  private readonly http: HttpClient = inject(HttpClient);
  private readonly serverUrl: string = "http://localhost:3000"


  createTicket (ticket: Ticket): void {
    this.http.post(`${this.serverUrl}/tickets/create`, ticket)
      .subscribe(data => {
        console.log(data)
      })
    console.log("Création du ticket ", ticket);
  }

  closeTicket (id: string): void {
    console.log("Fermeture du ticket ", id);
  }

  openTicket (id: string): void {
    console.log("Réouverture du ticket ", id);
  }

  deleteTicket (id: string): Observable<HttpResponse<any>> {
    console.log("Suppression du ticket ", id);
    return this.http.delete<HttpResponse<any>>(`${this.serverUrl}/tickets/delete/${id}`, { observe: 'response' });
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
