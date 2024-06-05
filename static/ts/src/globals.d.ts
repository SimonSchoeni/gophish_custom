import 'datatables.net';
declare global {
  interface JQuery {
    dataTable(): any;
    DataTable(): any;
    highcharts():any;
  }
  interface Navigator {
    msSaveBlob?: (blob: Blob, defaultName?: string) => boolean;
  }
  type EnumDictionary<TKey extends string | symbol | number, TValue> = Partial<Record<TKey, TValue>>;
}