import { Routes } from '@angular/router';
import { RecruitingComponent } from './recruiting/recruiting.component';

export const routes: Routes = [
    { path: '', component: RecruitingComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
