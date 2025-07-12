import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recruiting.component.html',
  styleUrl: './recruiting.component.css'
})
export class RecruitingComponent {

  url = 'https://eo3evkqk9dq52le.m.pipedream.net';

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
  
    const { name, phone, zip, message } = this.formData;
    alert(
      `Submitted Info:\nName: ${name}\nPhone: ${phone}\nZip: ${zip}\nMessage: ${message}`
    );
  }   
}
