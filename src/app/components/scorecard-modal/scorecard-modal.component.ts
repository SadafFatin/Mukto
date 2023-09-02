import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Scorecard } from 'src/app/models/pnri_model';

@Component({
  selector: 'app-scorecard-modal',
  templateUrl: './scorecard-modal.component.html',
  styleUrls: ['./scorecard-modal.component.scss'],
})
export class ScorecardModalComponent implements OnInit {

  @Input() feature: Scorecard[];
  @Input() identifierColumn: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

}
