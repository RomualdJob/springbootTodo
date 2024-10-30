import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm!: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], 
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); 
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  submitForm() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.service.register(this.registerForm.value).subscribe(
        (response) => {
          // Vérifie que le message de succès est bien renvoyé et affiche une alerte
          if (response && response.message) {
            alert(response.message);
          }
        },
        (error) => {
          if (error.status === 400 && error.error && error.error.message) {
            // Affiche l'erreur en cas d'échec d'enregistrement
            alert(error.error.message);
          } else {
            console.error('Error registering:', error);
            alert('Registration failed. Please try again.');
          }
        }
      );
    } else {
      alert('Form is invalid');
    }
  }
  
}
