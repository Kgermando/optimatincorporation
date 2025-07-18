import { Injectable } from '@angular/core'; 
import { ApiService } from '../../services/api.service'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogsService  extends ApiService {
  endpoint: string = `${environment.apiUrl}/optimatincorporation/blogs`;

   
}