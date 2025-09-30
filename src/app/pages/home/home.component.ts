import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, map, Subscription, count} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit ,OnDestroy{
  public pieData$: Observable<any[]> = of([]);
  private olympicsObject?: Subscription;

  view: [number, number] = [700, 400];
  gradient = false;
  showLegend = false;
  showLabels = true;
  isDoughnut = false;
  countCountry = 0;
  jos = 0;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOlympics();
  }

  private loadOlympics(): void {
    this.pieData$ = this.olympicService.getOlympics()
      .pipe(
        map((countries: Olympic[]) => Array.isArray(countries) ? countries.map(c => ({
          name: c.country,
          value: (c.participations || []).reduce((s: number, p: Participation) => s + (p.medalsCount || 0), 0),
          extra: { id: c.id },
        })) : [])
      );
    this.jos = 3;
    this.olympicsObject = this.olympicService.getOlympics()
      .pipe()
      .subscribe((country:Olympic[]) => {
        this.countCountry = country?.length || 0;
      });
  }

  onSelect(event: any) {
    const countryName = event.name;
    this.olympicService.getOlympics().subscribe((countries: Olympic[]) => {
      const country = countries.find(c => c.country === countryName);
      if (country) {
        this.router.navigate(['/country', country.id]);
      }
    });
  }

  ngOnDestroy(): void {
    this.olympicsObject?.unsubscribe();
  }

}
