import { Component, OnInit } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  public pieData$: Observable<any[]> = of([]);

  view: [number, number] = [700, 400];
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.pieData$ = this.olympics$.pipe(
      map((countries: any[]) => Array.isArray(countries) ? countries.map(c => ({
        name: c.country,
        value: (c.participations || []).reduce((s: number, p: any) => s + (p.medalsCount || 0), 0),
        extra: { id: c.id }
      })) : [])
    );
  }

  onSelect(event: any) {
    const countryName = event.name;
    this.olympics$.subscribe((countries: any[]) => {
      const country = countries.find(c => c.country === countryName);
      if (country) {
        this.router.navigate(['/country', country.id]);
      }
    });
  }
}
