import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../_modules/User';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input()
  user!: User; 

  constructor() { }

  ngOnInit() {
  }

}
