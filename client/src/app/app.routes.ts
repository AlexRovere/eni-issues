import { Routes } from '@angular/router';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketsUpdateComponent } from './pages/tickets/tickets-update/tickets-update.component';
import { TicketsDetailComponent } from './pages/tickets/tickets-detail/tickets-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/tickets",
    pathMatch: "full"
  },
  { path: "tickets", component: TicketsComponent },
  { path: "tickets/update/:id", component: TicketsUpdateComponent },
  { path: "tickets/detail/:id", component: TicketsDetailComponent },
  { path: "**", component: NotFoundComponent }
];
