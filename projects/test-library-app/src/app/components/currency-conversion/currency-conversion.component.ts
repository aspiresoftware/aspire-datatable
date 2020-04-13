import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { CurrencyConversionService } from 'angular-currency-converter';
import { apis, apisSource } from '../../config/config';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.css']
})
export class CurrencyConversionComponent implements OnInit {
  model: NgbDateStruct;
  myForm: FormGroup;
  public amount: Number;
  public baseCurrencyRate: string; // base currencies rate  
  public baseCurrencyCode: string; // base currency code
  public convertedRates: any = []; // store converted 
  public currencyRates: any = [];  // store data from currency rates
  public apisUrl: string = apis  // apis url 
  public apisSource: any =  apisSource // apis source
  public disabled: boolean; 
  public selectedSource: string; // selected source

  constructor(private currencyConversionService:CurrencyConversionService) {
   }

  ngOnInit() {
    // Make form value blank
    this.myForm = new FormGroup({
      amount: new FormControl('',Validators.required),
      targetSource: new FormControl('',Validators.required),
      countryRates: new FormControl('',Validators.required),
      targetRates: new FormControl('',Validators.required),
      datePicker: new FormControl('')
    });

    // Get default currencies rate [ default base: EUR ]
    this.currencyConversionService.getCurrencyRates(`${apis}/latest`).subscribe(data => {
      if(data){
        for (var key in data['rates']) {
          if (data['rates'].hasOwnProperty(key)) {
            this.currencyRates.push({ currencyCode: key, rate: data['rates'][key],defaultBase: data.base })
          }
        }
      }
    })
  }
 
  /* On source change  */
  async onSourceChange(event) {
    this.selectedSource = event.target.options[event.target.options.selectedIndex].text
    if(this.selectedSource == 'history') { // On select history user have to apply date
      this.disabled = false;
    }else{
      /* Get latest currencies rate by selection of latest option */
      this.disabled = true;
      this.currencyRates = [];
      this.currencyConversionService.getCurrencyRates(`${apis}/latest`).subscribe(data => {
        if(data){
          for (var key in data['rates']) {
            if (data['rates'].hasOwnProperty(key)) {
              this.currencyRates.push({ currencyCode: key, rate: data['rates'][key],defaultBase: data.base })
            }
          }
        }
      })
    }
  }

  /* On date change get currencies rate of specified date  */
  async onDateChange(model) {
    if(model !== undefined){
      this.currencyRates = [];
      let date = `${model.year}-${model.month}-${model.day}`
      let url = `${apis}/${date}`
      this.currencyConversionService.getCurrencyRates(url).subscribe(data => {
        if(data){
          for (var key in data['rates']) {
            if (data['rates'].hasOwnProperty(key)) {
              this.currencyRates.push({ currencyCode: key, rate: data['rates'][key],defaultBase: data.base })
            }
          }
        }
      })
    }
  }

/* Get submitted form values */
 async onSubmit(form: FormGroup) {
    let amount = form.value.amount;
    let baseCurrencyRate = form.value.countryRates.rate;
    let baseCurrencyCode = form.value.countryRates.currencyCode;
    let targetCurrencyRate = form.value.targetRates.rate;
    let targetCurrencyCode = form.value.targetRates.currencyCode;
    this.convertedRates = await this.currencyConversionService.convertCurrency(amount,baseCurrencyRate,baseCurrencyCode,targetCurrencyRate,targetCurrencyCode);
    this.resetForm()
  }

  /* Reset form after submit values */
  resetForm() {
    this.myForm = new FormGroup({
      amount: new FormControl(''),
      targetSource: new FormControl(''),
      countryRates: new FormControl(''),
      targetRates: new FormControl(''),
      datePicker: new FormControl('')
    });
  
  }
}
