import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {

  private readonly dataUrl = 'assets/mock/olympic.json';

  constructor(private http: HttpClient, private router: Router) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.dataUrl).pipe(
      catchError((error) => {
        console.error('Erreur chargement olympics:', error);
        this.router.navigate(['/notfound']);
        return throwError(() => error);
      })
    );
  }
}
