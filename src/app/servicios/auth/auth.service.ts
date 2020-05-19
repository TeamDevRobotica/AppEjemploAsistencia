import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private router: Router
  ) { }


  login(postData: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers, withCredintials: false };
    return this.httpService.post('login', postData, options);
    
  }

  logout() {
    this.storageService.removeStorageItem('userData').then(res => {
      // console.log('Res ' + res);
      this.router.navigate(['']);
    });
  }
  
}