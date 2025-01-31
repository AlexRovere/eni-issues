import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ticket, TicketWithId } from 'interfaces/Ticket';
import { catchError, Observable, throwError } from 'rxjs';
import { FormError } from '../errors/FormError';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor () { }
  private readonly http: HttpClient = inject(HttpClient);
  private readonly serverUrl: string = "http://localhost:3000"


  createTicket (ticket: Ticket): Observable<any> {
    return this.http.post(`${this.serverUrl}/tickets/create`, ticket).pipe(
      catchError((res: HttpErrorResponse) => this.handleError(res))
    )
  }

  closeTicket (id: string): void {
    console.log("Fermeture du ticket ", id);
  }

  openTicket (id: string): void {
    console.log("Réouverture du ticket ", id);
  }

  deleteTicket (id: string): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(`${this.serverUrl}/tickets/delete/${id}`).pipe(
      catchError((res: HttpErrorResponse) => this.handleError(res))
    )
  }

  getTicket (id: string): void {
    console.log("Récupération du ticket " + id);
  }

  getAllTickets (): TicketWithId[] {
    let tickets: TicketWithId[] = []
    this.http.get<TicketWithId[]>(this.serverUrl + "/tickets")
      .subscribe(data => {
        tickets.push(...data)
      })
    return tickets
  }

  getAllTicketsObs (): Observable<any> {
    return this.http.get<TicketWithId[]>(this.serverUrl + "/tickets").pipe(
      catchError((res: HttpErrorResponse) => this.handleError(res))
    )
  }

  handleError (res: any) {
    return throwError(() => {
      if (res.error?.formErrors) {
        return new FormError(res.error.message, res.error.formErrors)
      }
      if (res.error?.message) {
        return new Error(res.error.message)
      }
      return new Error("Erreur lors de la récupération de la ressource..")
    })
  }
}
