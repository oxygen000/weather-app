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
  forecastData: any[] = []; // لتخزين بيانات التوقعات الأسبوعية
  filteredCities: any[] = [];  // لإظهار المدن المقترحة
  errorMessage: string = '';
  currentDate: Date = new Date(); // لإظهار التاريخ والوقت الحالي
  isLoading: boolean = false; // لعرض مؤشر التحميل

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  getWeather() {
    if (this.city) {
      this.isLoading = true; // Show loading indicator
      this.weatherService.getWeather(this.city).subscribe(
        (data) => {
          this.weatherData = data;
          this.errorMessage = ''; // Clear error message if successful
          this.isLoading = false; // Stop loading indicator
  
          // Fetch the weekly forecast after getting the current weather
          this.weatherService.getForecast(this.city).subscribe(
            (forecast) => {
              this.forecastData = forecast.list; // Store the forecast data
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
          this.isLoading = false; // Stop loading indicator
        }
      );
    }
  }
  

  onCityInputChange(event: any) {
    const inputValue = event.target.value;

    if (inputValue) {
      this.isLoading = true;  // تفعيل مؤشر التحميل
      this.weatherService.getCitySuggestions(inputValue).subscribe(
        (suggestions) => {
          this.filteredCities = suggestions;
          this.isLoading = false;  // إيقاف مؤشر التحميل
        },
        (error) => {
          this.filteredCities = [];
          this.isLoading = false;  // إيقاف مؤشر التحميل
        }
      );
    }
  }

  // دالة لاختيار المدينة من القائمة المقترحة
  selectCity(city: string) {
    this.city = city;
    this.filteredCities = [];
    this.getWeather(); // جلب الطقس للمدينة المحددة
  }

  // دالة لمسح المدينة المكتوبة
  clearCity() {
    this.city = '';
    this.filteredCities = [];
  }

  // دالة للحصول على رابط الأيقونة الخاصة بالطقس
  getWeatherIcon(iconCode: string): string {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
