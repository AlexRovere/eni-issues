import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TicketService } from 'services/ticket.service';
import { NgForm } from '@angular/forms';
import { State, Ticket, TicketWithId } from 'interfaces/Ticket';

@Component({
  selector: 'app-tickets',
  imports: [SharedModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {

  private readonly ticketService = inject(TicketService)

  ticket: Ticket = {
    title: "",
    description: "",
    author: "",
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  }

  tickets: TicketWithId[] = [
    {
      _id: "azezae16e5az",
      title: "Mon première ticket de la DB",
      description: "ma description",
      author: "Alex",
      state: State.OPEN,
      createdAt: new Date(),
      responses: []
    },
    {
      _id: "azezae16azeazzae5az",
      title: "Mon deuxième ticket de la DB",
      description: "ma description",
      author: "Jean",
      state: State.OPEN,
      createdAt: new Date(),
      responses: []
    }
  ]

  ngOnInit () {
    this.getAllTickets()
  }

  onSubmitCreateTicket (form: NgForm) {
    if (form.valid) {
      this.createTicket()
      console.log("Formulaire valide");
    } else {
      console.error("Formulaire non valide")
    }
  }

  createTicket () {
    this.ticketService.createTicket(this.ticket)
    this.getAllTickets()
    this.ticket.title = ""
    this.ticket.description = ""
    this.ticket.author = ""
  }

  closeTicket (id: string) {
    this.ticketService.closeTicket(id)
  }

  openTicket (id: string) {
    this.ticketService.openTicket(id)
  }

  deleteTicket (id: string) {
    this.ticketService.deleteTicket(id).subscribe({
      next: (response) => {
        console.log(response)

        if (response.status === 200) {
          console.log(response.body.message)
          this.getAllTickets()
        }
        if (response.status === 404 || response.status === 500) {
          console.error(response.body.message);
        }
      }
    })
  }

  getAllTickets () {
    this.tickets = this.ticketService.getAllTickets()
  }


}
