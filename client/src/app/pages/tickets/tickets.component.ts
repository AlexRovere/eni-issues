import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TicketService } from 'services/ticket.service';
import { State, Ticket, TicketWithId } from 'interfaces/Ticket';
import { FormError } from '../../../errors/FormError';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {

  private readonly ticketService = inject(TicketService)
  private readonly formBuilder = inject(FormBuilder)

  createTicketForm!: FormGroup;

  tickets: TicketWithId[] = []

  ngOnInit () {
    this.getAllTickets()
    this.initForm()
  }

  initForm () {
    this.createTicketForm = this.formBuilder.group({
      title: [''],
      description: ['', Validators.required],
      author: ['', Validators.required],
      state: State.OPEN,
      createdAt: new Date(),
      responses: []
    });
  }

  onSubmitCreateTicket () {
    if (this.createTicketForm.valid) {
      this.createTicket()
    } else {
      this.createTicketForm.markAllAsTouched();
    }
  }

  createTicket () {
    const ticket: Ticket = this.createTicketForm.value
    this.ticketService.createTicket(ticket).subscribe({
      next: (response) => {
        this.initForm()
        this.getAllTickets()
      },
      error: (error) => {
        // Gestion des erreurs venant du back-end
        if (error instanceof FormError) {
          error.errors.forEach(e => {
            const field = this.createTicketForm.get(e.field)
            if (field) {
              const newError = { [e.type]: true }
              field.setErrors({ ...field.errors, ...newError })
            }
          })
          this.createTicketForm.markAllAsTouched()
        } else {
          console.error(error);
        }
      }
    })
  }

  closeTicket (id: string) {
    this.ticketService.closeTicket(id).subscribe({
      next: (response) => {
        this.getAllTickets()
        console.log("Ticket fermé avec succès")
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  openTicket (id: string) {
    this.ticketService.openTicket(id).subscribe({
      next: (response) => {
        this.getAllTickets()
        console.log("Ticket ouvert avec succès")
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  deleteTicket (id: string) {
    this.ticketService.deleteTicket(id).subscribe({
      next: (response) => {
        this.getAllTickets()
        console.log(response);

        this.getAllTickets()
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getAllTickets () {
    this.ticketService.getAllTickets().subscribe({
      next: (response) => {
        this.tickets = response?.tickets
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
