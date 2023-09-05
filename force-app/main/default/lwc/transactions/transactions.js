import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import retriveTransactions from '@salesforce/apex/TransactionsController.retriveTransactions';
import {loadStyle} from 'lightning/platformResourceLoader';
import CSS from '@salesforce/resourceUrl/txnCss';
import retriveTxn from '@salesforce/apex/TransactionsController.retriveTxn';

const columns =[
  {label: 'Txn Date' , fieldName: 'date_time', type:'date', cellAttributes:{
    class:{fieldName:'dateColor'},
    alignment: 'center',
  }},
  {label: 'Payment Date' , fieldName: 'formattedDate', type:'text', cellAttributes: { alignment: 'center'}}, 
  {label: 'Card' , fieldName: 'last4' , cellAttributes:{
    iconName:{fieldName:'iconName'}, 
    iconPosition:'left',
    alignment: 'center',
  }},
  {label: 'Charged with' , fieldName: 'reader_type_code', cellAttributes: { alignment: 'center'}},
  {label: 'Issuer' , fieldName: 'issuer', cellAttributes: { alignment: 'center'}},
  {label: 'Receipt Num' , fieldName: 'receipt_no', cellAttributes: { alignment: 'center'}},
  {label: 'Cashier' , fieldName: 'cashier', type: 'email', cellAttributes: { alignment: 'center'}},
  {label: 'Status' , fieldName: 'status_message', cellAttributes:{
    class:{
      fieldName:'statusColor',
      label: 'slds-text-align_center',
    },
    alignment: 'center',
  }},
  {label: 'Txn ID' , fieldName: 'transaction_id', cellAttributes: { alignment: 'center'}},
  {label: 'Term' , fieldName: 'term', type: 'text', cellAttributes: { alignment: 'center'}},
  {label: 'Subtotal' , fieldName: 'base_amount', type:'currency', cellAttributes: { 
    alignment: 'center',
    class: 'slds-text-align_center',
  }},
  {label: 'Total' , fieldName: 'amount', type: 'currency', cellAttributes: { alignment: 'center'}},
]
export default class TxnTable extends LightningElement {
  @track error;
  @track transactions
  @wire(CurrentPageReference)
  currentPageReference;
  receiptNum;
  filterBy="receipt_no"
  @track searchValue = '';
  showSpinner = false;
  timer;
  columns = columns;
  isCssLoaded = false;
  connectedCallback() {
    this.showSpinner = true;
    if ( this.currentPageReference.state.c__receiptNum) {
      this.receiptNum = this.currentPageReference.state.c__receiptNum;
      this.handleSearch(this.receiptNum);
    }
  }

handleError(error) {
  this.error = error;
  console.error(error);
}

  get FilterByOptions(){
    return [
      {label: "Receipt Num", value: 'receipt_no'},
      {label: "Status", value: 'status_message'},
      {label: "Txn ID", value: 'transaction_id'}
    ]
  }

  get isButtonDisabled() {
    return this.searchValue.trim() === '';
}

  filterbyHandler(event){
    this.filterBy = event.target.value
  }

  handleSearchChange(event) {
    this.searchValue = event.target.value;
    console.log(this.searchValue, 'searchvalue');
}

fetchData() {
  retriveTxn()
      .then(data => {
        this.transactions = data.transactions.map(item=>{
          let statusColor = item.status_message === "Error"?"slds-text-color_error":"slds-text-color_success"
          let iconName = item.last4 <500000 ? "custom:custom40":"utility:up"
          const formattedDate = this.formatDate(item.date);
          return {...item, 
              "statusColor":statusColor,
              "iconName":iconName,
              "dateColor": "datatable-color",
              formattedDate: formattedDate,
              term: item.term ? item.term + 'MSI' : 'REG',
          }
      })
      console.log(this.transactions)
      })
      .catch(error => {
        this.handleError(error)
      })
      .finally(() => {
        this.showSpinner = false;
      });
}

handleSearch() {
  retriveTransactions({ receiptNum: this.searchValue })
      .then(data => {
        this.transactions = data.transactions.map(item=>{
          let statusColor = item.status_message === "Error"?"slds-text-color_error":"slds-text-color_success"
          let iconName = item.last4 <500000 ? "custom:custom40":"utility:up"
          const formattedDate = this.formatDate(item.date);
          return {...item, 
              "statusColor":statusColor,
              "iconName":iconName,
              "dateColor": "datatable-color",
              formattedDate: formattedDate,
              term: item.term ? item.term + 'MSI' : 'REG',
          }
      })
      console.log(this.transactions)
      })
      .catch(error => {
        this.handleError(error)
      })
      .finally(() => {
        this.showSpinner = false;
      });
}

renderedCallback(){
  if(this.isCssLoaded) return
  this.isCssLoaded = true
  loadStyle(this, CSS).then(()=>{
    console.log('Loaded successfully');
  }).catch(error => {
    this.handleError(error)
  })
}

formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Convertir el timestamp Unix a milisegundos
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options); // Cambiar 'es-ES' al código del idioma deseado
}

}
