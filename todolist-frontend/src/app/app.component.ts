import { Component } from '@angular/core';
import { JwtService } from 'src/app/service/jwt.service'; // Mettez à jour le chemin
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private jwtService: JwtService, private router: Router) {}

  logout() {
    this.jwtService.logout(); // Appeler la méthode de déconnexion
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }

   // Méthode pour vérifier si l'utilisateur est sur la page de connexion ou d'enregistrement
   isLoginOrRegister(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/login' || currentRoute === '/register';
  }


}



