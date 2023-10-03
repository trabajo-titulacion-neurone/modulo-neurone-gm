import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'NEURONE-GM-FRONT';

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['es-CL', 'en-US']);
    //Se usa la traducción a español si el navegador está en español
    if(navigator.language.split('-')[0] === 'es'){
      this.translate.use('es-CL');
    }
    //Si no por defecto se usa la traducción a inglés
    else{
      this.translate.use('en-US');
    }
  }
}
