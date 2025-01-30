import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'services/ticket.service';
import { State, TicketWithId } from 'interfaces/Ticket';

@Component({
  selector: 'app-tickets-update',
  imports: [SharedModule],
  templateUrl: './tickets-update.component.html',
  styleUrl: './tickets-update.component.scss'
})
export class TicketsUpdateComponent {

  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly ticketService = inject(TicketService)

  ticket: TicketWithId = {
    _id: "azezae16e5az",
    title: "Mon première ticket de la DB",
    description: "ma description",
    author: "Alex",
    state: State.OPEN,
    createdAt: new Date(),
    responses: []
  }

  ngOnInit () {
    let ticketId: string = this.route.snapshot.paramMap.get('id')!
    if (ticketId) {
      this.ticketService.getTicket(ticketId)
    } else {
      console.error('ID manquant, redirection...');
      this.router.navigate(['/tickets']);
    }
  }


  onSubmitUpdateTicket (form: NgForm) {
    if (form.valid) {
      console.log("Formulaire valide");
    } else {
      console.error("Formulaire non valide")
    }
  }

}
