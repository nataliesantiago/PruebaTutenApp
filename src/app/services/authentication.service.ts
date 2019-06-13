import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient){}

  getParamsHeader(password, app): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'password': password,
      'app': app
    });
  }

  // login
  login(email: string, password: string, app: string){
    const BODY = {
      "password": password,
      "app": app
    }
    const HEADERS = {
      headers: this.getParamsHeader(password, app)
    }
    return this.http.put<any>(`${environment.apiUrl}/${email}`, BODY, HEADERS).pipe(map(response => {
          if(response){
            let user = {
              "token": response.sessionTokenBck,
              "email": email
            }
            localStorage.setItem('currentUser', JSON.stringify(user));
          }

          return response;
        })
      );
  }

  logout(){
    localStorage.removeItem('currentUser');
  }
}

