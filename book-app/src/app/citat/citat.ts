import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { CitatService, Citat as CitatItem } from '../citat.service';

@Component({
  selector: 'app-citat',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './citat.html',
  styleUrl: './citat.css',
})
export class Citat implements OnInit {
  citater: CitatItem[] = [];
  showDeleteModal = false;
  pendingDeleteId: number | null = null;
  pendingDeleteText = '';

  constructor(private citatService: CitatService) {}

  ngOnInit() {
    this.citatService.getCitater().subscribe(citater => {
      this.citater = citater;
    });
  }

  deleteCitat(id: number, text: string) {
    this.pendingDeleteId = id;
    this.pendingDeleteText = text;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.pendingDeleteId == null) return;
    this.citatService.deleteCitat(this.pendingDeleteId).subscribe(() => {
      this.citater = this.citater.filter(c => c.id !== this.pendingDeleteId);
      this.cancelDelete();
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = null;
    this.pendingDeleteText = '';
  }
}
