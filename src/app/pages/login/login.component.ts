import {Component} from '@angular/core';
import {FormComponent} from "../../components/form/form.component";
import {PromoComponent} from "../../components/promo/promo.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormComponent,
    PromoComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
