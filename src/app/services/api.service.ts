import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  public getCountries(): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/all');
  }
}
