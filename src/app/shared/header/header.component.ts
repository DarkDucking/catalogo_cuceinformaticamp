import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CartService } from 'src/app/modules/tienda-guest/service/cart.service';
import { TiendaGuestService } from 'src/app/modules/tienda-guest/service/tienda-guest.service';
import { environment } from 'src/environments/environment';


declare function cartSidenav():any;
declare function alertSuccess([]):any;
declare function _clickDocTwo():any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit{

  user:any = null;
  listCarts:any = [];
  totalSum:any = 0;

  search:any = null;

  @ViewChild("filter") filter?:ElementRef;
  source:any;
  listCourse:any = [];
  URL_BACKEND = environment.URL_BACKEND;
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public router:Router,
    public tiendaGuest: TiendaGuestService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.authService.user);
    this.user = this.authService.user;

    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce((sum:number, item:any) => sum + item.total,0);
    })

    if(this.user){
      this.cartService.listCart().subscribe((resp:any) => {
        console.log(resp);
        resp.carts.data.forEach((cart:any) => {
          this.cartService.addCart(cart);
        });
      })
    }

    setTimeout(() => {
      cartSidenav();
      _clickDocTwo();
    }, 50);
  }

  ngAfterViewInit(): void{
    this.source = fromEvent(this.filter?.nativeElement,"keyup");
    this.source.pipe(debounceTime(500)).subscribe((resp: any) => {
      console.log(this.search);

      //filtro
      let data = {
        search: this.search
      }
      this.tiendaGuest.listCourses(data).subscribe((resp:any) => {
        console.log(resp);
        this.listCourse = resp.courses.data;
      })
    })
  }

  logout(){
    this.authService.logout();
  }

  removeItem(cart:any){
    this.cartService.deleteCart(cart.id).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("EL ITEM SE A ELIMINADO CORRECTAMENTE ");
      this.cartService.removeItemCart(cart);
    })
  }

  searchCourse(){
    this.router.navigateByUrl("/list-de-cursos?search="+this.search);
  }
}
