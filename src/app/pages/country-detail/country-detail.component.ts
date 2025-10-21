import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OlympicService} from '../../core/services/olympic.service';
import {Subscription, map} from 'rxjs';
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { Series, DataItem } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  country: Olympic | null = null;
  medalsSeries: Series[] = [];
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;
  countryName = "";

  view: [number, number] = [400, 400];
  autoScale = true;
  animations = true;
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Année';
  yAxisLabel = 'Médailles';

  private sub?: Subscription;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {
  }

  ngOnInit(): void {
    this.loadOlympicsDetails();
  }

  private loadOlympicsDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.sub = this.olympicService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef),map(list => Array.isArray(list) ? list.find((c: Olympic) => c.id === id) : null))
      .subscribe((country) => {
        if (!country) {
          // Rediriger vers une page 404 si l'id n'est pas valide
          this.router.navigate(['/notfound'])
          return;
        }
        this.countryName = country.country
        this.participations = country.participations?.length || 0;
        this.totalMedals = country.participations?.reduce((s: number, p: Participation) => s + (p.medalsCount || 0), 0) || 0;
        this.totalAthletes = country.participations?.reduce((s: number, p: Participation) => s + (p.athleteCount || 0), 0) || 0;
        const series = (country.participations || []).map((p: Participation) => ({
          name: String(p.year),
          value: p.medalsCount
        }));
        this.medalsSeries = [{name: country.country, series}];
      });
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
