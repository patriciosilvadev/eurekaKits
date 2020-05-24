import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialogRef } from '@angular/material';
import { DetalleVentas } from 'src/app/models/detalleventa';
import { DetaventaService } from 'src/app/services/detaventa.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import jwt from 'jwt-decode';
import { Consultas } from 'src/app/models/consultas';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Fecha } from 'src/app/validators/fecha';
import { Numfactura } from 'src/app/models/numfactura';
import { Factura } from 'src/app/models/factura';
import { FacturaService } from 'src/app/services/factura.service';
import { Dto } from 'src/app/models/dto';


@Component({
  selector: 'app-canasta',
  templateUrl: './canasta.component.html',
  styleUrls: ['./canasta.component.scss']
})
export class CanastaComponent implements OnInit {
  dto: Dto[];
  detalleVenta: DetalleVentas[];
  persona: Consultas[];
  numFactura: Numfactura[];
  fechaFact: any;
  authBottom: boolean;
  newFactura: Factura = {
    subtotal: 0,
    dto: 0,
    iva: 0,
    total: 0,
  };
  newDto: Dto = {
    iddto: 0,
    dto: 0,
    estado: 0,
  };

  constructor(
    private dialog: MatDialog,
    private detaventaService: DetaventaService,
    private router: Router,
    private authService: AuthService,
    private consultasService: ConsultasService,
    private fecha: Fecha,
    private facturaService: FacturaService
    // private categoriaformvali: Categoriaformvali
  ) {
    this.fechaFact = this.fecha.dateExat();
  }
  //  form = this.categoriaformvali.formCategoria;
  listCanasta: MatTableDataSource<any>;
  displayedColumns: string[] = ['idFactura', 'idProducto', 'cantidad', 'precio', 'total', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  ngOnInit() {
    this.onGetPersona();
    this.onGetViewNumFactura();
    this.onGetDescuento();
    this.onGetDetaVentaAll();
  }
  onGetPersona() {
    const idpersona = localStorage.getItem('idpersona');
    this.consultasService.onGetPersonapdt(idpersona).subscribe(
      res => {
        this.persona = res;
      },
      err => {
        console.log(err);
      }
    );
  }
  onGetViewNumFactura() {
    const aux = localStorage.getItem('idfactura');
    this.numFactura = this.addCero(aux);
    console.log(this.numFactura);
  }
  onGetDetaVentaAll() {
    const idFactura = localStorage.getItem('idfactura');
    this.consultasService.onGetDetaVentadvp(idFactura).subscribe(
      res => {
        if (res != null) {
          this.detalleVenta = res;
          this.newFactura.subtotal = this.detalleVenta.map(t => t.total).reduce((acc, value) => acc + value);
          const auxIva = (this.newFactura.subtotal * 0.12);
          this.newFactura.dto = (this.newFactura.subtotal * (this.newDto.dto / 100)).toFixed(2);
          // tslint:disable-next-line:radix
          this.newFactura.iva = parseFloat(auxIva.toFixed(2));
          this.newFactura.total = (this.newFactura.subtotal + this.newFactura.iva - this.newFactura.dto).toFixed(2);
          this.listCanasta = new MatTableDataSource(this.detalleVenta);
          this.listCanasta.sort = this.sort;
          this.listCanasta.paginator = this.paginator;
          this.authBottom = true;
        } else {
          this.authBottom = false;
        }
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 404) {
            console.log('No existe datos');
          }
        }
      }
    );
  }
  onGetDescuento() {
    this.consultasService.onGetDto().subscribe(
      res => {
        this.dto = res;
        this.newDto.dto = this.dto[0].dto;
      },
      err => {
        console.log(err);
      }
    );
  }
  onSubmit() {
    const id = localStorage.getItem('idfactura');
    this.facturaService.onUpdateFactura(id, this.newFactura).subscribe(
      res => {
        localStorage.removeItem('idfactura');
        this.router.navigate(['/formaPago']);
      },
      err => {
        console.log('Error al  Actualizar', err);
      }
    );
  }
  searchFiltrer() {
    this.listCanasta.filter = this.searchKey.trim().toLowerCase();
  }
  onSearchClear() {
    this.searchKey = '';
    this.searchFiltrer();
  }
  onCreate() {
    //  this.categoriaformvali.oninitializeFomrGroup();
    /*  const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '60%';
      this.dialog.open(CanastaComponent, dialogConfig);*/
  }
  onDelete(row) {
    this.detaventaService.onDeleteDetaVenta(row).subscribe(
      res => {
        console.log(res);
        this.onGetDetaVentaAll();
      },
      err => console.log(err)
    );
  }
  onCloseDialog() {
    //  this.categoriaformvali.formCategoria.reset();
    //  this.categoriaformvali.oninitializeFomrGroup();
    // this.matDialogRef.close();
  }
  addCero(i) {
    if (i < 10) {
      i = '000000' + i;
    }
    if (i >= 10 && i < 100) {
      i = '00000' + i;
    }
    if (i >= 100 && i < 1000) {
      i = '0000' + i;
    }
    if (i >= 1000 && i < 10000) {
      i = '000' + i;
    }
    if (i >= 10000 && i < 100000) {
      i = '00' + i;
    }
    if (i >= 100000 && i < 1000000) {
      i = '0' + i;
    }
    return i;
  }
}
