import {Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, of, map, Subscription, count} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";
import { ChartSelectEvent } from '../../core/models/ChartSelectEvent';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{
  public pieData$: Observable<ChartSelectEvent[]> = of([]);
  private olympicsObject?: Subscription;
  private destroyRef = inject(DestroyRef);

  view: [number, number] = [400, 400];
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

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      this.view = [width, width * 0.75]; // ratio 4:3
    });
    resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private loadOlympics(): void {
    this.pieData$ = this.olympicService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef),
        map((countries: Olympic[]) => Array.isArray(countries) ? countries.map(c => ({
          name: c.country,
          value: (c.participations || []).reduce((s: number, p: Participation) => s + (p.medalsCount || 0), 0),
          extra: { id: c.id },
        })) : [])
      );
    this.jos = 3;
    this.olympicsObject = this.olympicService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((country:Olympic[]) => {
        this.countCountry = country?.length || 0;
      });
  }

  onSelect(event: ChartSelectEvent): void {
    const countryName = event.name;
    this.olympicService.getOlympics().subscribe((countries: Olympic[]) => {
      const country = countries.find(c => c.country === countryName);
      if (country) {
        this.router.navigate(['/country', country.id]);
      }
    });
  }

}
