import { Routes } from '@angular/router';
import { StartComponent } from 'src/app/views/start/start.component';
import { ProductosComponent } from 'src/app/views/productos/productos.component';
import { CategoriaComponent } from 'src/app/views/categoria/categoria.component';
import { CategoriaformComponent } from 'src/app/views/categoria/categoriaform/categoriaform.component';
import { CategorialistComponent } from 'src/app/views/categoria/categorialist/categorialist.component';
import { ProductolistComponent } from 'src/app/views/productos/productolist/productolist.component';

export const AdminlayoutRoutingModule: Routes = [
    {path: '' , component: StartComponent},
    {path: 'productos' , component: ProductosComponent},
    {path: 'categorias' , component: CategoriaComponent},
    {path: 'categoriaList' , component: CategorialistComponent},
    {path: 'productoList' , component: ProductolistComponent}
];
