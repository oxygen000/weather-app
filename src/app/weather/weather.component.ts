import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city: string = '';
  weatherData: any;
  forecastData: any[] = []; 
  filteredCities: any[] = [];  
  errorMessage: string = '';
  currentDate: Date = new Date(); 
  isLoading: boolean = false; 

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  getWeather() {
    if (this.city) {
      this.isLoading = true; 
      this.weatherService.getWeather(this.city).subscribe(
        (data) => {
          this.weatherData = data;
          this.errorMessage = ''; 
          this.isLoading = false; 
  
          this.weatherService.getForecast(this.city).subscribe(
            (forecast) => {
              this.forecastData = forecast.list;
            },
            (error) => {
              this.forecastData = [];
              this.errorMessage = 'Unable to fetch forecast data.';
            }
          );
        },
        (error) => {
          this.weatherData = null;
          this.errorMessage = 'City not found or unable to fetch data. Please try again.';
          this.isLoading = false; 
        }
      );
    }
  }
  

  onCityInputChange(event: any) {
    const inputValue = event.target.value;

    if (inputValue) {
      this.isLoading = true;  
      this.weatherService.getCitySuggestions(inputValue).subscribe(
        (suggestions) => {
          this.filteredCities = suggestions;
          this.isLoading = false;  
        },
        (error) => {
          this.filteredCities = [];
          this.isLoading = false;  
        }
      );
    }
  }

  selectCity(city: string) {
    this.city = city;
    this.filteredCities = [];
    this.getWeather(); 
  }

  clearCity() {
    this.city = '';
    this.filteredCities = [];
  }

  getWeatherIcon(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
