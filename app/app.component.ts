import { Component, VERSION, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';

class Person {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  version = 'Angular: v' + VERSION.full;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  persons: Person[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'https://localhost:8765/api/v1/organisation/95166124-db90-4c88-ab6e-f5cb40b336a9/custom-table/datatable',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'firstName', class: 'none' }, { data: 'lastName' }]
    };
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      console.info("foobar");
      dtInstance.columns.adjust()
         .responsive.recalc();
    });
  }
}
