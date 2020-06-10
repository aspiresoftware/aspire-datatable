import { Component, OnInit } from '@angular/core';
import { records, customNoDataMessage } from '../../helper/table-record';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-datatable-basic',
  templateUrl: './datatable-basic.component.html',
  styleUrls: ['./datatable-basic.component.scss']
})
export class DatatableBasicComponent implements OnInit {
  tableHeaders: any[] = [];
  tableData: any[] = [];
  tableOptions: any;
  tablePopup: any;
  id;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.tableOptions = {
      tableStyle: 'table table-striped table-bordered',
      headerStyle: 'thead-light',
      tableRowStyle: '',
      tableDataStyle: '',
      page: 1,
      dateFormat: 'dd/MM/yyyy',
      searchingStyle: '',
      noRecordFoundMessage: customNoDataMessage,
      itemsPerPage: 10,
      resetPagination: true,
      showSorting: true,
      showSearch: true,
      showRecordsCount: true,
      showPagination: true,
      showRecordsPerPageSelector: true,
      recordsPerPageOptions: [5, 10, 20, 30, 50],
      paginationOptions: {
        ariaLabel: 'Default pagination',
        disable: false,
        paginationStyle: 'pagination justify-content-center',
        pageItemStyle: 'page-item',
        pageLinkStyle: 'page-link',
        firstPageText: '<<',
        prevPageText: '<',
        nextPageText: '>',
        lastPageText: '>>'
      },
      componentsClass: {
        topBlankComponentClassList: 'col-md-6 col-sm-12',
        bottomBlankComponentClassList: 'col-md-4 col-sm-12',
        pagination: {
          position: 'bottom-right',
          classList: 'col-md-8 col-sm-8 mt-2 mt-sm-0',
          alignmentClassList: 'justify-right justify-center-center'
        },
        recordsCount: {
          position: 'bottom-left',
          classList: 'col-md-4 col-sm-4 mt-2 mt-sm-0',
          alignmentClassList: 'justify-center-center'
        },
        search: {
          position: 'top-right',
          classList: 'col-md-6 col-sm-6 mb-2 mb-sm-0',
          alignmentClassList: 'justify-right'
        },
        recordsPerPage: {
          position: 'top-left',
          classList: 'col-md-6 col-sm-6',
          alignmentClassList: 'justify-left'
        }
      }
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = 'id';
      this.id = params[id];
    });

    // this.deleteRecord(this.id)
    this.initSampleData();
  }
  // deleteRecord(index) {
  //   const recordIndex = this.tableData.findIndex(item => {
  //     return item._id === index;
  //   });
  //   this.tableData.splice(recordIndex, 1);
  // }

  onConfirmUserDelete(event) {
    console.log(event);
    const recordIndex = this.tableData.findIndex(item => {
      return item.email === event.email;
    });
    this.tableData.splice(recordIndex, 1);
  }
  initSampleData = () => {
    this.tableHeaders = [
      { field: 'name', type: 'string' },
      { field: 'address', type: 'string' },
      { field: 'mobile', type: 'number' },
      { field: 'balance', type: 'number' },
      { field: 'email', type: 'string' },
      { field: 'isActive', type: 'boolean' },
      { field: 'date', type: 'date' },
      { field: 'age', type: 'number' },
      { field: 'action', type: 'any' }
    ];
    this.tableData = records.map((item, index) => ({
      name: `${item.name.first} ${item.name.last}`,
      address: item.address,
      mobile: item.phone,
      balance: item.balance,
      email: item.email,
      isActive: item.isActive ? 'yes' : 'no',
      date: item.date,
      age: item.age,
      action: {
        id: item._id,
        classType: 'fa fa-cog',
        perform: [
          { perAction: 'edit', class: 'fa-fa-cog', url: item._id + '/edit' },
          { perAction: 'view', class: 'fa fa-cog', url: item._id + '/view' },
          { perAction: 'delete', class: 'fa fa-cog', url: null }
        ]
      }
    })
    );
    this.tablePopup = { body: 'Do You want to delete ?', header: 'profile update!!!' };
  }

  onAdd() {
    this.router.navigate(['add']);
  }
}
