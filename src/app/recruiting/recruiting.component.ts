import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recruiting',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './recruiting.component.html',
  styleUrl: './recruiting.component.css'
})
export class RecruitingComponent {
  constructor(private http: HttpClient) {}

  url = 'http://localhost:443/SendEmail';

  formData = {
    name: '',
    phone: '',
    zip: '',
    message: ''
  };

  submitForm(form: any) {
    const errors: string[] = [];
  
    if (!this.formData.name.trim()) {
      errors.push('Name is required.');
    }
  
    if (!this.formData.phone.trim()) {
      errors.push('Phone number is required.');
    }
  
    if (!this.formData.zip.trim()) {
      errors.push('Zip code is required.');
    } else if (!/^\d{5}$/.test(this.formData.zip)) {
      errors.push('Zip code must be 5 digits.');
    }
  
    if (!this.formData.message.trim()) {
      errors.push('Message is required.');
    }
  
    if (errors.length > 0) {
      alert('Please fix the following:\n\n' + errors.join('\n'));
      return;
    }
  
    const payload = {
			name: this.formData.name,
			phone: this.formData.phone,
      zip: this.formData.zip,
			message: this.formData.message
		};

		this.http.post<{ success: boolean }>(this.url, payload).subscribe({
			next: (res) => {
				if (res.success) {
					alert('Message sent successfully!');
				} else {
					alert('There was a problem sending your message.');
				}
			},
			error: (err) => {
				console.error(err);
				alert('Something went wrong. Please try again later.');
			}
		});
  }   
}
