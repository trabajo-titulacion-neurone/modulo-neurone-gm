import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EndpointsService } from 'src/app/endpoints/endpoints.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.css']
})
export class WebhooksComponent implements OnInit {

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, protected endpointsService: EndpointsService, private location: Location,
              public translate: TranslateService, private toastr: ToastrService) { }
  formGroup: FormGroup;
  app_code: String;
  firstUrlTip: string;
  secondUrlTip: string;
  thirdUrlTip: string;
  fourthUrlTip: string;
  successMessage: string;
  webhooks: any;
  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.app_code = params.get('app_code');
     });
     this.translate.get('appManagement.firstUrlTip').subscribe(res => {
      this.firstUrlTip = res;
    });
    this.translate.get('appManagement.secondUrlTip').subscribe(res => {
      this.secondUrlTip = res;
    });
    this.translate.get('appManagement.thirdUrlTip').subscribe(res => {
      this.thirdUrlTip = res;
    });
    this.translate.get('appManagement.fourthUrlTip').subscribe(res => {
      this.fourthUrlTip = res;
    });
    this.translate.get('appManagement.updateWebhookMsg').subscribe(res => {
      this.successMessage = res;
    });
     this.formGroup = this.formBuilder.group({
      'givePointsUrl': [null, []],
      'challengeCompletedUrl': [null, []],
      'badgeAcquiredUrl': [null, []],
      'levelUpUrl': [null, []]
    });
     this.getWebhooks();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'givePointsUrl': [this.webhooks.givePointsUrl, []],
      'challengeCompletedUrl': [this.webhooks.challengeCompletedUrl, []],
      'badgeAcquiredUrl': [this.webhooks.badgeAcquiredUrl, []],
      'levelUpUrl': [this.webhooks.levelUpUrl, []]
    });
  }
  
  getWebhooks(){
    this.endpointsService.getWebhooks(this.app_code).subscribe((data: {webhook: object, ok: boolean}) => { // Success
      this.webhooks = data.webhook;
      this.createForm();
    },
    (error) => {
      console.error(error);
    });
  }

  submitForm(){
    let res = this.formGroup.value;
    this.endpointsService.updateWebhooks(res, this.app_code).subscribe((data: {webhook: object, ok: boolean}) => { // Success
      if(data.ok){
        this.getWebhooks();
        this.toastr.info(this.successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });

      }
    },
    (error) => {
      console.error(error);
    });
  }

  onClickNO(){
    this.location.back();
  }

}
