import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage {

  searchUserForm: FormGroup;
  submitted: any = false;
  loading: any = false;
  error: any;
  rows: any;
  messages: any;
  optionsFilter: any[] = [];
  filterId: any;
  filterPrice: any;
  inpuId: any;
  inputPrice: any;
  copyData: any;
  isRows: any = false

  constructor(private formBuilder: FormBuilder, private _dataService: DataService) {
    this.searchUserForm = this.formBuilder.group({
      emailUser: ['', Validators.required],
      app: ['', Validators.required]
    });
    this.messages = {
      emptyMessage:'No hay resultados',
      totalMessage: 'Total'
    }
    this.optionsFilter = ["Like", ">=", "<="];
  }

  get f(){
    return this.searchUserForm.controls;
  }

  onSubmit(){
    this.submitted = true;

    if(this.searchUserForm.invalid){
      return;
    }

    this.loading = true;

    this._dataService.getData(this.f.emailUser.value, this.f.app.value).subscribe(data => {
          this.loading = false;
          this.error = false;
          console.log(data)
          this.rows = [...data.map(book => {
            return { "id": book.bookingId,
                     "client": `${book.tutenUserClient.firstName} ${book.tutenUserClient.lastName}`,
                     "createDate": book.bookingTime,
                     "address": book.locationId.streetAddress,
                     "price": book.bookingPrice   
                 
                    };
          })];
          this.copyData = [...this.rows];
          if(this.rows){
            this.isRows = true;
          }else{
            this.isRows = false;
          }
        },
        error => {
          if(error){
            this.error = "No se encontraron resultados";
            this.loading = false;
          }
        }
      )
  }

  filterTable(){
    // hacer validacion de filtros si viene id validar id, si viene price validar price
    this.rows = this.copyData;
    if(this.filterId !== undefined){
      this.rows = this.switchFilter(this.filterId, 'id', this.inpuId);
    }
    if(this.filterPrice !== undefined){
      this.rows = this.switchFilter(this.filterPrice, 'price', this.inputPrice);
    }
  }

  switchFilter(valueFilter, propertyName, valueInput){
    switch (valueFilter) {
      case 'Like':
        return this.rows.filter(book => {
          return book[propertyName] == valueInput;
        });
        break;

      case '>=':
        return this.rows.filter(book => {
          return book[propertyName] >= valueInput;
        });
        break;

      case '<=':
        return this.rows.filter(book => {
          return book[propertyName] <= valueInput;
        });
        break;
    
      default:
        break;
    }
  }

}
