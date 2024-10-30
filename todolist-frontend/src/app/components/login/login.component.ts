import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  loginForm!: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    console.log('Token during ngOnInit:', token);
    
    if (token) {
      this.router.navigate(['/todolist']); // Redirection vers la To-Do List si le token existe
    } else {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
            //alert("Hello, your token is " + response.jwt);
            localStorage.setItem('jwtToken', response.jwt); // Stockage du token
            this.router.navigate(['/todolist']); // Redirection vers la To-Do List
         
        },
        (error) => {
          console.error("Login error: ", error);
          alert("An error occurred. Please try again.");
        }
      );
    } else {
      alert("Please fill in all required fields.");
    }
  }
}
