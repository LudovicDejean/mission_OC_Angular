import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  country: any = null;
  medalsSeries: any[] = [];
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;

  view: [number, number] = [700, 400];
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.sub = this.olympicService.getOlympics()
      .pipe(map(list => Array.isArray(list) ? list.find((c: any) => c.id === id) : null))
      .subscribe((country) => {
        this.country = country;
        if (!country) return;
        this.participations = country.participations?.length || 0;
        this.totalMedals = country.participations?.reduce((s: number, p: any) => s + (p.medalsCount || 0), 0) || 0;
        this.totalAthletes = country.participations?.reduce((s: number, p: any) => s + (p.athleteCount || 0), 0) || 0;
        const series = (country.participations || []).map((p: any) => ({ name: String(p.year), value: p.medalsCount }));
        this.medalsSeries = [{ name: country.country, series }];
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  goBack() {
    this.router.navigateByUrl('/');
  }
}