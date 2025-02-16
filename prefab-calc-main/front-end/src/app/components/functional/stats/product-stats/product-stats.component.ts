import { Component, Input, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { StateService } from '../../../../services/state.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../../../services/stats.service';

@Component({
  selector: 'app-product-stats',
  standalone: true,
  imports: [NgxEchartsModule, SelectButtonModule, FormsModule],
  templateUrl: './product-stats.component.html',
  styleUrl: './product-stats.component.scss',
})
export class ProductStatsComponent implements OnInit {
  @Input() stats!: any;

  constructor(
    private state: StateService,
    private statsService: StatsService,
  ) {}

  ngOnInit(): void {
    this.createCharts();
  }

  get currentTheme() {
    return this.state.currentTheme.includes('dark') ? 'dark' : 'light';
  }

  chartOpts: any = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
      axisPointer: {
        type: 'shadow',
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10,
      },
      {
        start: 0,
        end: 10,
      },
    ],
  };

  mostSoldOpts: any = {
    backgroundColor: 'transparent',
    tooltip: this.chartOpts.tooltip,
    toolbox: this.chartOpts.toolbox,
    grid: {
      containLabel: true,
    },
  };

  mostRevenueOpts: any = {
    backgroundColor: 'transparent',
    tooltip: this.chartOpts.tooltip,
    toolbox: this.chartOpts.toolbox,
    grid: {
      containLabel: true,
    },
  };

  salesByDateOpts: any = {
    backgroundColor: 'transparent',
    tooltip: this.chartOpts.tooltip,
    toolbox: this.chartOpts.toolbox,
    grid: {
      containLabel: true,
    },
  };

  salesByDateInstance: any;

  setSalesByDateInstance(instance: any) {
    this.salesByDateInstance = instance;
  }

  viewOptions: any[] = [
    { name: 'Zilnic', value: 'daily' },
    { name: 'Lunar', value: 'monthly' },
    {
      name: 'Anual',
      value: 'yearly',
    },
  ];

  selectedView = 'daily';

  changeSalesOpt() {
    this.statsService
      .fetchProductStats({ sales_type: this.selectedView })
      .subscribe((data: any) => {
        this.stats = data;
        this.createCharts();
        if (this.salesByDateInstance) {
          this.salesByDateInstance.setOption(this.salesByDateOpts, true);
        }
      });
  }

  createMostSold() {
    this.mostSoldOpts.title = {
      left: 'center',
      textStyle: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
      text: 'Top vânzări (cantitate)',
    };
    const names = this.stats.most_sold_prefabs.names.reverse();
    const quantities = this.stats.most_sold_prefabs.quantities.reverse();

    this.mostSoldOpts.yAxis = {
      type: 'category',
      data: names,
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
        overflow: 'break',
        width: 140,
      },
    };

    this.mostSoldOpts.xAxis = {
      type: 'value',
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
    };

    this.mostSoldOpts.series = [
      {
        name: 'bucăți',
        type: 'bar',
        data: quantities,
      },
    ];

    this.mostSoldOpts.toolbox.feature.saveAsImage = {
      title: 'Salvează imagine',
      name: 'Top vânzări',
      type: 'png',
    };

    // this.mostSoldOpts.toolbox.feature.dataView = {
    //   title: 'Vezi date',
    //   lang: ['Date', 'Închide', 'Reîmprospătează'],
    // };

    this.mostSoldOpts.color = {
      type: 'linear',
      x: 0,
      y: 1,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: '#9ea0f6', // color at 0%
        },
        {
          offset: 1,
          color: '#5457cd', // color at 100%
        },
      ],
      global: false, // default is false
    };
  }

  createMostRevenue() {
    this.mostRevenueOpts.title = {
      left: 'center',
      textStyle: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
      text: 'Top vânzări (venit)',
    };
    const names = this.stats.highest_revenue_prefabs.names.reverse();
    const revenues = this.stats.highest_revenue_prefabs.revenues.reverse();

    this.mostRevenueOpts.yAxis = {
      type: 'category',
      data: names,
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
        overflow: 'break',
        width: 140,
      },
    };

    this.mostRevenueOpts.xAxis = {
      type: 'value',
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
    };

    this.mostRevenueOpts.series = [
      {
        name: 'RON',
        type: 'bar',
        data: revenues,
      },
    ];

    this.mostRevenueOpts.toolbox.feature.saveAsImage = {
      title: 'Salvează imagine',
      name: 'Top vânzări',
      type: 'png',
    };

    this.mostRevenueOpts.color = {
      type: 'linear',
      x: 0,
      y: 1,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: '#94e0ed', // color at 0%
        },
        {
          offset: 1,
          color: '#059bb4', // color at 100%
        },
      ],
      global: false, // default is false
    };
  }

  createSalesByDate() {
    const salesByDate = this.stats.sales_by_date;
    const dates = salesByDate.dates;
    const totals = salesByDate.totals;

    // line chart
    this.salesByDateOpts.title = {
      left: 'center',
      textStyle: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
      text: 'Vânzări pe date',
    };

    this.salesByDateOpts.yAxis = {
      type: 'value',
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
    };

    this.salesByDateOpts.xAxis = {
      type: 'category',
      data: dates,
      axisLabel: {
        fontFamily: 'Bricolage Grotesque, sans-serif',
      },
    };

    this.salesByDateOpts.series = [
      {
        name: 'RON',
        type: 'line',
        data: totals,
      },
    ];

    // if only one date, show it as a bar chart
    if (dates.length === 1) {
      this.salesByDateOpts.series[0].type = 'bar';
    }

    this.salesByDateOpts.toolbox.feature.saveAsImage = {
      title: 'Salvează imagine',
      name: 'Vânzări pe date',
      type: 'png',
    };

    this.salesByDateOpts.color = {
      type: 'linear',
      x: 0,
      y: 1,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: '#f6a6a6', // color at 0%
        },
        {
          offset: 1,
          color: '#cd5454', // color at 100%
        },
      ],
      global: false, // default is false
    };

    // add data scale
    this.salesByDateOpts.dataZoom = [
      {
        type: 'inside',
      },
      {},
    ];
  }

  createCharts() {
    this.createMostSold();
    this.createMostRevenue();
    this.createSalesByDate();
  }
}
