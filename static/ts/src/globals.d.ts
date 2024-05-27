import 'datatables.net';
declare global {
  interface JQuery {
    dataTable(): any;
    DataTable(): any;
  }
  interface Navigator {
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
  }
  
}