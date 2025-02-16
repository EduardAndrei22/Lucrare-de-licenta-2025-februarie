import { Component, Input, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-general-stats',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    CardModule,
    DividerModule,
    ImageModule,
    SharedModule,
    TableModule,
    TagModule,
    TabViewModule,
  ],
  templateUrl: './general-stats.component.html',
  styleUrl: './general-stats.component.scss',
})
export class GeneralStatsComponent implements OnInit {
  @Input() stats!: any;

  ngOnInit() {
    console.log(this.stats);
  }
}
