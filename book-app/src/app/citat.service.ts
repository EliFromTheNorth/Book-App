import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Citat {
  id?: number;
  text: string;
  author: string;
}

@Injectable({
  providedIn: 'root',
})
export class CitatService {
  private apiUrl = `${environment.apiUrl}/citater`;

  constructor(private http: HttpClient) {}

  getCitater() {
    return this.http.get<Citat[]>(this.apiUrl);
  }

  addCitat(citat: Citat) {
    return this.http.post<Citat>(this.apiUrl, citat);
  }

  updateCitat(id: number, citat: Citat) {
    return this.http.put<Citat>(`${this.apiUrl}/${id}`, citat);
  }

  deleteCitat(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
