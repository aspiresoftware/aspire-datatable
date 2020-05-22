import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'aspire-searching',
  templateUrl: './aspire-searching.component.html',
  styleUrls: ['./aspire-searching.component.css']
})

export class AspireSearchingComponent implements OnInit {
  @Input() records: any[] = [];
  @Input() searchingStyle: string = "";
  @Output() getSearchRecords: EventEmitter<any> = new EventEmitter<any>();

  totalRecords: any = [];

  constructor() {
    this.totalRecords = [];
  }

  ngOnInit() {
    this.totalRecords = this.records;
  }

  search(event: string) {
    let searchItem: any = event;
    let filterRecord: any = [];
    if (searchItem === '') {
      this.records = this.totalRecords;
    }
    else {
      if (this.totalRecords.length) {
        if (searchItem.length > 2) {
          filterRecord = this.totalRecords.filter(element => {
            const isAvailable = Object.values(element).some(objectValues =>
              objectValues.toString().trim().toLowerCase().includes(searchItem.toLowerCase().trim())
            );
            if (isAvailable) return element;
          });
          this.records = filterRecord.length ? [...new Set(filterRecord)] : [];
        }
        else {
          this.records = this.totalRecords;
        }
      }
    }
    this.getSearchRecords.emit(this.records);
  }
}