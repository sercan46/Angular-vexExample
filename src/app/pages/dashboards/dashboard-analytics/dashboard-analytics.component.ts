import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { DashboardAnalyticsService } from './dashboard-analytics.service';
import { PeriodData } from './period-data';
import { ShareData } from './share-data';


const data={
  chart: {
    caption: "Hisse",
    yaxisname: "Değer",
    subcaption: "",
    showhovereffect: "1",
    numbersuffix: "",
    drawcrossline: "1",
    plottooltext: "<b>$dataValue</b> of youth were on $seriesName",
    theme: "fusion"
  },
  categories: [
    {
      category: []
    }
  ],
  dataset: [
    {
      seriesname: "",
      data: []
    }
  ]
};


@Component({
  selector: 'vex-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})

export class DashboardAnalyticsComponent implements OnInit {
  shareData = ShareData;
  periodData = PeriodData;
  width = "100%";
  height = 400;
  type = "msline";
  dataFormat = "json";
  dataSource = data;
  displayedColumns: string[] = ['share','date','open'];
  dataSourceTable = [];
  filterForm: FormGroup;
  periodList: any[] = [];
  filterPeriodList = [];
  showChartLine=false;
  constructor(private cd: ChangeDetectorRef, public dashboardService: DashboardAnalyticsService, private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      shareControl: ['', Validators.required],
      startDateControl: ['', Validators.required],
      endDateControl: ['', Validators.required],
      intervalControl: ['', Validators.required]
    });
  }
  getShare() {
    if (this.filterForm.valid) {
      this.clearArray();
      this.showChartLine=true;
      this.dashboardService.getShareData(this.filterForm.controls['intervalControl'].value == "Günlük" ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY', this.filterForm.controls['shareControl'].value, this.filterForm.controls['intervalControl'].value).then(res => {
        if(this.filterForm.controls['intervalControl'].value=="Günlük"){
          this.periodList.push(res['Time Series (' + 'Daily' + ')']);
        }
        else{
          this.periodList.push(res['Time Series (' + this.filterForm.controls['intervalControl'].value + ')']);
        }
        for (let i in this.periodList[0]) {
          if (new Date(i) >= new Date(moment(this.filterForm.controls['startDateControl'].value).format('YYYY-MM-DD HH:mm:SS')) && new Date(moment(this.filterForm.controls['endDateControl'].value).format('YYYY-MM-DD HH:mm:SS')) >= new Date(i)) {
            this.filterPeriodList.push({...this.periodList[0][i],date:moment(i).format('MM/DD/YYYY')})
          }
        }
        this.filterPeriodList.forEach((y)=>{
          this.dataSourceTable.push({...y,"open":y['1. open'],"share":this.filterForm.controls['shareControl'].value});
          data['categories'][0]['category'].push({"label":moment(y['date']).format('MM/DD/YYYY')})
          data['dataset'][0]['data'].push({'value':y['1. open']})
          data['dataset'][0]['seriesname']=this.filterForm.controls['shareControl'].value;
          data.chart['subcaption']=this.filterForm.controls['shareControl'].value;
        });
        this.dataSource=data;
      })
    }
  }
  clearArray(){
    this.periodList = [];
    this.filterPeriodList = [];
    this.dataSourceTable=[];
    this.dataSource={categories:[],dataset:[], chart:data['chart']};
    data['categories'][0]['category']=[];
    data['dataset'][0]['data']=[];
  }
}
