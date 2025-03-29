import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'src/app/core/models/menuItem';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [
    trigger('submenuAnimation', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: 0
      })),
      state('expanded', style({
        height: '*',
        opacity: 1
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit {
  sidebarOpen = true;
  selectedItem: string | null = null;
  animationsEnabled = false;

  menuItems: MenuItem[] = [
    {
      icon: 'person',
      title: 'Clients',
      expanded: true,
      children: [
        'Clients',
        'Client look history',
        'Emergency PIN configuration',
        'Emergency PIN history'
      ]
    }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.animationsEnabled = true;
    }, 100);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleMenuItem(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  selectMenuItem(item: string): void {
    this.selectedItem = item;
  }
}
