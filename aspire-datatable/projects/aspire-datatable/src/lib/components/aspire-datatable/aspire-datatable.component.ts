import { Component, OnInit, Input, AfterViewInit, Output } from '@angular/core';
import { TableEventsService } from '../../shared/table-events.service';
import { ITableOptions, TableOptions } from '../../shared/models/table-options.model';
import { PaginationOptions } from '../../shared/models/pagination-options.model';
import { ComponentsClass } from '../../shared/models/components-class.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'aspire-datatable',
  templateUrl: './aspire-datatable.component.html',
  styleUrls: ['../../shared/style.scss']
})

export class AspireDatatableComponent implements OnInit, AfterViewInit {
  @Input() headers: any[];
  @Input() records: any[];
  @Input() options: ITableOptions = new TableOptions();
  @Input() popup: any;

  isPageLoad: boolean = true;
  private onRecordAction = new BehaviorSubject(null);
  @Output() actionConfirm = this.onRecordAction.asObservable();

  constructor(private tableEvents: TableEventsService) { }

  ngOnInit(): void {
    this.options = new TableOptions(
      this.options.page,
      this.options.itemsPerPage,
      this.options.tableStyle,
      this.options.headerStyle,
      this.options.tableRowStyle,
      this.options.tableDataStyle,
      this.options.dateFormat,
      this.options.searchingStyle,
      this.options.noRecordFoundMessage,
      this.options.showSorting,
      this.options.resetPagination,
      this.options.showSearch,
      this.options.showPagination,
      this.options.showRecordsCount,
      this.options.showRecordsPerPageSelector,
      this.options.recordsPerPageOptions,
      this.options.paginationOptions ? new PaginationOptions(
        this.options.paginationOptions.ariaLabel,
        this.options.paginationOptions.maxVisiblePage,
        this.options.paginationOptions.disable,
        this.options.paginationOptions.paginationStyle,
        this.options.paginationOptions.pageItemStyle,
        this.options.paginationOptions.pageLinkStyle,
        this.options.paginationOptions.firstPageText,
        this.options.paginationOptions.prevPageText,
        this.options.paginationOptions.nextPageText,
        this.options.paginationOptions.lastPageText
      ) : new PaginationOptions(),
      this.options.componentsClass ? new ComponentsClass(
        this.options.componentsClass.topBlankComponentClassList,
        this.options.componentsClass.bottomBlankComponentClassList,
        this.options.componentsClass.search,
        this.options.componentsClass.pagination,
        this.options.componentsClass.recordsCount,
        this.options.componentsClass.recordsPerPage
      ) : new ComponentsClass()
    );
    // if page size selector and pagination is disabled then it will display all records on single page
    if ((!this.options.showRecordsPerPageSelector && !this.options.showPagination) || this.options.paginationOptions.disable) {
      this.options.itemsPerPage = this.records.length;
    }
    this.options.page = 1;
    this.tableEvents.setPage(this.options.page);
  }

  public ngAfterViewInit(): void {
    this.isPageLoad = false;
  }

  sort(item: any, event: any): void {
    this.records = this.tableEvents.sorting(item.field, this.records, event, item.type);
  }

  public getSearchRecords(value: any): void {
    if (!this.isPageLoad) { this.records = value; }
    this.onPageChanged(null, false);
  }

  onPageChanged(event: any, reset: boolean): void {
    this.options.page = event ? event.currentPage : 1;
    this.options.resetPagination = reset;
    this.tableEvents.setPage(this.options.page);
  }

  onConfirmAction(event: any, record) {
    if (event) {
      this.onRecordAction.next({ action: event, item: record });
      this.options.resetPagination = true;
      this.onPageChanged(null, true);
    }
  }

  /* Get value from dropdown of per page record selector */
  public getPerPageRecords(value: any): void {
    if (value) { this.options.itemsPerPage = Number(value); }
    this.options.page = 1;
    this.tableEvents.setPage(this.options.page);
  }

  getStart(): number {
    return (this.options.page - 1) * Number(this.options.itemsPerPage);
  }

  getEnd(): number {
    return ((this.options.page - 1) * Number(this.options.itemsPerPage)) + Number(this.options.itemsPerPage);
  }
}
