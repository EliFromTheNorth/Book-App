import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CitatService } from '../citat.service';

@Component({
  selector: 'app-add-citat',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-citat.html',
})
export class AddCitat {
  citat = { text: '', author: '' };

  constructor(private citatService: CitatService, private router: Router) {}

  onSubmit() {
    this.citatService.addCitat(this.citat).subscribe(() => {
      this.router.navigate(['/citat']);
    });
  }
}
