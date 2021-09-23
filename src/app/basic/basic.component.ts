
import { AfterViewInit, Component, OnInit } from '@angular/core';
import Handsontable from 'handsontable';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements AfterViewInit {
  dataset = [];
  isDataFetched = true;
  customColumnWidth = JSON.parse(localStorage.getItem('saveColumnWidth')) ? JSON.parse(localStorage.getItem('saveColumnWidth')) : [50, 100, 200];
  movedColumns = JSON.parse(localStorage.getItem('saveColumnOrder')) ? JSON.parse(localStorage.getItem('saveColumnOrder')) : this.dataset;



  ngAfterViewInit() {
    this.fetchDataFromAssets('assets/tmdb_5000_movies.csv');

  }



  createTable() {


    const container = document.querySelector('#example1');
    const save = (document.querySelector('#save') as HTMLButtonElement);

    const hot = new Handsontable(container, {


      licenseKey: 'non-commercial-and-evaluation',
      data: this.movedColumns,


      stretchH: 'all',
      // height: 100,
      maxRows: 1000,
      colWidths: this.customColumnWidth,
      // trimRows: [0],
      colHeaders: true,
      renderAllRows: false,
      manualColumnResize: true,
      manualColumnMove: true,

    });

    Handsontable.dom.addEvent(save, 'click', () => {
      localStorage.setItem('saveColumnWidth', JSON.stringify([hot.getColWidth(0), hot.getColWidth(1), hot.getColWidth(2), hot.getColWidth(3), hot.getColWidth(4), hot.getColWidth(5), hot.getColWidth(6), hot.getColWidth(7), hot.getColWidth(8), hot.getColWidth(9), hot.getColWidth(10), hot.getColWidth(11), hot.getColWidth(12), hot.getColWidth(13), hot.getColWidth(14), hot.getColWidth(15), hot.getColWidth(16), hot.getColWidth(17), hot.getColWidth(18), hot.getColWidth(19)]));
      localStorage.setItem('saveColumnOrder', JSON.stringify(hot.getData()));
    });



  }
  fetchDataFromAssets(sheetUrl) {

    const oReq = new XMLHttpRequest();
    oReq.open('GET', sheetUrl, true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = (e) => {
      const currentObject = this;
      const arraybuffer = oReq.response;
      /* convert data to binary string */
      const data = new Uint8Array(arraybuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      //        Call XLSX
      const workbook = XLSX.read(bstr, { type: 'binary' });
      //  DO SOMETHING WITH workbook HERE
      const first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      const worksheet = workbook.Sheets[first_sheet_name];
      const json = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { header: 1, raw: true }
      );


      currentObject.dataset = json;
      currentObject.movedColumns = JSON.parse(localStorage.getItem('saveColumnOrder')) ?
        JSON.parse(localStorage.getItem('saveColumnOrder')) : currentObject.dataset;
      currentObject.isDataFetched = false;

      currentObject.createTable();

    };
    oReq.send();
  }
}
