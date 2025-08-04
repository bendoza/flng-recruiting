import { Component, OnInit } from '@angular/core';
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
export class RecruitingComponent implements OnInit {
	constructor(private http: HttpClient) {}

	url = 'http://localhost:443/SendEmail';

	// UI state
	submitted = false;

	// DOB selects
	months = [
		{ value: '01', label: '01' }, { value: '02', label: '02' }, { value: '03', label: '03' },
		{ value: '04', label: '04' }, { value: '05', label: '05' }, { value: '06', label: '06' },
		{ value: '07', label: '07' }, { value: '08', label: '08' }, { value: '09', label: '09' },
		{ value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }
	];
	days: number[] = [];
	years: number[] = [];

	formData = {
		name: '',
		phone: '',
		referred_by: '',
		address: '',
		heightFeet: '',
		heightInches: '',
		weightLbs: '',
		dobMonth: '',
		dobDay: '',
		dobYear: '',
		DOB: '',
		height: '',
		weight: '',
		law_trouble: '',
		law_trouble_exp: '',
		education: '',
		marital: '',
		dependents: '',
		prior_service: '',
		message: ''
	};

	ngOnInit(): void {
		const currentYear = new Date().getFullYear();
		for (let y = currentYear; y >= 1950; y--) this.years.push(y);
		this.updateDays();
	}

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

	// Days depend on month/year
	updateDays() {
		const m = parseInt(this.formData.dobMonth || '1', 10);
		const y = parseInt(this.formData.dobYear || '2000', 10);
		const count = new Date(y, m, 0).getDate(); // last day of month
		this.days = Array.from({ length: count }, (_, i) => i + 1);
		// clamp selected day if needed
		if (this.formData.dobDay) {
			const d = parseInt(this.formData.dobDay, 10);
			if (d > count) this.formData.dobDay = String(count);
		}
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
	enforceDigits(field: 'heightFeet'|'heightInches'|'weightLbs'|'dependents'): void {
		this.formData[field] = (this.formData[field] ?? '').replace(/\D+/g, '');
	}

	submitForm(form: any) {
		this.submitted = true;
		this.updateDays();

		const errors: string[] = [];

		// Required basics
		if (!this.formData.name.trim()) errors.push('Name is required.');
		if (!this.formData.address.trim()) errors.push('Address is required.');

		// Phone required + length
		const phone10 = (this.formData.phone || '').replace(/\D/g, '');
		if (!phone10) errors.push('Phone number is required.');
		else if (phone10.length !== 10) errors.push('Phone number must be 10 digits.');

		// DOB required (from selects)
		if (!this.formData.dobMonth || !this.formData.dobDay || !this.formData.dobYear) {
			errors.push('Date of Birth is required.');
		} else {
			this.formData.DOB = `${this.formData.dobYear}-${this.formData.dobMonth}-${String(this.formData.dobDay).padStart(2, '0')}`;
		}

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
		if (!this.formData.prior_service) errors.push('Prior Service selection is required.');
		if (!this.formData.education) errors.push('Highest Level of Education is required.');
		if (!this.formData.marital) errors.push('Marital Status is required.');

		// Law trouble conditional
		if (!this.formData.law_trouble) {
			errors.push('Please answer whether you have been in trouble with the law.');
		} else if (this.formData.law_trouble === 'yes' && !this.formData.law_trouble_exp.trim()) {
			errors.push('Please explain the law trouble.');
		}

		if (errors.length > 0) {
			alert('Please fix the following:\n\n' + errors.join('\n'));
			return;
		}

		const payload = {
			name: this.formData.name,
			phone: this.formData.phone,
			referred_by: this.formData.referred_by,
			DOB: this.formData.DOB,
			height: this.formData.height,
			weight: this.formData.weight,
			law_trouble: this.formData.law_trouble,
			law_trouble_exp: this.formData.law_trouble_exp,
			prior_service: this.formData.prior_service,
			address: this.formData.address,
			education: this.formData.education,
			marital: this.formData.marital,
			dependents: this.formData.dependents
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
