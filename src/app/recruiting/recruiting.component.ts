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

	// UI state
	submitted = false;

	formData = {
		name: '',
		phone: '',
		age: '',
		heightFeet: '',
		heightInches: '',
		weightLbs: '',
		height: '',
		weight: '',
		education: '',
		bring_a_buddy: '',
	};

	// Red border helper
	// in RecruitingComponent
  invalidClass(ctrl: any) {
    return ctrl && ctrl.invalid && (ctrl.touched || this.submitted)
      ? 'border-red-500 ring-1 ring-red-400'
      : 'border-gray-400';
  }  

	// Phone formatter: XXX-XXX-XXXX
	formatPhone() {
		const digits = (this.formData.phone || '').replace(/\D/g, '').slice(0, 10);
		const a = digits.slice(0, 3);
		const b = digits.slice(3, 6);
		const c = digits.slice(6, 10);
		this.formData.phone =
			c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a;
	}

	// Blocks e/E/+/-/. while allowing navigation & common shortcuts
	blockNonNumeric(event: KeyboardEvent): void {
		const allowed = new Set(['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','Home','End']);
		if (allowed.has(event.key)) return;

		// Allow Ctrl/Cmd+A/C/V/X
		if ((event.ctrlKey || event.metaKey) && ['a','c','v','x'].includes(event.key.toLowerCase())) return;

		const bad = ['e','E','+','-','.'];
		if (bad.includes(event.key)) event.preventDefault();
	}

	// Strips anything that isn't a digit from the bound string field
	enforceDigits(field: 'heightFeet'|'heightInches'|'weightLbs'): void {
		this.formData[field] = (this.formData[field] ?? '').replace(/\D+/g, '');
	}

	submitForm(form: any) {
		this.submitted = true;

		const errors: string[] = [];

		// Required basics
		if (!this.formData.name.trim()) errors.push('Name is required.');

		// Phone required + length
		const phone10 = (this.formData.phone || '').replace(/\D/g, '');
		if (!phone10) errors.push('Phone number is required.');
		else if (phone10.length !== 10) errors.push('Phone number must be 10 digits.');

		// Height required
		const feet = Number(this.formData.heightFeet);
		const inches = Number(this.formData.heightInches);
		if (isNaN(feet) || isNaN(inches) || this.formData.heightFeet === '' || this.formData.heightInches === '') {
			errors.push('Height (feet and inches) is required.');
		} else if (feet < 0 || feet > 8 || inches < 0 || inches > 11) {
			errors.push('Height must be between 0–8 ft and 0–11 in.');
		} else {
			this.formData.height = `${feet} ft ${inches} in`;
		}

		// Weight required
		const lbs = Number(this.formData.weightLbs);
		if (this.formData.weightLbs === '' || isNaN(lbs) || lbs <= 0) {
			errors.push('Weight (lbs) is required.');
		} else {
			this.formData.weight = `${lbs} lbs`;
		}

		// Selects required
		if (!this.formData.education) errors.push('Highest Level of Education is required.');

		if (!this.formData.bring_a_buddy) errors.push('Please answer the Bring a Buddy question.');

		if (errors.length > 0) {
			alert('Please fix the following:\n\n' + errors.join('\n'));
			return;
		}

		const payload = {
			name: this.formData.name,
			phone: this.formData.phone,
			age: String(this.formData.age),
			height: this.formData.height,
			weight: this.formData.weight,
			education: this.formData.education,
			BAB: this.formData.bring_a_buddy,
		};
    
		this.http.post<{ success: boolean }>(this.url, payload).subscribe({
			next: (res) => {
				if (res.success) {
					alert('Message sent successfully!');
					this.submitted = false;
					form.resetForm();
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
