import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CitatService } from '../citat.service';

@Component({
  selector: 'app-edit-citat',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-citat.html',
})
export class EditCitat implements OnInit {
  citat = { text: '', author: '' };
  id!: number;

  constructor(
    private citatService: CitatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.citatService.getCitater().subscribe(citater => {
      const found = citater.find(c => c.id === this.id);
      if (found) {
        this.citat = { text: found.text, author: found.author };
      }
    });
  }

  onSubmit() {
    this.citatService.updateCitat(this.id, this.citat).subscribe(() => {
      this.router.navigate(['/citat']);
    });
  }
}
