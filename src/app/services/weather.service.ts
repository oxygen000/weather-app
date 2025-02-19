import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '7cfcf11a07bf64e0c98602c25e577a91'; 
  private baseUrl: string = 'http://api.openweathermap.org/data/2.5/';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const params = new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric'); 

    return this.http
      .get<any>(`${this.baseUrl}weather`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching weather data:', error);
          throw error;
        })
      );
  }

  getCitySuggestions(query: string): Observable<any[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('appid', this.apiKey)
      .set('limit', '5'); 

    return this.http
      .get<any[]>(`${this.baseUrl}find`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching city suggestions:', error);
          return [];
        })
      );
  }

  getForecast(city: string): Observable<any> {
    const params = new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric'); 

    return this.http
      .get<any>(`${this.baseUrl}forecast`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching forecast data:', error);
          throw error;
        })
      );
  }
  
}
