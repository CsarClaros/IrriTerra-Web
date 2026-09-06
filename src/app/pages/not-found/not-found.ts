import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  SeoService
} from '../../core/services/seo.service';


@Component({
  selector:
    'app-not-found',

  standalone:
    true,

  imports: [
    RouterLink
  ],

  templateUrl:
    './not-found.html',

  styleUrl:
    './not-found.css'
})
export class NotFound
  implements OnInit {

  private readonly seoService =
    inject(
      SeoService
    );


  ngOnInit(): void {

    this.seoService.configurar({

      title:
        'Página no encontrada | Irriterra S.R.L.',

      description:
        'La página solicitada no existe.',

      path:
        '/',

      robots:
        'noindex, nofollow'

    });

  }

}