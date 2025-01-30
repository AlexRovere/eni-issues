import { Component, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./partials/header/header.component";
import { initFlowbite } from 'flowbite';
import { FooterComponent } from "./partials/footer/footer.component";
import localeFr from '@angular/common/locales/fr';
import { CommonModule, registerLocaleData } from '@angular/common';


registerLocaleData(localeFr, 'fr')

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'ENI-Tickets';
  ngOnInit (): void {
    initFlowbite();
  }
}
