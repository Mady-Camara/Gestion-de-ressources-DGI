import { Component } from '@angular/core';
import { faGlobe, faEnvelope, faPhoneAlt, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',

  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  faGlobe = faGlobe;
  faEnvelope = faEnvelope;
  faPhoneAlt = faPhoneAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
}
