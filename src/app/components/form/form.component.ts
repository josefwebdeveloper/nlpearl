import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OpeningSentenceComponent} from "./opening-sentence/opening-sentence.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OpeningSentenceComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  placeholdersMockData = ['Agent Name', 'Company Name', 'First Name', 'Last Name']

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      openingSentence: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      alert(this.form.value.openingSentence)
    }
  }
}
