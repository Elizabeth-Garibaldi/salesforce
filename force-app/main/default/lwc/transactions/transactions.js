import { LightningElement, track } from 'lwc';
import retriveTransactions from '@salesforce/apex/TransactionsTableController.retriveTransactions';
import retriveTxn from '@salesforce/apex/TransactionsTableController.retriveTxn';
export default class Transactions extends LightningElement {
  @track error;
  @track transactions = []
  fullTableData=[]
  fullTableData2=[]
  headings=["Txn Date","Payment Date", "Card", "Charged with", "Issuer", "Receipt Num", "Cashier", "Status", "Txn ID", "Term", "Subtotal", "Total"];
  filterBy="receipt_no"
  showSpinner = false;
  timer;
  connectedCallback() {
    this.showSpinner = true;
    this.fetchFilteredData(retriveTxn);
    this.fetchFilteredData(retriveTransactions, true);
  }

  fetchFilteredData(apexMethod, isSecondData = false) {
    apexMethod()
      .then(response => {
        this.formatTxnsData(response.transactions);
        if (isSecondData) {
          this.fullTableData2 = response.transactions;
        } else {
          this.fullTableData = response.transactions;
        }
        console.log(response);
      })
      .catch(error => this.handleError(error))
      .finally(() => {
        this.showSpinner = false;
      });
  }

formatTxnsData(res) {
  this.transactions = res.map((item, index) => {
    // Formatear fecha
    const formattedDateTime = this.formatDateTime(item.date_time);
    const date = new Date(item.date * 1000).toDateString();
    const amount = item.amount;
    return { ...item, id: `new_${index + 1}`, amount, date, date_time: formattedDateTime };
  });
}

formatDateTime(dateTimeString) {
  const date_time = new Date(dateTimeString);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date_time);
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

  filterbyHandler(event){
    this.filterBy = event.target.value
  }

  filterHandler(event){
    const {value} = event.target
    window.clearTimeout(this.timer)
    if(value){
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.timer = window.setTimeout(()=>{
        this.transactions = this.fullTableData2
      }, 500)
    } else {
      this.transactions = [...this.fullTableData]
    }
  }
}