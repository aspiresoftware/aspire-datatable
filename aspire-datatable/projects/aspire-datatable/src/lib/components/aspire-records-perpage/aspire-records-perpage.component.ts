import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'aspire-records-perpage',
  templateUrl: './aspire-records-perpage.component.html',
  styleUrls: ['./aspire-records-perpage.component.css']
})
export class AspireRecordsPerpageComponent implements OnInit {
  recordsPerPageForm: FormGroup;
  @Input() itemsPerPage: number;
  @Input() showPageSizeSelector: boolean = true;
  @Input() selectRecordsPerPage: any[] = [5, 10, 20, 30, 50];
  selectedRecords: any;

  constructor() { }
  // tslint:disable-next-line:no-output-on-prefix
  public subject = new Subject<number>();
  private getPerPageRecords = new BehaviorSubject(this.itemsPerPage);
  @Output() perPageRecords = this.getPerPageRecords.asObservable();

  ngOnInit(): void {
    this.recordsPerPageForm = new FormGroup({
      recordsPerPage: new FormControl(this.itemsPerPage, Validators.required)
    });
    this.getPerPageRecords.next(this.itemsPerPage);
  }

  onSelection(value) {
    this.getPerPageRecords.next(value);
  }
}
